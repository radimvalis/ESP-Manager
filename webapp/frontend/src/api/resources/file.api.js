
import { endpoint } from "shared";

export default class FileApi {

    static _binFileRequestConfig = { responseType: "arraybuffer" };

    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    async getDefaultFirmware() {

        const response = await this._httpClient.get(endpoint.files.default.firmware(), FileApi._binFileRequestConfig);

        return FileApi._convertArrayBufferToString(response);
    }

    async getDefaultPartitionTable(boardId) {

        const response = await this._httpClient.get(endpoint.files.default.partitionTable(boardId), FileApi._binFileRequestConfig);

        return FileApi._convertArrayBufferToString(response);
    }

    async getDefaultBootloader(boardId) {

        const response = await this._httpClient.get(endpoint.files.default.bootloader(boardId), FileApi._binFileRequestConfig);

        return FileApi._convertArrayBufferToString(response);
    }

    async getDefaultConfigForm() {

        return await this._httpClient.get(endpoint.files.default.configForm());
    }

    async getDefaultNVS(boardId) {

        const response = await this._httpClient.get(endpoint.files.default.NVS(boardId), FileApi._binFileRequestConfig);

        return FileApi._convertArrayBufferToString(response);   
    }

    async getConfigForm(firmwareId) {

        return await this._httpClient.get(endpoint.files.configForm(firmwareId));
    }

    static _convertArrayBufferToString(arrayBuffer) {

        return new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "");
    }
}