
import { errors } from "jose";
import { Sequelize } from "sequelize";

class MissingTokenError extends Error {
    
    constructor(...params) {

        super(...params);
        this.name = "MissingTokenError";
        this.statusCode = 400;
    }
}

class CredentialsValidationError extends Error {

    constructor(...params) {

        super(...params);
        this.name = "CredentialsValidationError";
        this.statusCode = 400;
    }
}

class WrongPasswordError extends Error {

    constructor(...params) {

        super(...params);
        this.name = "WrongPasswordError";
        this.statusCode = 401;
    }
}

errors.JWTExpired.prototype.statusCode = 401;

class NotFoundError extends Error {

    constructor(...params) {

        super(...params);
        this.name = "NotFoundError";
        this.statusCode = 404;
    }
}

Sequelize.UniqueConstraintError.prototype.statusCode = 409;

class NVSGenerationError extends Error {

    constructor(...params) {

        super(...params);
        this.name = "NVSGenerationError";
        this.statusCode = 500;
    }    
}

export {
    MissingTokenError,
    NotFoundError,
    WrongPasswordError,
    CredentialsValidationError,
    NVSGenerationError
};