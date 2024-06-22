
import axios from "axios";

export default class HttpClient {

    constructor(baseUrl, refreshTokenEndpoint, maxRetriesCount = 1) {

        this.baseUrl = baseUrl;
        this.refreshTokenEndpoint = refreshTokenEndpoint;
        this.maxRetriesCount = maxRetriesCount;
    }

    async get(url) {

        return this._request(url, "GET", {});
    }

    async post(url, data) {

        return this._request(url, "POST", data);
    }

    async _request(url, method, data) {

        return this._requestWithRetries(url, method, data, this.maxRetriesCount);
    }

    async _requestWithRetries(url, method, data, remainingRetriesCount) {

        const requestConfig = {

            baseURL: this.baseUrl,
            url,
            method,
            data            
        };

        try {

            const response = await axios.request(requestConfig);

            return response.data;
        }

        catch(error) {

            if (error.response && error.response.status === 401 && remainingRetriesCount > 0) {

                await this._refreshTokens();

                return this._requestWithRetries(url, method, data, remainingRetriesCount - 1);
            }

            throw error;
        }
    }

    async _refreshTokens() {

        const requestConfig = {

            baseURL: this.baseUrl,
            url: this.refreshTokenEndpoint,
            method: "GET"    
        };

        await axios.request(requestConfig);
    }
}