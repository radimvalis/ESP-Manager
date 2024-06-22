
import asyncCatch from "../middlewares/error.middleware.js";

export default function AuthController(context) {

    this.logIn = asyncCatch(async (req, res) => {

        const user = await context.user.getByCredentials(req.body.username, req.body.password);
        const tokens = await context.auth.authenticate(user.id);
        const cookies = context.cookie.getCookiesFromTokens(tokens);

        res.setHeader("Set-Cookie", cookies).status(204).end();
    });

    this.signUp = asyncCatch(async (req, res) => {

        const user = await context.user.create(req.body.username, req.body.password);
        const tokens = await context.auth.authenticate(user.id);
        const cookies = context.cookie.getCookiesFromTokens(tokens);

        res.setHeader("Set-Cookie", cookies).status(204).end();
    });

    this.logOut = asyncCatch(async (req, res) => {

        res.clearCookie(context.cookie.accessCookieName, { path: context.cookie.accessCookiePath });
        res.clearCookie(context.cookie.refreshCookieName, { path: context.cookie.refreshCookiePath });
        res.status(204).end();
    });

    this.refreshTokens = asyncCatch(async (req, res) => {

        const tokens = await context.auth.authenticate(req.userId);
        const cookies = context.cookie.getCookiesFromTokens(tokens);

        res.setHeader("Set-Cookie", cookies).status(204).end();
    });
}