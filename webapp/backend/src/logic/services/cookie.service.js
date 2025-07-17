
import { serialize } from "cookie";

export default class CookieService {

    /**
     * Creates CookieService
     * @param {object} config 
     */
    constructor(config) {

        this.accessCookieName = config.cookie.accessCookieName;
        this.refreshCookieName = config.cookie.refreshCookieName;
    
        this.accessCookiePath = config.cookie.accessCookiePath;
        this.refreshCookiePath = config.cookie.refreshCookiePath;
    }

    /**
     * Converts tokens to cookie headers
     * @param {object} tokens  
     * @returns {Array<string>} Tokens converted to cookie headers
     */
    getCookiesFromTokens(tokens) {

        return [

            this._createCookie(tokens.accessToken, this.accessCookieName, this.accessCookiePath),
            this._createCookie(tokens.refreshToken, this.refreshCookieName, this.refreshCookiePath)
        ];
    }

    /**
     * Serializes data into cookie header
     * @param {any} data 
     * @param {string} cookieName 
     * @param {string} cookiePath 
     * @returns {string} Cookie header
     */
    _createCookie(data, cookieName, cookiePath) {

        const cookieOptions = {

            httpOnly: true,
            sameSite: true,
            path: cookiePath
        };

        // Serialize data into cookie header

        return serialize(cookieName, data, cookieOptions);   
    }
}