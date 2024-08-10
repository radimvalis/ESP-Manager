
import HttpClient from "@/utils/HttpClient";

import AuthApi from "./resources/auth.api";
import UserApi from "./resources/user.api";
import FileApi from "./resources/file.api";
import BoardApi from "./resources/board.api";
import FirmwareApi from "./resources/firmware.api";

import { ENDPOINT } from "shared";

export default class ApiProvider {

    constructor() {

        const apiBaseUrl = location.origin + "/api";
        const httpClient = new HttpClient(apiBaseUrl, ENDPOINT.AUTH.REFRESH_TOKENS);

        this.auth = new AuthApi(httpClient);
        this.user = new UserApi(httpClient);
        this.file = new FileApi(httpClient);
        this.board = new BoardApi(httpClient);
        this.firmware = new FirmwareApi(httpClient);
    }
}