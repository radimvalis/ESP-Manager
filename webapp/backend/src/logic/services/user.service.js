
import bcrypt from "bcrypt";
import {
    InvalidInputError,
    AuthorizationError,
    NotFoundError
} from "../../utils/errors.js";

export default class UserService {

    static _saltRounds = 10;

    constructor(models) {

        this._models = models;
    }

    async create(username, password) {

        // Validate credentials

        if (typeof username !== "string" || typeof password !== "string") {

            throw new InvalidInputError("Username and password mus be strings");
        }

        if (username.length < 3 || username.length > 10) {

            throw new InvalidInputError("Username must be between 3 and 10 characters");
        }

        if (!/^[a-z0-9]+$/i.test(username)) {

            throw new InvalidInputError("Username can only contain alnum characters");
        }

        // Create new user

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

            throw new AuthorizationError();
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