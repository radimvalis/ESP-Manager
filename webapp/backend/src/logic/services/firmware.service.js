
import { ConflictError } from "../../utils/errors.js";

export default class FirmwareService {

    constructor(models) {

        this._models = models;
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