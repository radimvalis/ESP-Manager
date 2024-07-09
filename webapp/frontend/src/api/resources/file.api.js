
import { ENDPOINT } from "shared";

export default class FileApi {

    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    async getDefaultFirmware() {

        return this._getBinaryFile(ENDPOINT.FILE.DEFAULT.FIRMWARE); 
    }

    async getDefaultPartitionTable() {

        return this._getBinaryFile(ENDPOINT.FILE.DEFAULT.PARTITION_TABLE);
    }

    async getDefaultBootloader() {

        return this._getBinaryFile(ENDPOINT.FILE.DEFAULT.BOOTLOADER);
    }

    async _getBinaryFile(endpoint) {

        const requestConfig = {

            responseType: "arraybuffer",
        };

        const arrayBuffer = await this._httpClient.get(endpoint, requestConfig);

        return new Uint8Array(arrayBuffer).reduce((data, byte) => data + String.fromCharCode(byte), "");
   }
}