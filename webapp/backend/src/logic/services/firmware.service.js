
import { InvalidInputError, NotFoundError, ConflictError } from "../../utils/errors.js";

export default class FirmwareService {

    constructor(config, fileService) {

        this._db = config.db;
        this._targets = config.targets;

        this._file = fileService;
    }

    async create(userId, body, files) {

        const name = body.name;
        const target = body.target;
        const firmwareFile = files[0];
        const configFormFile = files[1];

        // Validate input

        if (typeof name !== "string") {

            throw new InvalidInputError("Firmware name must be a string");
        }

        if (name.length < 3 || name.length > 20) {

            throw new InvalidInputError("Firmware name must be between 3 and 20 characters");
        }

        if (!/^[a-z0-9-_.]+$/i.test(name)) {

            throw new InvalidInputError("Firmware name can only contain alnum characters, -, _ and .");
        }

        if (!this._targets[target]) {

            throw new InvalidInputError("Target: " + target.toUpperCase() + " not supported");
        }

        // Check conflicts

        const firmware = await this._db.models.firmware.findOne({ where: { name, userId } });

        if (firmware) {

            throw new ConflictError("This firmware name already exists");
        }

        let newFirmwareId;

        try {

            return await this._db.transaction(async t => {

                // Create new firmware
    
                const hasConfig = typeof configFormFile !== "undefined";
    
                const newFirmware = await this._db.models.firmware.create({ name, userId, target, hasConfig, sizeB: firmwareFile.size }, { transaction: t });
    
                newFirmwareId = newFirmware.id;

                // Create firmware directory and save firmware file and its config form there
    
                await this._file.createFirmwareDir(newFirmware.id);
    
                await Promise.all([
    
                    this._file.saveFirmware(newFirmware.id, firmwareFile),
                    hasConfig ? this._file.saveConfigForm(newFirmware.id, configFormFile) : Promise.resolve()
                ]);

                return newFirmware.getSanitized();
            });
        }

        catch(e) {

            await this._file.tryDeleteFirmwareDir(newFirmwareId);

            throw e;
        }
    }

    async getAll(userId) {

        const firmwares = await this._db.models.firmware.findAll({ where: { userId } });

        return firmwares.map((f) => f.getSanitized());
    }

    async getOne(firmwareId) {

        const firmware = await this._db.models.firmware.findByPk(firmwareId);

        if (!firmware) {

            throw new NotFoundError();
        }

        return firmware.getSanitized();
    }

    async update(userId, firmwareId, newFirmwareFile) {
        
        return await this._db.transaction(async t => {

            const firmware = await this._getByIdAndUserId(firmwareId, userId);

            await firmware.increment("version", { transaction: t });
            await firmware.update({ sizeB: newFirmwareFile.size }, { transaction: t });
            await firmware.reload({ transaction: t });

            await this._file.saveFirmware(firmwareId, newFirmwareFile);

            return firmware.getSanitized();
        });
    }

    async delete(firmwareId, userId) {

        const firmware = await this._getByIdAndUserId(firmwareId, userId);

        await firmware.destroy();

        await this.tryForceDelete(firmwareId);
    }

    async tryForceDelete(firmwareId) {

        const firmware = await this._db.models.firmware.findByPk(firmwareId, { paranoid: false });

        // Must be soft deleted and must not be flashed

        if (firmware && firmware.deletedAt !== null && !await this._isFlashed(firmwareId)) {

            await firmware.destroy({ force: true });

            // No board is using this firmware anymore so we can delete its directory

            await this._file.tryDeleteFirmwareDir(firmwareId);
        }
    }

    async _getByIdAndUserId(firmwareId, userId, paranoid=true) {

        const firmware = await this._db.models.firmware.findByPk(firmwareId, { paranoid });

        if (!firmware || firmware.userId !== userId) {

            throw new NotFoundError();
        }

        return firmware;
    }

    async _isFlashed(firmwareId) {

        return (await this._db.models.board.count({ where: { firmwareId } })) > 0;
    }
}