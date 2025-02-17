
import { endpoint } from "shared";

export default class UserApi {

    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    async get() {

        return this._httpClient.get(endpoint.users.me());
    }
}