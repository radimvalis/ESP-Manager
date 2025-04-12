
import { endpoint } from "shared";

export default class FirmwareApi {

    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    async create(name, target, firmwareFile, configFormFile) {

        const formData = new FormData();

        formData.append("name", name);
        formData.append("target", target);
        formData.append("files", firmwareFile);
        formData.append("files", configFormFile);

        return await this._httpClient.post(endpoint.firmwares.all(), formData, {

            headers: { "Content-Type": "multipart/form-data" }
        });
    }

    async getOne(firmwareId) {

        return await this._httpClient.get(endpoint.firmwares.one(firmwareId));
    }

    async getAll() {

        return await this._httpClient.get(endpoint.firmwares.all());
    }

    async update(firmwareId, updatedFirmwareFile) {

        const formData = new FormData();

        formData.append("firmwareId", firmwareId);
        formData.append("file", updatedFirmwareFile);

        return await this._httpClient.post(endpoint.firmwares.one(firmwareId), formData, {

            headers: { "Content-Type": "multipart/form-data" }
        });
    }

    async delete(firmwareId) {

        await this._httpClient.delete(endpoint.firmwares.one(firmwareId));
    }
}