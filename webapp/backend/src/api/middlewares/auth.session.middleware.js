
import cookieMiddleware from "./cookie.middleware.js";

export default function authSessionMiddleware(context) {

    return cookieMiddleware(context.cookie.accessCookieName, (token) => context.auth.verifyAccessToken(token));
}