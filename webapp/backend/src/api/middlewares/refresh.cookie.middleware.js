
import cookieMiddleware from "./cookie.middleware.js";

export default function refreshCookieMiddleware(context) {

    return cookieMiddleware(context, context.cookie.refreshCookieName);
}