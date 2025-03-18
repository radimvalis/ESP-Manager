
import asyncCatch from "../middlewares/error.middleware.js";
import { InvalidInputError } from "../../utils/errors.js";
import { boardUpdateType } from "shared";

export default function BoardController(context) {

    this.create = asyncCatch(async (req, res) => {

        const board = await context.board.create(req.body.name, req.userId);

        try {

            await context.file.createBoardDir(board.id);
            await context.file.createDefaultNVS(req.body, board);
        }

        catch(e) {

            await context.board.delete(board.id, req.userId);

            throw e;           
        }

        res.json(board).end();
    });

    this.watchAll = asyncCatch(async (req, res) => {

        const abortController = new AbortController();

        const updateCb = (boards) => res.write(`data: ${JSON.stringify(boards)}\n\n`);

        _setupSSEConnection(res, abortController);

        await context.board.watchAll(req.userId, updateCb, abortController.signal);
    });

    this.watchOne = asyncCatch(async (req, res) => {

        const abortController = new AbortController();

        const updateCb = (board) => res.write(`data: ${JSON.stringify(board)}\n\n`);

        _setupSSEConnection(res, abortController);

        await context.board.watchOne(req.params.id, req.userId, updateCb, abortController.signal);
    });

    this.getAll = asyncCatch(async (req, res) => {

        const boards = await context.board.getAll(req.userId);

        res.json(boards).end();
    });

    this.getOne = asyncCatch(async (req, res) => {

        const board = await context.board.getOne(req.params.id, req.userId);

        res.json(board).end();
    });

    this.update = asyncCatch(async (req, res) => {

        const firmwareId = (await context.board.getOne(req.params.id, req.userId)).firmwareId;

        switch(req.body.type) {

            case boardUpdateType.flashBoard:

                await _flash(req, res);

                break;

            case boardUpdateType.updateFirmware:

                await _updateFirmware(req, res);

                break;

            case boardUpdateType.bootDefaultFirmware:

                await _bootDefaultFirmware(req, res);

                break;

            default:

                throw new InvalidInputError("Unknown update type");
        }

        await this._tryForceDeleteFirmware(firmwareId);
    });

    this.delete = asyncCatch(async (req, res) => {

        const firmwareId = (await context.board.getOne(req.params.id, req.userId)).firmwareId;

        await context.board.delete(req.params.id, req.userId);

        await context.file.deleteBoardDir(req.params.id);

        await this._tryForceDeleteFirmware(firmwareId);

        res.status(200).end();
    });

    const _setupSSEConnection = (res, abortController) => {

        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Connection", "keep-alive");
        res.flushHeaders();

        res.on("close", () => {

            abortController.abort();

            res.end();
        });
    };

    const _flash = async (req, res) => {

        const firmware = await context.firmware.getOne(req.body.firmwareId);

        if (firmware.hasConfig) {

            req.files.forEach(f => req.body[f.fieldname] = f.path);

            await context.file.createNVS(req.body, req.body.firmwareId, req.params.id);
        }

        const board = await context.board.flash(req.params.id, req.userId, firmware);

        res.json(board).end();
    };

    const _updateFirmware = async (req, res) => {

        const board = await context.board.updateFirmware(req.params.id, req.userId);

        res.json(board).end();
    };

    const _bootDefaultFirmware = async (req, res) => {

        const board = await context.board.bootDefaultFirmware(req.params.id, req.userId);

        res.json(board).end();
    };

    this._tryForceDeleteFirmware = async (firmwareId) => {

        if (await context.firmware.tryForceDelete(firmwareId)) {

            await context.file.deleteFirmwareDir(firmwareId);
        }
    }
}