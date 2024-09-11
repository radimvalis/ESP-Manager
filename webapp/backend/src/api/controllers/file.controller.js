
import asyncCatch from "../middlewares/error.middleware.js";

export default function FileController(context) {

    this.getDefault = asyncCatch(async (req, res) => {

        const path = context.file.getDefaultPath(req.params["filename"]);

        res.sendFile(path);
    });

    this.getDefaultNVS = asyncCatch(async (req, res) => {

        await context.board.get(req.body.boardId, req.userId);

        const path = await context.file.getDefaultNVSPath(req.body.boardId);

        res.sendFile(path);
    });

    this.getConfigForm = asyncCatch(async (req, res) => {

        const path = context.file.getConfigFormPath(req.body.firmwareId);

        res.sendFile(path);
    });

    this.getFirmware = asyncCatch(async (req, res) => {

        const path = context.file.getFirmwarePath(req.params["id"]);

        console.log(path)
        res.sendFile(path);
    });

    this.getNVS = asyncCatch(async (req, res) => {

        const path = context.file.getNVSPath(req.params["id"]);

        console.log(path)
        res.sendFile(path);
    });
}