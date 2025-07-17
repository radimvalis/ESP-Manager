
import { SignJWT, jwtVerify } from "jose";

export default class AuthService {

    /**
     * Creates AuthService
     * @param {object} config 
     */
    constructor(config) {

        this.accessTokenSecret = new TextEncoder().encode(config.auth.accessTokenSecret);
        this.refreshTokenSecret = new TextEncoder().encode(config.auth.refreshTokenSecret);
    }

    /**
     * Creates access and refres tokens
     * @param {string} userId 
     * @returns {object} - Acces and refresh token
     */
    async authenticate(userId) {

        const accessToken = await this._createAccessToken(userId);
        const refreshToken = await this._createRefreshToken(userId);

        return { accessToken, refreshToken };
    }

    /**
     * Verifies access token
     * @param {string} accessToken 
     * @returns {object} - Token payload
     */
    async verifyAccessToken(accessToken) {

        return (await jwtVerify(accessToken, this.accessTokenSecret)).payload;
    }

    /**
     * Verifies refresh token
     * @param {string} refreshToken 
     * @returns {object} - Token payload
     */
    async verifyRefreshToken(refreshToken) {

        return (await jwtVerify(refreshToken, this.refreshTokenSecret)).payload;
    }

    /**
     * Creates access JWT
     * @param {string} userId 
     * @returns {string} Access JWT
     */
    async _createAccessToken(userId) {

        return new SignJWT({ userId })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("10 mins")
            .sign(this.accessTokenSecret);
    }

    /**
     * Creates refresh JWT
     * @param {string} userId 
     * @returns {string} Refresh JWT
     */
    async _createRefreshToken(userId) {

        return new SignJWT({ userId })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1 day")
            .sign(this.refreshTokenSecret);
    }
}