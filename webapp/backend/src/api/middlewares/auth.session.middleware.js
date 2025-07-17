
import cookieMiddleware from "./cookie.middleware.js";

/**
 * Checks access token
 * @param {ApplicationContext} context 
 */
export default function authSessionMiddleware(context) {

    return cookieMiddleware(context.cookie.accessCookieName, (token) => context.auth.verifyAccessToken(token));
}