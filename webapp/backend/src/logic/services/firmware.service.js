
import { InvalidInputError, NotFoundError, ConflictError } from "../../utils/errors.js";

export default class FirmwareService {

    constructor(config) {

        this._models = config.models;
        this._targets = config.targets;
    }

    async create(name, userId, target, hasConfig) {

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

        // Create new firmware

        const firmware = await this._models.firmware.findOne({ where: { name, userId } });

        if (firmware) {

            throw new ConflictError("This firmware name already exists");
        }

        const newFirmware = await this._models.firmware.create({ name, userId, target, hasConfig });

        return newFirmware.toJSON();        
    }

    async getAll(userId) {

        const firmwares = await this._models.firmware.findAll({ where: { userId } });

        return firmwares.map((f) => f.getSanitized());
    }

    async getOne(firmwareId) {

        const firmware = await this._models.firmware.findByPk(firmwareId);

        if (!firmware) {

            throw new NotFoundError();
        }

        return firmware.getSanitized();
    }

    async incrementVersion(firmwareId, userId) {

        const firmware = await this._getByIdAndUserId(firmwareId, userId);

        await firmware.increment("version");

        await firmware.reload();

        return firmware.toJSON();
    }

    async decrementVersion(firmwareId, userId) {

        const firmware = await this._getByIdAndUserId(firmwareId, userId);

        await firmware.decrement("version");

        await firmware.reload();

        return firmware.toJSON();
    }

    async setSizeB(firmwareId, userId, sizeB) {

        const firmware = await this._getByIdAndUserId(firmwareId, userId);

        await firmware.update({ sizeB });

        await firmware.reload();

        return firmware.toJSON();
    }

    async delete(firmwareId, userId) {

        const firmware = await this._getByIdAndUserId(firmwareId, userId);

        await firmware.destroy();
    }

    async tryForceDelete(firmwareId) {

        const firmware = await this._models.firmware.findByPk(firmwareId, { paranoid: false });

        // Must be soft deleted and must not be flashed

        if (!firmware || firmware.deletedAt === null || await this._isFlashed(firmwareId)) {

            return false;
        }

        await firmware.destroy({ force: true });

        return true;
    }

    async _getByIdAndUserId(firmwareId, userId, paranoid=true) {

        const firmware = await this._models.firmware.findByPk(firmwareId, { paranoid });

        if (!firmware || firmware.userId !== userId) {

            throw new NotFoundError();
        }

        return firmware;
    }

    async _isFlashed(firmwareId) {

        return (await this._models.board.count({ where: { firmwareId } })) > 0;
    }
}