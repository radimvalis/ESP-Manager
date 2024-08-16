
import { ENDPOINT } from "shared";

export default class BoardApi {

    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    async get(boardId) {
        
        return await this._httpClient.post(ENDPOINT.BOARD.GET, { boardId });
    }

    async getSummaryList() {

        return await this._httpClient.get(ENDPOINT.BOARD.SUMMARY_LIST);
    }

    async register(configData) {

        return await this._httpClient.put(ENDPOINT.BOARD.REGISTER, configData);
    }

    async delete(boardId) {

        await this._httpClient.delete(ENDPOINT.BOARD.DELETE, { boardId });
    }
}