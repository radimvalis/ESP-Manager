
import { InvalidInputError, NotFoundError, ConflictError } from "../../utils/errors.js";

export default class FirmwareService {

    constructor(models) {

        this._models = models;
    }

    async create(name, userId) {

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

        // Create new firmware

        const firmware = await this._models.firmware.findOne({ where: { name, userId } });

        if (firmware) {

            throw new ConflictError();
        }

        const newFirmware = await this._models.firmware.create({ name, userId });

        return newFirmware.toJSON();        
    }

    async getAll(userId) {

        return await this._models.firmware.findAll({ where: { userId }, attributes: [ "id", "name", "version" ] });
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

    async delete(firmwareId, userId) {

        const firmware = await this._getByIdAndUserId(firmwareId, userId);

        await firmware.destroy();
    }

    async _getByIdAndUserId(firmwareId, userId) {

        const firmware = await this._models.firmware.findByPk(firmwareId);

        if (!firmware || firmware.userId !== userId) {

            throw new NotFoundError();
        }

        return firmware;
    }
}