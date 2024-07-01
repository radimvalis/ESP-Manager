
import bcrypt from "bcrypt";
import {
    NotFoundError,
    WrongPasswordError,
    CredentialsValidationError
} from "../../utils/errors.js";

export default class UserService {

    _saltRounds = 10;

    constructor(models) {

        this._models = models;
    }

    async create(username, password) {

        if (!/^[a-z0-9]+$/i.test(username)) {

            throw new CredentialsValidationError();
        }

        const hashedPassword = await bcrypt.hash(password, this._saltRounds);

        const user = await this._models.User.create({ username, password: hashedPassword });

        return user;
    }

    async getByCredentials(username, password) {

        const user = await this._models.User.findOne({ where: { username } });

        if (user === null) {

            throw new NotFoundError();
        }

        const comparisonResult = await bcrypt.compare(password, user.password);

        if (!comparisonResult) {

            throw new WrongPasswordError();
        }

        return user;
    }
}