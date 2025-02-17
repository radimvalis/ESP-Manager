
import asyncCatch from "../middlewares/error.middleware.js";

export default function FileController(context) {

    this.getDefaultFirmware = asyncCatch(async (req, res) => {

        const path = context.file.getDefaultPath("firmware");

        res.sendFile(path);
    });

    this.getDefaultConfigForm = asyncCatch(async (req, res) => {

        const path = context.file.getDefaultPath("config-form");

        res.sendFile(path);
    });

    this.getDefaultBootloader = asyncCatch(async (req, res) => {

        const path = context.file.getDefaultPath("bootloader");

        res.sendFile(path);
    });

    this.getDefaultPartitionTable = asyncCatch(async (req, res) => {

        const path = context.file.getDefaultPath("partition-table");

        res.sendFile(path);
    });

    this.getDefaultNVS = asyncCatch(async (req, res) => {

        await context.board.getOne(req.params.id, req.userId);

        const path = await context.file.getDefaultNVSPath(req.params.id);

        res.sendFile(path);
    });

    this.getConfigForm = asyncCatch(async (req, res) => {

        const path = context.file.getConfigFormPath(req.params.id);

        res.sendFile(path);
    });

    this.getFirmware = asyncCatch(async (req, res) => {

        const path = context.file.getFirmwarePath(req.params.id);

        res.sendFile(path);
    });

    this.getNVS = asyncCatch(async (req, res) => {

        const path = context.file.getNVSPath(req.params.id);

        res.sendFile(path);
    });
}