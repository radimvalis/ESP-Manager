
import cookieMiddleware from "./cookie.middleware.js";

export default function authCookieMiddleware(context) {

    return cookieMiddleware(context, context.cookie.accessCookieName);
}