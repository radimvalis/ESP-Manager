
import { ENDPOINT } from "shared";

export default class AuthApi {

    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    async logIn(username, password) {

        const data = {

            username,
            password
        };

        return this._httpClient.post(ENDPOINT.AUTH.LOG_IN, data);
    }

    async signUp(username, password) {

        const data = {

            username,
            password
        };

        return this._httpClient.post(ENDPOINT.AUTH.SIGN_UP, data);  
    }

    async logOut() {
        
        return this._httpClient.get(ENDPOINT.AUTH.LOG_OUT);
    }
}