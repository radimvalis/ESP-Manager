
import axios from "axios";

export default class HttpClient {

    constructor(baseUrl, refreshTokenEndpoint, maxRetriesCount = 1) {

        this.baseUrl = baseUrl;
        this.refreshTokenEndpoint = refreshTokenEndpoint;
        this.maxRetriesCount = maxRetriesCount;
    }

    async get(url, requestConfig = {}) {

        return this._request(url, "GET", {}, requestConfig);
    }

    async post(url, data, requestConfig = {}) {

        return this._request(url, "POST", data, requestConfig);
    }

    async put(url, data, requestConfig = {}) {

        return this._request(url, "PUT", data, requestConfig);
    }

    async _request(url, method, data, requestConfig) {

        return this._requestWithRetries(url, method, data, requestConfig, this.maxRetriesCount);
    }

    async _requestWithRetries(url, method, data, requestConfig, remainingRetriesCount) {

        const defaultRequestConfig = {

            baseURL: this.baseUrl,
            url,
            method,
            data
        };

        try {

            const response = await axios.request({ ...defaultRequestConfig, ...requestConfig });

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