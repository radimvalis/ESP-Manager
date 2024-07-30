
import { ENDPOINT } from "shared";

export default class FileApi {

    static _binFileRequestConfig = { responseType: "arraybuffer" };

    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    async getDefaultFirmware() {

        const response = await this._httpClient.get(ENDPOINT.FILE.DEFAULT.FIRMWARE, FileApi._binFileRequestConfig);

        return FileApi._convertArrayBufferToString(response);
    }

    async getDefaultPartitionTable() {

        const response = await this._httpClient.get(ENDPOINT.FILE.DEFAULT.PARTITION_TABLE, FileApi._binFileRequestConfig);

        return FileApi._convertArrayBufferToString(response);
    }

    async getDefaultBootloader() {

        const response = await this._httpClient.get(ENDPOINT.FILE.DEFAULT.BOOTLOADER, FileApi._binFileRequestConfig);

        return FileApi._convertArrayBufferToString(response);
    }

    async getDefaultConfigForm() {

        return await this._httpClient.get(ENDPOINT.FILE.DEFAULT.CONFIG_FORM);
    }

    async getDefaultNVS(boardId) {

        const response = await this._httpClient.post(ENDPOINT.FILE.DEFAULT.NVS, { boardId }, FileApi._binFileRequestConfig);

        return FileApi._convertArrayBufferToString(response);        
    }

    static _convertArrayBufferToString(arrayBuffer) {

        return new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "");
    }
}