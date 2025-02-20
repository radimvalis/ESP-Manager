
import asyncCatch from "./error.middleware.js";
import { InvalidInputError } from "../../utils/errors.js";

export default function cookieMiddleware(cookieName, verifyFn) {

    return asyncCatch(async (req, res, next) => {

        const token = req.cookies[cookieName];

        if (!token) {

            throw new InvalidInputError("Authentication token is missing");
        }

        const payload = await verifyFn(token);

        if (!Object.hasOwn(payload, "userId")) {
        
            throw new InvalidInputError("Authentication token payload is in an invalid format");
        }
      
        req.userId = payload.userId;

        next();
    });
}