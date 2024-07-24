
import asyncCatch from "../middlewares/error.middleware.js";

export default function BoardController(context) {

    this.create = asyncCatch(async (req, res) => {

        const board = await context.board.create(req.body.name, req.userId);

        res.json(board).end();
    });
}