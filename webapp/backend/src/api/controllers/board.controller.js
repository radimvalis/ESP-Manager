
import asyncCatch from "../middlewares/error.middleware.js";

export default function BoardController(context) {

    this.getSupportedChips = asyncCatch(async (req, res) => {

        const targets = context.board.getSupportedChips();
        
        res.json(targets);
    });

    this.create = asyncCatch(async (req, res) => {

        const newBoard = await context.board.create(req.userId, req.body);

        res.json(newBoard);
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

        res.json(boards);
    });

    this.getOne = asyncCatch(async (req, res) => {

        const board = await context.board.getOne(req.params.id, req.userId);

        res.json(board);
    });

    this.update = asyncCatch(async (req, res) => {

        const updatedBoard = await context.board.update(req.params.id, req.userId, req.body, req.files);

        res.json(updatedBoard);
    });

    this.delete = asyncCatch(async (req, res) => {

        await context.board.delete(req.params.id, req.userId);

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
}