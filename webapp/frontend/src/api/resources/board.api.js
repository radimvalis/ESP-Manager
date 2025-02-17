
import { endpoint, boardUpdateType } from "shared";

export default class BoardApi {

    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    async create(configData) {

        return await this._httpClient.post(endpoint.boards.all(), configData);
    }

    openWatchAllStream(onMessage) {

        this._httpClient.openWatchStream(endpoint.boards.watchAll(), onMessage);
    }

    openWatchOneStream(boardId, onMessage) {

        this._httpClient.openWatchStream(endpoint.boards.watchOne(boardId), onMessage);
    }

    closeWatchStream() {

        this._httpClient.closeWatchStream();
    }

    async getAll() {

        return await this._httpClient.get(endpoint.boards.all());
    }

    async getOne(boardId) {

        return await this._httpClient.get(endpoint.boards.one(boardId));
    }

    async flash(boardId, firmwareId, configData) {

        const formData = new FormData();

        formData.append("type", boardUpdateType.flashBoard);
        formData.append("firmwareId", firmwareId);

        for (let [key, value] of Object.entries(configData)) {

            formData.append(key, value);
        }

        return await this._httpClient.put(endpoint.boards.one(boardId), formData, {

            headers: { "Content-Type": "multipart/form-data" }
        });
    }

    async updateFirmware(boardId) {

        return await this._httpClient.put(endpoint.boards.one(boardId), { type: boardUpdateType.updateFirmware });
    }

    async bootDefaultFirmware(boardId) {

        return await this._httpClient.put(endpoint.boards.one(boardId), { type: boardUpdateType.bootDefaultFirmware });
    }

    async delete(boardId) {

        await this._httpClient.delete(endpoint.boards.one(boardId));
    }
}