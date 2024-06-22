
class MissingTokenError extends Error {
    
    constructor(...params) {

        super(...params);
        this.name = "MissingTokenError";
    }
}

export { MissingTokenError };