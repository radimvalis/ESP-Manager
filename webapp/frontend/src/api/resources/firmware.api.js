
import HttpClient from "@/utils/HttpClient";
import { endpoint } from "shared";

export default class FirmwareApi {

    /**
     * Creates FirmwareApi
     * @param {HttpClient} httpClient 
     */
    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    /**
     * Creates new firmware
     * @param {string} name Name of the firmware 
     * @param {string} target Target architecture of the firmware
     * @param {File} firmwareFile Firmware image
     * @param {File} configFormFile Configuration file of the firmware
     * @returns {object} New firmware
     */
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

    /**
     * Gets firmware
     * @param {string} firmwareId 
     * @returns {object} Firmware with given ID
     */
    async getOne(firmwareId) {

        return await this._httpClient.get(endpoint.firmwares.one(firmwareId));
    }

    /**
     * Gets all firmwares of the user
     * @returns {Array<object>} All firmwares of the user
     */
    async getAll() {

        return await this._httpClient.get(endpoint.firmwares.all());
    }

    /**
     * Uploads new version of the firmware
     * @param {string} firmwareId 
     * @param {File} updatedFirmwareFile New version of firmware binary
     * @returns {object} Updated firmware
     */
    async update(firmwareId, updatedFirmwareFile) {

        const formData = new FormData();

        formData.append("file", updatedFirmwareFile);

        return await this._httpClient.post(endpoint.firmwares.one(firmwareId), formData, {

            headers: { "Content-Type": "multipart/form-data" }
        });
    }

    /**
     * Deletes firmware
     * @param {string} firmwareId
     */
    async delete(firmwareId) {

        await this._httpClient.delete(endpoint.firmwares.one(firmwareId));
    }
}