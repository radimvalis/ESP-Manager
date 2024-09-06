
import cookieMiddleware from "./cookie.middleware.js";

export default function authCookieMiddleware(context) {

    return cookieMiddleware(context.cookie.accessCookieName, (token) => context.auth.verifyAccessToken(token));
}