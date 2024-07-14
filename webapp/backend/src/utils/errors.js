
class MissingTokenError extends Error {
    
    constructor(...params) {

        super(...params);
        this.name = "MissingTokenError";
    }
}

class NotFoundError extends Error {

    constructor(...params) {

        super(...params);
        this.name = "NotFoundError";
    }
}

class CredentialsValidationError extends Error {

    constructor(...params) {

        super(...params);
        this.name = "CredentialsValidationError";
    }
}

class WrongPasswordError extends Error {

    constructor(...params) {

        super(...params);
        this.name = "WrongPasswordError";
    }
}

class NVSGenerationError extends Error {

    constructor(...params) {

        super(...params);
        this.name = "NVSGenerationError";
    }    
}

export {
    MissingTokenError,
    NotFoundError,
    WrongPasswordError,
    CredentialsValidationError,
    NVSGenerationError
};