
import { Sequelize } from "sequelize";

class InvalidInputError extends Error {

    constructor(...params) {

        super(...params);
        this.name = "InvalidInputError";
        this.statusCode = 400;
    }
}

class AuthorizationError extends Error {

    constructor(...params) {

        super(...params);
        this.name = "AuthorizationError";
        this.statusCode = 401;
    }
}


class NotFoundError extends Error {

    constructor(...params) {

        super(...params);
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}

Sequelize.UniqueConstraintError.prototype.statusCode = 409;

class ConflictError extends Error {

    constructor(...params) {

        super(...params);
        this.name = "ConflictError";
        this.statusCode = 409;
    }
}

class NVSGenerationError extends Error {

    constructor(...params) {

        super(...params);
        this.name = "NVSGenerationError";
        this.statusCode = 500;
    }    
}

export {
    InvalidInputError,
    AuthorizationError,
    NotFoundError,
    ConflictError,
    NVSGenerationError
};