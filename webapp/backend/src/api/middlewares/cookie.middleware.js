
import asyncCatch from "./error.middleware.js";
import { MissingTokenError } from "../../utils/errors.js";

export default function cookieMiddleware(context, cookieName) {

    return asyncCatch(async (req, res, next) => {

        const token = req.cookies[cookieName];

        if (!token) {

            throw new MissingTokenError();
        }

        const payload = await context.auth.verifyToken(token);

        req.userId = payload.userId;

        next();
    });
}