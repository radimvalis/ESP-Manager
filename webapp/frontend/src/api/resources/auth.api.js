
import { endpoint } from "shared";

export default class AuthApi {

    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    async logIn(username, password) {

        const data = {

            username,
            password
        };

        return this._httpClient.post(endpoint.auth.logIn(), data);
    }

    async signUp(username, password) {

        const data = {

            username,
            password
        };

        return this._httpClient.post(endpoint.auth.signUp(), data);
    }

    async logOut() {

        return this._httpClient.post(endpoint.auth.logOut());
    }
}