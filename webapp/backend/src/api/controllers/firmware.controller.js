
import asyncCatch from "../middlewares/error.middleware.js";

export default function FirmwareController(context) {

    this.get = asyncCatch(async (req, res) => {

        const firmware = await context.firmware.getByIdAndUserId(req.body.firmwareId, req.userId);

        res.json(firmware).end();
    });

    this.getSummaryList = asyncCatch(async (req, res) => {

        const firmwaresSummary = await context.firmware.getSummaryList(req.userId);

        res.json(firmwaresSummary).end();
    });

    this.create = asyncCatch(async (req, res) => {

        const firmware = await context.firmware.create(req.body.name, req.userId);

        const firmwarePath = req.files[0].path;
        const configFormPath = req.files[1].path;

        await context.file.createFirmwareDir(firmware.id);

        await Promise.all([

            context.file.moveFirmwareToDedicatedDir(firmware.id, firmwarePath),
            context.file.moveConfigFormToDedicatedDir(firmware.id, configFormPath)
        ]);

        res.json(firmware).end();
    });
}