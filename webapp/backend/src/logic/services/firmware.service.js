
import { ConflictError, NotFoundError } from "../../utils/errors.js";

export default class FirmwareService {

    constructor(models) {

        this._models = models;
    }

    async getByIdAndUserId(firmwareId, userId) {

        const firmware = await this._models.firmware.findByPk(firmwareId);

        if (!firmware || firmware.userId !== userId) {

            throw new NotFoundError();
        }

        return firmware.toJSON();
    }

    async getSummaryList(userId) {

        return await this._models.firmware.findAll({ where: { userId }, attributes: [ "id", "name", "version" ] });
    }

    async create(name, userId) {

        const firmware = await this._models.firmware.findOne({ where: { name, userId } });

        if (firmware) {

            throw new ConflictError();
        }

        const newFirmware = await this._models.firmware.create({ name, userId });

        return newFirmware.toJSON();        
    }
}