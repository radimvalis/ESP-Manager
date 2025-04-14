
import bcrypt from "bcrypt";
import { UniqueConstraintError } from "sequelize";
import {
    InvalidInputError,
    NotFoundError,
    ConflictError
} from "../../utils/errors.js";

export default class UserService {

    static _saltRounds = 10;

    constructor(config) {

        this._db = config.db;
    }

    async create(body) {

        const username = body.username;
        const password = body.password;

        // Validate credentials

        if (typeof username !== "string" || typeof password !== "string") {

            throw new InvalidInputError("Username and password must be strings");
        }

        if (username.length < 3 || username.length > 20) {

            throw new InvalidInputError("Username must be between 3 and 20 characters");
        }

        if (!/^[a-z0-9-_.]+$/i.test(username)) {

            throw new InvalidInputError("Username can only contain alnum characters, -, _ and .");
        }

        // Create new user

        try {

            const hashedPassword = await bcrypt.hash(password, UserService._saltRounds);

            const user = await this._db.models.user.create({ username, password: hashedPassword });

            return user.getSanitized();
        }

        catch(error) {

            if (error instanceof UniqueConstraintError) {

                throw new ConflictError("This username is already taken");
            }

            throw error;
        }
    }

    async getByCredentials(body) {

        const username = body.username;
        const password = body.password;

        const user = await this._db.models.user.findOne({ where: { username } });

        if (!user) {

            throw new NotFoundError("Username not found");
        }

        const comparisonResult = await bcrypt.compare(password, user.password);

        if (!comparisonResult) {

            throw new InvalidInputError("Wrong password");
        }

        return user.getSanitized();
    }

    async getById(id) {

        const user = await this._db.models.user.findByPk(id);

        if (!user) {

            throw new NotFoundError();
        }

        return user.getSanitized();
    }
}