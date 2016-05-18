import request from "superagent";
import packageJson from "../package.json";

/**
 * The Hyperwallet API Client
 */
class ApiClient {

    /**
     * Create a instance of the API client
     *
     * @param {string} username - The API username
     * @param {string} password - The API password
     * @param {string} server - The API server to connect to
     */
    constructor(username, password, server) {
        /**
         * The API username
         *
         * @type {string}
         */
        this.username = username;

        /**
         * The API password
         *
         * @type {string}
         */
        this.password = password;

        /**
         * The API server to connect to
         * @type {string}
         */
        this.server = server;

        /**
         * The Node SDK Version number
         *
         * @type {string}
         */
        this.version = packageJson.version;
    }

    /**
     * Do a POST call to the Hyperwallet API server
     *
     * @param {string} partialUrl - The api endpoint to call (gets prefixed by `server` and `/rest/v3/`)
     * @param {Object} data - The data to send to the server
     * @param {Object} params - Query parameters to send in this call
     * @param {function} callback - The callback for this call
     */
    doPost(partialUrl, data, params, callback) {
        request
            .post(`${this.server}/rest/v3/${partialUrl}`)
            .auth(this.username, this.password)
            .set("User-Agent", `Hyperwallet Node SDK v${this.version}`)
            .type("json")
            .accept("json")
            .query(params)
            .send(data)
            .end(ApiClient.wrapCallback(callback));
    }

    /**
     * Do a PUT call to the Hyperwallet API server
     *
     * @param {string} partialUrl - The api endpoint to call (gets prefixed by `server` and `/rest/v3/`)
     * @param {Object} data - The data to send to the server
     * @param {Object} params - Query parameters to send in this call
     * @param {function} callback - The callback for this call
     */
    doPut(partialUrl, data, params, callback) {
        request
            .put(`${this.server}/rest/v3/${partialUrl}`)
            .auth(this.username, this.password)
            .set("User-Agent", `Hyperwallet Node SDK v${this.version}`)
            .type("json")
            .accept("json")
            .query(params)
            .send(data)
            .end(ApiClient.wrapCallback(callback));
    }

    /**
     * Do a GET call to the Hyperwallet API server
     *
     * @param {string} partialUrl - The api endpoint to call (gets prefixed by `server` and `/rest/v3/`)
     * @param {Object} params - Query parameters to send in this call
     * @param {function} callback - The callback for this call
     */
    doGet(partialUrl, params, callback) {
        request
            .get(`${this.server}/rest/v3/${partialUrl}`)
            .auth(this.username, this.password)
            .set("User-Agent", `Hyperwallet Node SDK v${this.version}`)
            .accept("json")
            .query(params)
            .end(ApiClient.wrapCallback(callback));
    }

    static wrapCallback(callback = () => null) {
        return (err, res) => {
            if (!err) {
                callback(undefined, res.body, res);
                return;
            }

            let errors = [
                {
                    message: `Could not communicate with ${this.server}`,
                    code: "COMMUNICATION_ERROR",
                    responseCode: res.statusCode,
                },
            ];
            if (res && res.body && res.body.errors) {
                errors = res.body.errors;
            }
            callback(errors, res.body, res);
        };
    }

}

export default ApiClient;
