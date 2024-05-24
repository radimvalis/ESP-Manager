
import HttpClient from "@/utils/HttpClient";

import UserApi from "./resources/user.api";

export default class ApiProvider {

    user;

    constructor() {

        const apiBaseUrl = location.origin + "/api";
        const httpClient = new HttpClient(apiBaseUrl);

        this.user = new UserApi(httpClient);
    }
}