
import HttpClient from "@/utils/HttpClient";
import { endpoint } from "shared";

export default class UserApi {

    /**
     * Creates FirmwareApi
     * @param {HttpClient} httpClient 
     */
    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    /**
     * Gets logged user
     * @returns {object} User
     */
    async get() {

        return this._httpClient.get(endpoint.users.me());
    }
}