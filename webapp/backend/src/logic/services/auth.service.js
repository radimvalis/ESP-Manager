
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

    async verifyToken(token, tokenName) {

        const secret = tokenName === this.accessTokenSecret ? this.accessTokenSecret : this.refreshTokenSecret;

        const { payload } = await jwtVerify(token, secret);

        return payload;
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