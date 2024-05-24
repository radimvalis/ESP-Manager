
import axios from "axios";

export default class HttpClient {

    baseUrl;

    constructor(baseUrl) {

        this.baseUrl = baseUrl;
    }

    async get(url) {

        return this.request(url, "GET", {});
    }

    async post(url, data) {

        return this.request(url, "POST", data);
    }

    async request(url, method, data) {

        const headers = {};

        const requestConfig = {

            baseURL: this.baseUrl,
            url,
            method,
            headers,
            data            
        };

        const response = await axios.request(requestConfig);

        return response.data;
    }
}