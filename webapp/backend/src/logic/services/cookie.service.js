
import { serialize } from "cookie";

export default class CookieService {

    constructor(config) {

        this.accessCookieName = config.accessCookieName;
        this.refreshCookieName = config.refreshCookieName;
    
        this.accessCookiePath = config.accessCookiePath;
        this.refreshCookiePath = config.refreshCookiePath;
    }

    getCookiesFromTokens(tokens) {

        return [

            this._createCookie(tokens.accessToken, this.accessCookieName, this.accessCookiePath),
            this._createCookie(tokens.refreshToken, this.refreshCookieName, this.refreshCookiePath)
        ];
    }

    _createCookie(data, cookieName, cookiePath) {

        const cookieOptions = {

            httpOnly: true,
            sameSite: true,
            path: cookiePath
        };

        return serialize(cookieName, data, cookieOptions);   
    }
}