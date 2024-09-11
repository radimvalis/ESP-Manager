
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

    async flash(boardId, firmwareId, configData) {

        return await this._httpClient.post(ENDPOINT.BOARD.FLASH, { boardId, firmwareId, configData });
    }

    async update(boardId) {

        return await this._httpClient.post(ENDPOINT.BOARD.UPDATE, { boardId });
    }

    async bootDefault(boardId) {

        return await this._httpClient.post(ENDPOINT.BOARD.BOOT_DEFAULT, { boardId });
    }

    async delete(boardId) {

        await this._httpClient.delete(ENDPOINT.BOARD.DELETE, { boardId });
    }
}