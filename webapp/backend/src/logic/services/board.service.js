
import { InvalidInputError, ConflictError, NotFoundError } from "../../utils/errors.js";
import firmwareSizeLimit from "../../utils/limits.js";
import { endpoint, boardUpdateType } from "shared";
import { EventEmitter } from "events";
import { randomBytes } from "crypto";

export default class BoardService {

    constructor(config, fileService, firmwareService) {

        this._mqtt = config.mqtt;
        this._serverUrl = config.url.server;
        this._targets = config.targets;
        this._db = config.db;

        this._file = fileService;
        this._firmware = firmwareService;

        this._emitter = new EventEmitter();
    }

    async init() {

        await this._mqtt.subscribeAsync([
            
            "+/info/online",
            "+/info/offline",
            "+/info/update/ok",
            "+/info/update/error"
        ]);

        this._mqtt.on("message", async (topic, message) => {

            const [ boardId, type, messageId, result ] = topic.split("/");

            const board = await this._db.models.board.findByPk(boardId);

            if (board) {

                switch(messageId) {

                    case "online":

                        await this._setOnline(board.id);
                        break;

                    case "offline":

                        await this._setOffline(board.id);
                        break;
                    
                    case "update":

                        if (result === "ok") {

                            await this._finishUpdate(board.id, JSON.parse(message));
                        }

                        else if (result === "error") {

                            await this._cancelUpdate(board.id, JSON.parse(message));
                        }

                        break;
                }

                this._emitter.emit(board.userId);
            }
        });
    }

    getSupportedChips() {

        return Object.keys(this._targets);
    }

    async create(userId, body) {

        const name = body.name;
        const chipName = body.chipName;
        const flashSizeMB = body.flashSizeMB;

        // Validate input

        if (typeof name !== "string") {

            throw new InvalidInputError("Board name must be a string");
        }

        if (name.length < 3 || name.length > 20) {

            throw new InvalidInputError("Board name must be between 3 and 20 characters");
        }

        if (!/^[a-z0-9-_.]+$/i.test(name)) {

            throw new InvalidInputError("Board name can only contain alnum characters, -, _ and .");
        }

        if (!this._targets[chipName]) {

            throw new InvalidInputError("Chip: " + chipName.toUpperCase() + " not supported");
        }

        if (!this._targets[chipName].includes(flashSizeMB)) {

            throw new InvalidInputError("Chip and flash size combination not supported");
        }

        // Check conflicts

        const board = await this._db.models.board.findOne({ where: { name, userId } });
    
        if (board) {

            throw new ConflictError("This board name already exists");
        }

        let newBoardId;

        try {

            return await this._db.transaction(async t => {

                // Create new board

                const httpPassword = randomBytes(16).toString("hex");
                const mqttPassword = randomBytes(16).toString("hex");
       
                const newBoard = await this._db.models.board.create({ name, userId, httpPassword, mqttPassword, chipName: chipName.toLowerCase(), flashSizeMB }, { transaction: t });

                newBoardId = newBoard.id;

                await this._createMqttClient(newBoard);

                await this._file.createBoardDir(newBoard.id);
    
                await this._file.createDefaultNVS(body, newBoard);

                return newBoard.getSanitized();
            });
        }

        catch(e) {

            await this._file.tryDeleteBoardDir(newBoardId);

            throw e;
        }
    }

    async getAll(userId) {

        const boards = await this._db.models.board.findAll({
            
            where: { userId },
            include: [

                {
                    model: this._db.models.firmware,
                    attributes:  [ "version" ],
                    paranoid: false
                }
            ]
        });

        const boardsSanitized = boards.map((board) => {
            
            const sanitized = board.getSanitized();

            delete sanitized.firmware;
            delete sanitized.firmwareVersion;

            return sanitized;
        });

        return boardsSanitized;
    }

    async getOne(boardId, userId) {

        const board = await this._getByIdAndUserId(boardId, userId);

        return board.getSanitized();
    }

    async getByHttpCredentials(boardId, httpPassword) {

        const board = await this._db.models.board.findByPk(boardId);

        if (!board) {

            throw new NotFoundError("Board not found");
        }

        if (board.httpPassword !== httpPassword) {

            throw new InvalidInputError("Wrong password");
        }

        return board;
    }

    async watchAll(userId, updateCb, abortSignal) {

        const listener = async () => {

            const summaryList = await this.getAll(userId);

            updateCb(summaryList);
        };

        abortSignal.onabort = () => this._emitter.removeListener(userId, listener);

        this._emitter.on(userId, listener);
    }

    async watchOne(boardId, userId, updateCb, abortSignal) {

        const board = await this._getByIdAndUserId(boardId, userId);

        const listener = async () => {

            const board = await this._getByIdAndUserId(boardId, userId);

            updateCb(board.toJSON());
        };

        abortSignal.onabort = () => this._emitter.removeListener(board.userId, listener);

        this._emitter.on(board.userId, listener);
    }

    async update(boardId, userId, body, files) {

        switch(body.type) {

            case boardUpdateType.flashBoard:

                return await this._flash(boardId, userId, body, files);

            case boardUpdateType.updateFirmware:

                return await this._updateFirmware(boardId, userId);

            case boardUpdateType.bootDefaultFirmware:

                return await this._bootDefaultFirmware(boardId, userId);

            default:

                throw new InvalidInputError("Unknown update type");
        }
    }

