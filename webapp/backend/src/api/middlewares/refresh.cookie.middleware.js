
import cookieMiddleware from "./cookie.middleware.js";

export default function refreshCookieMiddleware(context) {

    return cookieMiddleware(context.cookie.refreshCookieName, (token) => context.auth.verifyRefreshToken(token));
}