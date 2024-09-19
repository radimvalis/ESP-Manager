
import asyncCatch from "../middlewares/error.middleware.js";

export default function BoardController(context) {

    const _setupSSEConnection = (res, abortController) => {

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        res.on("close", () => {

            abortController.abort();

            res.end();
        });
    };

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

    this.watch = asyncCatch(async (req, res) => {

        const abortController = new AbortController();

        const updateCb = (board) => res.write(`data: ${JSON.stringify(board)}\n\n`);

        _setupSSEConnection(res, abortController);

        await context.board.watch(req.params["id"], req.userId, updateCb, abortController.signal);
    });

    this.watchAll = asyncCatch(async (req, res) => {

        const abortController = new AbortController();

        const updateCb = (boards) => res.write(`data: ${JSON.stringify(boards)}\n\n`);

        _setupSSEConnection(res, abortController);

        await context.board.watchAll(req.userId, updateCb, abortController.signal);
    });

    this.flash = asyncCatch(async (req, res) => {

        req.files.forEach(f => req.body[f.fieldname] = f.path);

        await context.file.createNVS(req.body, req.body.firmwareId, req.body.boardId);

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