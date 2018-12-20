import request from "superagent";
import packageJson from "../../package.json";
import Encryption from "./Encryption";

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
     * @param {string} encryptionData - The API encryption data
     */
    constructor(username, password, server, encryptionData) {
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

        /**
         * The flag shows if encryption is enabled
         *
         * @type {boolean}
         * @protected
         */
        this.isEncrypted = false;

        if (encryptionData && encryptionData.clientPrivateKeySetPath && encryptionData.hyperwalletKeySetPath) {
            this.isEncrypted = true;
            this.clientPrivateKeySetPath = encryptionData.clientPrivateKeySetPath;
            this.hyperwalletKeySetPath = encryptionData.hyperwalletKeySetPath;
            this.encryption = new Encryption(this.clientPrivateKeySetPath, this.hyperwalletKeySetPath);
        }
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
        let contentType = "json";
        let processResponse = this.wrapCallback(callback);
        let requestDataPromise = new Promise((resolve) => resolve(data));
        if (this.isEncrypted) {
            contentType = "application/jose+json";
            processResponse = this.processEncryptedResponse("POST", callback);
            requestDataPromise = this.encryption.encrypt(data);
        }
        requestDataPromise.then((requestData) => {
            request
                .post(`${this.server}/rest/v3/${partialUrl}`)
                .auth(this.username, this.password)
                .set("User-Agent", `Hyperwallet Node SDK v${this.version}`)
                .type(contentType)
                .accept("json")
                .query(params)
                .send(requestData)
                .end(processResponse);
        }).catch(() => callback("Failed to encrypt body for POST request", undefined, undefined));
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
        let contentType = "json";
        let processResponse = this.wrapCallback(callback);
        let requestDataPromise = new Promise((resolve) => resolve(data));
        if (this.isEncrypted) {
            contentType = "application/jose+json";
            processResponse = this.processEncryptedResponse("PUT", callback);
            requestDataPromise = this.encryption.encrypt(data);
        }
        requestDataPromise.then((requestData) => {
            request
                .put(`${this.server}/rest/v3/${partialUrl}`)
                .auth(this.username, this.password)
                .set("User-Agent", `Hyperwallet Node SDK v${this.version}`)
                .type(contentType)
                .accept("json")
                .query(params)
                .send(requestData)
                .end(processResponse);
        }).catch(() => callback("Failed to encrypt body for PUT request", undefined, undefined));
    }

    /**
     * Do a GET call to the Hyperwallet API server
     *
     * @param {string} partialUrl - The api endpoint to call (gets prefixed by `server` and `/rest/v3/`)
     * @param {Object} params - Query parameters to send in this call
     * @param {api-callback} callback - The callback for this call
     */
    doGet(partialUrl, params, callback) {
        let contentType = "json";
        if (this.isEncrypted) {
            contentType = "application/jose+json";
        }
        request
            .get(`${this.server}/rest/v3/${partialUrl}`)
            .auth(this.username, this.password)
            .set("User-Agent", `Hyperwallet Node SDK v${this.version}`)
            .type(contentType)
            .accept("json")
            .query(params)
            .end(this.isEncrypted ? this.processEncryptedResponse("GET", callback) : this.wrapCallback(callback));
    }

    /**
     * Wrap a callback to process possible API and network errors
     *
     * @param {api-callback} callback - The final callback
     * @returns {function(err: Object, res: Object)} - The super agent callback
     *
     * @private
     */
    wrapCallback(callback = () => null) {
        return (err, res) => {
            this.processResponse(err, res, callback);
        };
    }

    /**
     * Process response from server
     *
     * @param {Object} err - Error object
     * @param {Object} res - Response object
     * @param {api-callback} callback - The final callback
     *
     * @private
     */
    processResponse(err, res, callback) {
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
        callback(errors, res ? res.body : undefined, res);
    }

    /**
     * Makes decryption for encrypted response bodies
     *
     * @param {string} httpMethod - The http method that is currently processing
     * @param {api-callback} callback - The callback method to be invoked after decryption
     *
     * @private
     */
    processEncryptedResponse(httpMethod, callback) {
        return (error, response) => {
            if (!error) {
                const responseBody = response.rawResponse ? response.rawResponse : response.text;
                this.encryption.decrypt(responseBody)
                    .then((decryptedData) => {
                        callback(undefined, JSON.parse(decryptedData.payload.toString()), decryptedData);
                    })
                    .catch(() => callback(`Failed to decrypt response for ${httpMethod} request`, responseBody, responseBody));
            } else {
                this.processResponse(error, response, callback);
            }
        };
    }
}
