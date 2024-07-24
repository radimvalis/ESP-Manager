
import { ENDPOINT } from "shared";

export default class BoardApi {

    constructor(httpClient) {

        this._httpClient = httpClient;
    }

    async create(name) {

        return await this._httpClient.put(ENDPOINT.BOARD.CREATE, { name });
    }
}