
import { URL } from "shared";

export default class UserApi {

    httpClient;

    constructor(httpClient) {

        this.httpClient = httpClient;
    }

    async create(username, password) {

        const data = {

            username,
            password
        };

        return this.httpClient.post(URL.USER.CREATE, data);
    }

    async logIn(username, password) {

        const data = {

            username,
            password
        };

        return this.httpClient.post(URL.USER.LOG_IN, data);
    }
}