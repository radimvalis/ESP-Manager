
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

    openWatchStream(boardId, onMessage) {

        this._httpClient.openWatchStream("/board/watch/" + boardId, onMessage);
    }

    openWatchAllStream(onMessage) {
        
        this._httpClient.openWatchStream(ENDPOINT.BOARD.WATCH_ALL, onMessage);
    }

    closeWatchStream() {

        this._httpClient.closeWatchStream();
    }

    async flash(boardId, firmwareId, configData) {

        const formData = new FormData();

        formData.append("boardId", boardId);
        formData.append("firmwareId", firmwareId);

        for (let [key, value] of Object.entries(configData)) {

            formData.append(key, value);
        }

        return await this._httpClient.post(ENDPOINT.BOARD.FLASH, formData, {

            headers: { "Content-Type": "multipart/form-data" }
        });
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