    async delete(boardId, userId) {

        const board = await this._getByIdAndUserId(boardId, userId);

        const firmwareId = board.firmwareId;

        await this._deleteMqttClient(board);

        await board.destroy();

        await this._file.tryDeleteBoardDir(boardId);

        await this._firmware.tryForceDelete(firmwareId);
    }

    async _flash(boardId, userId, body, files) {

        const firmwareId = body.firmwareId;

        // Compile configuration

        const firmware = await this._firmware.getOne(firmwareId);

        if (firmware.hasConfig) {

            files.forEach(f => body[f.fieldname] = f.path);

            await this._file.createNVS(body, firmwareId, boardId);
        }

        // Flash

        const board = await this._getByIdAndUserId(boardId, userId);

        this._ensureBoardIsReadyForUpdate(board);
        this._ensureFirmwareFits(board, firmware);

        const message = {

            firmware_id: firmware.id,
            version: firmware.version,
            firmware_url: this._serverUrl + "/api" + endpoint.files.firmware(firmware.id)
        };

        if (firmware.hasConfig) {

            message.config_url = this._serverUrl + "/api" + endpoint.files.NVS(board.id);
        }

        await this._mqtt.publishAsync(board.id + "/cmd/update", JSON.stringify(message), { qos: 2 });

        await board.update({ isBeingUpdated: true });

        await board.reload();

        return board.getSanitized();        
    }

    async _updateFirmware(boardId, userId) {

        const board = await this._getByIdAndUserId(boardId, userId);

        this._ensureBoardIsReadyForUpdate(board);
        this._ensureFirmwareFits(board, board.firmware);

        if (board.firmwareStatus !== "update available") {

            throw new ConflictError("Update not possible - firmware is already up to date");
        }

        const message = {

            firmware_id: board.firmware.id,
            version: board.firmware.version,
            firmware_url: this._serverUrl + "/api" + endpoint.files.firmware(board.firmwareId)
        };

        await this._mqtt.publishAsync(board.id + "/cmd/update", JSON.stringify(message), { qos: 2 });

        await board.update({ isBeingUpdated: true });

        await board.reload();

        return board.getSanitized();
    }

    async _bootDefaultFirmware(boardId, userId) {

        const board = await this._getByIdAndUserId(boardId, userId);

        this._ensureBoardIsReadyForUpdate(board);

        if (board.firmwareStatus === "default") {

            throw new ConflictError("Update not possible - default firmware is already booted");
        }

        await this._mqtt.publishAsync(board.id + "/cmd/boot-default", null, { qos: 2 });

        await board.update({ isBeingUpdated: true });

        await board.reload();

        return board.getSanitized();
    }

    async _getByIdAndUserId(boardId, userId) {

        const board = await this._db.models.board.findByPk(boardId, { include: [ { model: this._db.models.firmware, paranoid: false } ] });

        if (!board || board.userId !== userId) {

            throw new NotFoundError();
        }

        return board;
    }

    _ensureBoardIsReadyForUpdate(board) {

        if (!board.isOnline) {

            throw new ConflictError("Update not possible - board is offline");
        }
    
        if (board.isBeingUpdated) {

            throw new ConflictError("Update in progress - wait until completion");
        }
    }

    _ensureFirmwareFits(board, firmware) {

        if (firmware.target !== board.chipName) {

            throw new InvalidInputError("Firmware is not compatible");
        }

        if (firmware.sizeB > firmwareSizeLimit[board.flashSizeMB + "MB"]) {

            throw new InvalidInputError("Firmware exceeds the available memory on the board");
        }
    }

    async _setOnline(boardId) {

        const board = await this._db.models.board.findByPk(boardId);

        if (board) {

            await board.update({ isOnline: true });
        }
    }

    async _setOffline(boardId) {

        const board = await this._db.models.board.findByPk(boardId);

        if (board) {

            await board.update({ isOnline: false, isBeingUpdated: false });
        }
    }

    async _finishUpdate(boardId, data) {

        const board = await this._db.models.board.findByPk(boardId);

        if (data.firmware_id === "default") {

            data.firmware_id = null;
            data.version = null;
        }

        const oldFirmwareId = board.firmwareId;

        if (board) {

            await board.update({ firmwareId: data.firmware_id, firmwareVersion: data.version, isBeingUpdated: false });

            await this._firmware.tryForceDelete(oldFirmwareId);
        }
    }

    async _cancelUpdate(boardId, data) {

        const board = await this._db.models.board.findByPk(boardId);

        if (board) {

            await board.update({ isBeingUpdated: false });
        }
    }

    async _createMqttClient(board) {

        const message = {

            commands: [
                {
                    command: "createClient",
                    username: board.id,
                    password: board.mqttPassword
                },
                {
                    command: "createRole",
                    rolename: board.id,
                    acls: [
                        {
                            acltype: "subscribePattern",
                            topic: board.id + "/#",
                            allow: true
                        },
                        {
                            acltype: "publishClientSend",
                            topic: board.id + "/#",
                            allow: true
                        }
                    ]
                },
                {
                    command: "addClientRole",
                    username: board.id,
                    rolename: board.id
                }
            ]
        };

        await this._mqtt.publishAsync("$CONTROL/dynamic-security/v1", JSON.stringify(message), { qos: 2 });
    }

    async _deleteMqttClient(board) {

        const message = {

            commands: [
                {
                    command: "deleteClient",
                    username: board.id
                },
                {
                    command: "deleteRole",
                    rolename: board.id
                }
            ]
        };

        await this._mqtt.publishAsync("$CONTROL/dynamic-security/v1", JSON.stringify(message), { qos: 2 });
    }
}