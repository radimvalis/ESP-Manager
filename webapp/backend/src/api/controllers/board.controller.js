
import asyncCatch from "../middlewares/error.middleware.js";

export default function BoardController(context) {

    this.get = asyncCatch(async (req, res) => {

        const board = await context.board.getByIdAndUserId(req.body.boardId, req.userId);

        res.json(board).end();
    });

    this.getSummaryList = asyncCatch(async (req, res) => {

        const boardsSummary = await context.board.getSummaryList(req.userId);

        res.json(boardsSummary).end();
    });

    this.register = asyncCatch(async (req, res) => {

        const board = await context.board.create(req.body.name, req.userId);

        await context.file.createBoardDir(board.id);

        await context.file.createDefaultNVS(req.body, board.id);

        res.json(board).end();
    });
}