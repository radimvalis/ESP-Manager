
import asyncCatch from "./error.middleware.js";
import { InvalidInputError, AuthorizationError } from "../../utils/errors.js";

export default function cookieMiddleware(cookieName, verifyFn) {

    return asyncCatch(async (req, res, next) => {

        const token = req.cookies[cookieName];

        if (!token) {

            throw new InvalidInputError("Authentication token is missing");
        }

        let payload;

        try {

            payload = await verifyFn(token);
        }

        catch {

            throw new AuthorizationError("Token verification has failed");
        }
      
        req.userId = payload.userId;

        next();
    });
}