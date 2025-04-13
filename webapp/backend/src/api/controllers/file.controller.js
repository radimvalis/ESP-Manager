
import asyncCatch from "../middlewares/error.middleware.js";

export default function FileController(context) {

    this.getDefaultFirmware = asyncCatch(async (req, res) => {

        const board = await context.board.getOne(req.params.id, req.userId);

        const path = context.file.getDefaultFirmwarePath(board.chipName);

        res.sendFile(path);
    });

    this.getDefaultConfigForm = asyncCatch(async (req, res) => {

        const path = context.file.getDefaultConfigFormPath();

        res.sendFile(path);
    });

    this.getDefaultNVS = asyncCatch(async (req, res) => {

        await context.board.getOne(req.params.id, req.userId);

        const path = await context.file.getDefaultNVSPath(req.params.id);

        res.sendFile(path);
    });

    this.getBootloader = asyncCatch(async (req, res) => {

        const board = await context.board.getOne(req.params.id, req.userId);

        const path = context.file.getBootloaderPath(board.chipName, board.flashSizeMB);

        res.sendFile(path);
    });

    this.getPartitionTable = asyncCatch(async (req, res) => {

        const board = await context.board.getOne(req.params.id, req.userId);

        const path = context.file.getPartitionTablePath(board.flashSizeMB);

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

        const path = context.file.getNVSPath(req.boardId);

        res.sendFile(path);
    });
}