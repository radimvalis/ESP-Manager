
import { SignJWT, jwtVerify } from "jose";

export default class AuthService {

    constructor(secrets) {

        this.accessTokenSecret = new TextEncoder().encode(secrets.accessTokenSecret);
        this.refreshTokenSecret = new TextEncoder().encode(secrets.refreshTokenSecret);
    }

    async authenticate(userId) {

        const accessToken = await this._createAccessToken(userId);
        const refreshToken = await this._createRefreshToken(userId);

        return { accessToken, refreshToken };
    }

    async verifyAccessToken(accessToken) {

        return (await jwtVerify(accessToken, this.accessTokenSecret)).payload;
    }

    async verifyRefreshToken(refreshToken) {

        return (await jwtVerify(refreshToken, this.refreshTokenSecret)).payload;
    }

    async _createAccessToken(userId) {

        return new SignJWT({ userId })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("10 mins")
            .sign(this.accessTokenSecret);
    }

    async _createRefreshToken(userId) {

        return new SignJWT({ userId })
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("1 day")
            .sign(this.refreshTokenSecret);
    }
}