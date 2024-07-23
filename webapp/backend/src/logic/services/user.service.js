
import bcrypt from "bcrypt";
import {
    NotFoundError,
    WrongPasswordError,
    CredentialsValidationError
} from "../../utils/errors.js";

export default class UserService {

    static _saltRounds = 10;

    constructor(models) {

        this._models = models;
    }

    async create(username, password) {

        if (!/^[a-z0-9]+$/i.test(username)) {

            throw new CredentialsValidationError();
        }

        const hashedPassword = await bcrypt.hash(password, UserService._saltRounds);

        const user = await this._models.user.create({ username, password: hashedPassword });

        return user.getSanitized();
    }

    async getByCredentials(username, password) {

        const user = await this._models.user.findOne({ where: { username } });

        if (!user) {

            throw new NotFoundError();
        }

        const comparisonResult = await bcrypt.compare(password, user.password);

        if (!comparisonResult) {

            throw new WrongPasswordError();
        }

        return user.getSanitized();
    }

    async getById(id) {

        const user = await this._models.user.findByPk(id);

        if (!user) {

            throw new NotFoundError();
        }

        return user.getSanitized();
    }
}