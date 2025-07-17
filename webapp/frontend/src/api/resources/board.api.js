
import HttpClient from "@/utils/HttpClient";
import { endpoint, boardUpdateType } from "shared";

export default class BoardApi {

    /**
     * Creates BoardApi
     * @param {HttpClient} httpClient 
     */
    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    /**
     * Gets list of supported targets
     * @returns {Array<string>} List of supported targets
     */
    async getSupportedChips() {

        return await this._httpClient.get(endpoint.boards.supportedChips());
    }

    /**
     * Creates new board
     * @param {object} configData ESP Manager configuration values (SSID and password)
     * @returns {object} New board
     */
    async create(configData) {

        return await this._httpClient.post(endpoint.boards.all(), configData);
    }

    /**
     * Watches all boards of the user for changes using SSE
     * @param {(message: string) => void} onMessage 
     */
    openWatchAllStream(onMessage) {

        this._httpClient.openWatchStream(endpoint.boards.watchAll(), onMessage);
    }

    /**
     * Watches board for changes using SSE
     * @param {string} boardId 
     * @param {(message: string) => void} onMessage 
     */
    openWatchOneStream(boardId, onMessage) {

        this._httpClient.openWatchStream(endpoint.boards.watchOne(boardId), onMessage);
    }

    /**
     * Closes SSE connection
     */
    closeWatchStream() {

        this._httpClient.closeWatchStream();
    }

    /**
     * Gets all boards of the user
     * @returns {Array<object>} All boards of the user
     */
    async getAll() {

        return await this._httpClient.get(endpoint.boards.all());
    }

    /**
     * Gets board
     * @param {string} boardId 
     * @returns {object} Board with given ID
     */
    async getOne(boardId) {

        return await this._httpClient.get(endpoint.boards.one(boardId));
    }

    /**
     * Flashes firmware into board over the air
     * @param {string} boardId 
     * @param {string} firmwareId  ID of the firmware to flash
     * @param {object} configData  Configuration values for the firmware
     * @returns {object} Updated board
     */
    async flash(boardId, firmwareId, configData) {

        const formData = new FormData();

        formData.append("type", boardUpdateType.flashBoard);
        formData.append("firmwareId", firmwareId);

        for (let [key, value] of Object.entries(configData)) {

            if (typeof value !== "undefined") {

                formData.append(key, value);
            }
        }

        return await this._httpClient.put(endpoint.boards.one(boardId), formData, {

            headers: { "Content-Type": "multipart/form-data" }
        });
    }

    /**
     * Updates firmware in the board over the air
     * @param {string} boardId 
     * @returns {object} Updated board
     */
    async updateFirmware(boardId) {

        return await this._httpClient.put(endpoint.boards.one(boardId), { type: boardUpdateType.updateFirmware });
    }

    /**
     * Flashes default firmware into board over the air 
     * @param {string} boardId 
     * @returns {object} Updated board
     */
    async bootDefaultFirmware(boardId) {

        return await this._httpClient.put(endpoint.boards.one(boardId), { type: boardUpdateType.bootDefaultFirmware });
    }

    /**
     * Deletes board
     * @param {string} boardId 
     */
    async delete(boardId) {

        await this._httpClient.delete(endpoint.boards.one(boardId));
    }
}