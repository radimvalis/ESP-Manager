
import axios from "axios";

export default class HttpClient {

    /**
     * Creates HttpClient
     * @param {string} baseUrl - Backend URL
     * @param {string} refreshTokenEndpoint - Endpoint that refreshes tokens
     * @param {string} maxRetriesCount - Number of refresh tokens attempts
     */
    constructor(baseUrl, refreshTokenEndpoint, maxRetriesCount = 1) {

        this.baseUrl = baseUrl;
        this.refreshTokenEndpoint = refreshTokenEndpoint;
        this.maxRetriesCount = maxRetriesCount;
        this.eventSource = null;
    }

    /**
     * GET request
     * @param {string} url 
     * @param {object} requestConfig 
     * @returns {*} Response body
     */
    async get(url, requestConfig = {}) {

        return this._request(url, "GET", {}, requestConfig);
    }

    /**
     * POST request
     * @param {string} url 
     * @param {*} data 
     * @param {object} requestConfig 
     * @returns {*} Response body
     */
    async post(url, data, requestConfig = {}) {

        return this._request(url, "POST", data, requestConfig);
    }

    /**
     * PUT request
     * @param {string} url 
     * @param {*} data 
     * @param {object} requestConfig 
     * @returns {*} Response body
     */
    async put(url, data, requestConfig = {}) {

        return this._request(url, "PUT", data, requestConfig);
    }

    /**
     * DELETE request
     * @param {string} url 
     * @param {*} data 
     * @param {object} requestConfig 
     * @returns {*}
     */
    async delete(url, data, requestConfig = {}) {

        return this._request(url, "DELETE", data, requestConfig);
    }

    /**
     * Establishes SSE connection
     * @param {string} url 
     * @param {*} onMessage - onMessage CB 
     */
    openWatchStream(url, onMessage) {

        this.eventSource = new EventSource(this.baseUrl + url);

        this.eventSource.onmessage = (event) => {

            onMessage(JSON.parse(event.data));
        };
    }

    /**
     * Closes SSE connection
     */
    closeWatchStream() {

        this.eventSource.close();
    }

    /**
     * Performs HTTP request
     * @param {string} url 
     * @param {string} method 
     * @param {*} data 
     * @param {object} requestConfig 
     * @returns {*} Response body
     */
    async _request(url, method, data, requestConfig) {

        return this._requestWithRetries(url, method, data, requestConfig, this.maxRetriesCount);
    }

    /**
     * Performs HTTP request with retries
     * @param {string} url 
     * @param {string} method 
     * @param {*} data 
     * @param {object} requestConfig 
     * @param {number} remainingRetriesCount 
     * @returns Response body
     */
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

    /**
     * Refreshes access and refres tokens
     */
    async _refreshTokens() {

        const requestConfig = {

            baseURL: this.baseUrl,
            url: this.refreshTokenEndpoint,
            method: "POST"    
        };

        await axios.request(requestConfig);
    }
}