
import asyncCatch from "./error.middleware.js";
import { MissingTokenError } from "../../utils/errors.js";

export default function cookieMiddleware(cookieName, verifyFn) {

    return asyncCatch(async (req, res, next) => {

        const token = req.cookies[cookieName];

        if (!token) {

            throw new MissingTokenError();
        }

        const payload = await verifyFn(token);

        req.userId = payload.userId;

        next();
    });
}