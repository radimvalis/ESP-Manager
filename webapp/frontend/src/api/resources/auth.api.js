
import HttpClient from "@/utils/HttpClient";
import { endpoint } from "shared";

export default class AuthApi {

    /**
     * Creates AuthApi
     * @param {HttpClient} httpClient 
     */
    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    /**
     * Logs user in; sets auth cookies
     * @param {string} username 
     * @param {string} password 
     * @returns Empty response
     */
    async logIn(username, password) {

        const data = {

            username,
            password
        };

        return this._httpClient.post(endpoint.auth.logIn(), data);
    }

    /**
     * Logs user up; sets auth cookies
     * @param {string} username 
     * @param {string} password 
     * @returns Empty response
     */
    async signUp(username, password) {

        const data = {

            username,
            password
        };

        return this._httpClient.post(endpoint.auth.signUp(), data);
    }

    /**
     * Logs user out; removes auth cookies
     * @returns Empty response
     */
    async logOut() {

        return this._httpClient.post(endpoint.auth.logOut());
    }
}