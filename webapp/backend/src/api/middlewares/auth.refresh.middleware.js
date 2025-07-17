
import cookieMiddleware from "./cookie.middleware.js";

/**
 * Checks refresh cookie
 * @param {ApplicationContext} context 
 */
export default function authRefreshMiddleware(context) {

    return cookieMiddleware(context.cookie.refreshCookieName, (token) => context.auth.verifyRefreshToken(token));
}