import request from "superagent";
import packageJson from "../package.json";

/**
 * The callback interface for api calls
 *
 * @typedef {function} api-callback
 * @param {Object[]} [errors] - In case of an error an array with error objects otherwise undefined
 * @param {string} [errors[].fieldName] - The field name (if error is caused by a particular field)
 * @param {string} errors[].message - The error message
 * @param {string} errors[].code - The error code
 * @param {Object} data - The rest response body
 * @param {Object} res - The raw superagent response object
 */

/**
 * The Hyperwallet API Client
 */
export default class ApiClient {

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
         * @protected
         */
        this.username = username;

        /**
         * The API password
         *
         * @type {string}
         * @protected
         */
        this.password = password;

        /**
         * The API server to connect to
         * @type {string}
         * @protected
         */
        this.server = server;

        /**
         * The Node SDK Version number
         *
         * @type {string}
         * @protected
         */
        this.version = packageJson.version;
    }

    /**
     * Do a POST call to the Hyperwallet API server
     *
     * @param {string} partialUrl - The api endpoint to call (gets prefixed by `server` and `/rest/v3/`)
     * @param {Object} data - The data to send to the server
     * @param {Object} params - Query parameters to send in this call
     * @param {api-callback} callback - The callback for this call
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
     * @param {api-callback} callback - The callback for this call
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
     * @param {api-callback} callback - The callback for this call
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

    /**
     * Wrap a callback to process possible API and network errors
     *
     * @param {api-callback} callback - The final callback
     * @returns {function(err: Object, res: Object)} - The super agent callback
     *
     * @private
     */
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
                },
            ];
            if (res && res.body && res.body.errors) {
                errors = res.body.errors;
            }
            callback(errors, res.body, res);
        };
    }

}
