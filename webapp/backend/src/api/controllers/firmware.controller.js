
import asyncCatch from "../middlewares/error.middleware.js";

export default function FirmwareController(context) {

    this.create = asyncCatch(async (req, res) => {

        const newFirmware = await context.firmware.create(req.userId, req.body, req.files);

        res.json(newFirmware);
    });

    this.getAll = asyncCatch(async (req, res) => {

        const firmwares = await context.firmware.getAll(req.userId);

        res.json(firmwares);
    });

    this.getOne = asyncCatch(async (req, res) => {

        const firmware = await context.firmware.getOne(req.params.id);

        res.json(firmware);
    });

    this.update = asyncCatch(async (req, res) => {

        const updatedFirmware = await context.firmware.update(req.userId, req.body, req.file);

        res.json(updatedFirmware);
    });

    this.delete = asyncCatch(async (req, res) => {

        await context.firmware.delete(req.params.id, req.userId);

        res.status(200).end();
    });
}