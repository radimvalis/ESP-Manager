
import { errors } from "jose";
import { Sequelize } from "sequelize";
import {
    MissingTokenError,
    NotFoundError,
    WrongPasswordError,
    CredentialsValidationError
} from "../../utils/errors.js";

// https://thecodebarbarian.com/80-20-guide-to-express-error-handling
// https://github.com/curityio/oauth-agent-node-express/blob/master/src/middleware/exceptionMiddleware.ts

export default function asyncCatch(fn) {

    return (req, res, next) => {

        fn(req, res, next).catch((err) => errorMiddleware(err, req, res, next));
    };
}

function errorMiddleware(err, req, res, next) {

    if (err instanceof MissingTokenError || err instanceof CredentialsValidationError) {

        res.status(400).send(err);
    }

    else if (err instanceof errors.JWTExpired || err instanceof WrongPasswordError) {

        res.status(401).send(err);
    }

    else if (err instanceof NotFoundError) {

        res.status(404).send(err);
    }

    else if (err instanceof Sequelize.UniqueConstraintError) {

        res.status(409).send(err);
    }

    else {

        res.status(500).end();
    }
}