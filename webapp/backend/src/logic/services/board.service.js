
import { InvalidInputError, ConflictError, NotFoundError } from "../../utils/errors.js";
import { endpoint } from "shared";
import { EventEmitter } from "events";
import { randomBytes } from "crypto";

export default class BoardService {

    constructor(config) {

        this._models = config.models;
        this._mqtt = config.mqtt;
        this._serverUrl = config.url.server;
        this._emitter = new EventEmitter();
    }

    async init() {

        await this._mqtt.subscribeAsync([
            
            "+/info/online",
            "+/info/offline",
            "+/info/update=ok",
            "+/info/update=error"
        ]);

        this._mqtt.on("message", async (topic, message) => {

            const [ boardId, type, messageId ] = topic.split("/");

            const board = await this._models.board.findByPk(boardId);

            if (board) {

                switch(messageId) {

                    case "online":

                        await this._setOnline(board.id);
                        break;

                    case "offline":

                        await this._setOffline(board.id);
                        break;

                    case "update=ok":

                        await this._finishUpdate(board.id, JSON.parse(message));
                        break;

                    case "update=error":

                        await this._cancelUpdate(board.id, JSON.parse(message));
                        break;
                }

                this._emitter.emit(board.userId);
            }
        });
    }

    async create(name, userId) {

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

        // Create new board

        const board = await this._models.board.findOne({ where: { name, userId } });

        if (board) {

            throw new ConflictError("This board name already exists");
        }

        const mqttPassword = randomBytes(16).toString("hex");

        const newBoard = await this._models.board.create({ name, userId, mqttPassword });

        // Create new MQTT client for given board

        await this._createMqttClient(newBoard);

        return newBoard.toJSON();
    }

    async getAll(userId) {

        const boards = await this._models.board.findAll({
            
            where: { userId },
            include: [

                {
                    model: this._models.firmware,
                    attributes:  [ "version" ]
                }
            ],
            attributes: [ "id", "name", "isOnline", "firmwareVersion", "firmwareStatus" ]
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

        return board.toJSON();
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

            const board = await this._models.board.findByPk(boardId, { include: [ this._models.firmware ] });

            updateCb(board.toJSON());
        };

        abortSignal.onabort = () => this._emitter.removeListener(board.userId, listener);

        this._emitter.on(board.userId, listener);
    }

    async flash(boardId, userId, firmware) {
        
        const board = await this._getByIdAndUserId(boardId, userId);

        this._ensureBoardIsReadyForUpdate(board);

        const message = {

            firmware_id: firmware.id,
            version: firmware.version,
            firmware_url: this._serverUrl + "/api" + endpoint.files.firmware(firmware.id),
            config_url: this._serverUrl + "/api" + endpoint.files.nvs(board.id)
        };

        await this._mqtt.publishAsync(board.id + "/cmd/update", JSON.stringify(message), { qos: 2 });

        await board.update({ isBeingUpdated: true });

        await board.reload();

        return board.toJSON();
    }

    async updateFirmware(boardId, userId) {

        const board = await this._getByIdAndUserId(boardId, userId);

        this._ensureBoardIsReadyForUpdate(board);

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

        return board.toJSON();
    }

    async bootDefaultFirmware(boardId, userId) {

        const board = await this._getByIdAndUserId(boardId, userId);

        this._ensureBoardIsReadyForUpdate(board);

        if (board.firmwareStatus !== "default") {

            throw new ConflictError("Update not possible - default firmware is already booted");
        }

        await this._mqtt.publishAsync(board.id + "/cmd/boot-default", null, { qos: 2 });

        await board.update({ isBeingUpdated: true });

        await board.reload();

        return board.toJSON();
    }

    async delete(boardId, userId) {

        const board = await this._getByIdAndUserId(boardId, userId);

        await this._deleteMqttClient(board);

        await board.destroy();
    }

    async _getByIdAndUserId(boardId, userId) {

        const board = await this._models.board.findByPk(boardId, { include: [ this._models.firmware ] });

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

    async _setOnline(boardId) {

        const board = await this._models.board.findByPk(boardId);

        if (board) {

            await board.update({ isOnline: true });
        }
    }

    async _setOffline(boardId) {

        const board = await this._models.board.findByPk(boardId);

        if (board) {

            await board.update({ isOnline: false });
        }
    }

    async _finishUpdate(boardId, data) {

        const board = await this._models.board.findByPk(boardId);

        if (data.firmware_id === "default") {

            data.firmware_id = null;
            data.version = null;
        }

        if (board) {

            await board.update({ firmwareId: data.firmware_id, firmwareVersion: data.version, isBeingUpdated: false });
        }
    }

    async _cancelUpdate(boardId, data) {

        const board = await this._models.board.findByPk(boardId);

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