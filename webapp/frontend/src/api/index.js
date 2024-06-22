
import HttpClient from "@/utils/HttpClient";

import AuthApi from "./resources/auth.api";

import { ENDPOINT } from "shared";

export default class ApiProvider {

    constructor() {

        const apiBaseUrl = location.origin + "/api";
        const httpClient = new HttpClient(apiBaseUrl, ENDPOINT.AUTH.REFRESH_TOKENS);

        this.auth = new AuthApi(httpClient);
    }
}