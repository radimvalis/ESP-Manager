
import asyncCatch from "../middlewares/error.middleware.js";

export default function BoardController(context) {

    this.get = asyncCatch(async (req, res) => {

        const board = await context.board.get(req.body.boardId, req.userId);

        res.json(board).end();
    });

    this.getSummaryList = asyncCatch(async (req, res) => {

        const boardsSummary = await context.board.getSummaryList(req.userId);

        res.json(boardsSummary).end();
    });

    this.register = asyncCatch(async (req, res) => {

        const board = await context.board.create(req.body.name, req.userId);

        await context.file.createBoardDir(board.id);

        await context.file.createDefaultNVS(req.body, board);

        res.json(board).end();
    });

    this.flash = asyncCatch(async (req, res) => {

        await context.file.createNVS(req.body.configData, req.body.firmwareId, req.body.boardId);

        const firmware = await context.firmware.getPublic(req.body.firmwareId);

        const board = await context.board.flash(req.body.boardId, req.userId, firmware);

        res.json(board).end();
    });

    this.update = asyncCatch(async (req, res) => {

        const board = await context.board.update(req.body.boardId, req.userId);

        res.json(board).end();
    });

    this.bootDefault = asyncCatch(async (req, res) => {

        const board = await context.board.bootDefault(req.body.boardId, req.userId);

        res.json(board).end();
    });

    this.delete = asyncCatch(async (req, res) => {

        await context.board.delete(req.body.boardId, req.userId);

        await context.file.deleteBoardDir(req.body.boardId);

        res.status(200).end();
    });
}