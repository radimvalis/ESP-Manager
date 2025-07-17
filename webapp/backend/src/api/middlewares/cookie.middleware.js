
import asyncCatch from "./error.middleware.js";
import { InvalidInputError, AuthorizationError } from "../../utils/errors.js";

/**
 * 
 * @param {string} cookieName - Cookie name to check 
 * @param {(token: string) => object} verifyFn - Function that verifies token stored in cookieName
 * @returns 
 */
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