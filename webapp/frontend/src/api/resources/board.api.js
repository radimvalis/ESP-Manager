
import { ENDPOINT } from "shared";

export default class BoardApi {

    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    async register(configData) {

        return await this._httpClient.put(ENDPOINT.BOARD.REGISTER, configData);
    }
}