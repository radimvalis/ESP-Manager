
import { ENDPOINT } from "shared";

export default class FirmwareApi {

    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    async get(firmwareId) {

        return await this._httpClient.post(ENDPOINT.FIRMWARE.GET, { firmwareId });
    }

    async getSummaryList() {

        return await this._httpClient.get(ENDPOINT.FIRMWARE.SUMMARY_LIST);
    }

    async create(name, firmwareFile, configFormFile) {

        const formData = new FormData();

        formData.append("name", name);
        formData.append("files", firmwareFile);
        formData.append("files", configFormFile);

        return await this._httpClient.put(ENDPOINT.FIRMWARE.CREATE, formData, {

            headers: { "Content-Type": "multipart/form-data" }
        });
    }

    async update(firmwareId, updatedFirmwareFile) {

        const formData = new FormData();

        formData.append("firmwareId", firmwareId);
        formData.append("file", updatedFirmwareFile);

        return await this._httpClient.post(ENDPOINT.FIRMWARE.UPDATE, formData, {

            headers: { "Content-Type": "multipart/form-data" }
        });
    }

    async delete(firmwareId) {

        await this._httpClient.delete(ENDPOINT.FIRMWARE.DELETE, { firmwareId });
    }
}