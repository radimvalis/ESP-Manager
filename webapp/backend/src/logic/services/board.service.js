
import { InvalidBoardNameError } from "../../utils/errors.js";

export default class BoardService {

    constructor(models) {

        this._models = models;
    }

    async create(name, userId) {

        const board = await this._models.board.findOne({ where: { name, userId } });

        if (board) {

            throw new InvalidBoardNameError();
        }

        const newBoard = await this._models.board.create({ name, userId });

        return newBoard.toJSON();
    }
}