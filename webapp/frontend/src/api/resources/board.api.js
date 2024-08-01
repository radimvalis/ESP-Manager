
import { ENDPOINT } from "shared";

export default class BoardApi {

    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    async get(boardId) {
        
        return await this._httpClient.post(ENDPOINT.BOARD.GET, { boardId });
    }

    async register(configData) {

        return await this._httpClient.put(ENDPOINT.BOARD.REGISTER, configData);
    }
}