
import HttpClient from "@/utils/HttpClient";
import { endpoint } from "shared";

export default class FileApi {

    static _binFileRequestConfig = { responseType: "arraybuffer" };

    /**
     * Creates FileApi
     * @param {HttpClient} httpClient 
     */
    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    /**
     * Downloads default firmware image
     * @param {string} boardId 
     * @returns {string} Default firmware image converted to string
     */
    async getDefaultFirmware(boardId) {

        const response = await this._httpClient.get(endpoint.files.default.firmware(boardId), FileApi._binFileRequestConfig);

        return FileApi._convertArrayBufferToString(response);
    }

    /**
     * Downloads partition table image
     * @param {string} boardId 
     * @returns {string} Partition table image converted to string
     */
    async getDefaultPartitionTable(boardId) {

        const response = await this._httpClient.get(endpoint.files.default.partitionTable(boardId), FileApi._binFileRequestConfig);

        return FileApi._convertArrayBufferToString(response);
    }

    /**
     * Downloads bootloader image
     * @param {string} boardId 
     * @returns {string} Bootloader image converted to string
     */
    async getDefaultBootloader(boardId) {

        const response = await this._httpClient.get(endpoint.files.default.bootloader(boardId), FileApi._binFileRequestConfig);

        return FileApi._convertArrayBufferToString(response);
    }

    /**
     * Downloads configurtion file for ESP Manager
     * @returns {object} Configuration file for ESP Manager
     */
    async getDefaultConfigForm() {

        return await this._httpClient.get(endpoint.files.default.configForm());
    }

    /**
     * Downloads NVS image
     * @param {string} boardId 
     * @returns NVS image with ESP Manager configuration converted to string
     */
    async getDefaultNVS(boardId) {

        const response = await this._httpClient.get(endpoint.files.default.NVS(boardId), FileApi._binFileRequestConfig);

        return FileApi._convertArrayBufferToString(response);   
    }

    /**
     * Downloads configuration file
     * @param {string} firmwareId 
     * @returns {object} Configuration file for given firmware
     */
    async getConfigForm(firmwareId) {

        return await this._httpClient.get(endpoint.files.configForm(firmwareId));
    }

    /**
     * Converts ArrayBuffer to string
     * @param {ArrayBuffer} arrayBuffer 
     * @returns {string} Array buffer converted to string
     */
    static _convertArrayBufferToString(arrayBuffer) {

        return new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "");
    }
}