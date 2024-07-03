
import { ENDPOINT } from "shared";

export default class UserApi {

    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    async get() {

        return this._httpClient.get(ENDPOINT.USER.GET); 
    }
}