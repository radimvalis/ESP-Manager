
import { ENDPOINT } from "shared";
import ApplicationContext from "./logic/index.js";
import start from "./api/index.js";

(async () => {

    const port = process.env.BACKEND_PORT || 4000;
    
    const config = {

        auth: {

            accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
            refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET
        },

        cookie: {

            accessCookieName: "accessCookie",
            refreshCookieName: "refreshCookie",
            accessCookiePath: "/",
            refreshCookiePath: ENDPOINT.AUTH.REFRESH_TOKENS
        }
    };

    const context = new ApplicationContext(config);

    start(context, port);
})();