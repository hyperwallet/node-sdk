import request from "superagent";
import packageJson from "../../package.json";
import Encryption from "./Encryption";
import { v4 as uuidv4 } from "uuid";
import HyperwalletVerificationDocument from "../models/HyperwalletVerificationDocument";
import HyperwalletVerificationDocumentReason from "../models/HyperwalletVerificationDocumentReason";

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
        this.contextId = uuidv4();
        if (encryptionData && encryptionData.clientPrivateKeySetPath && encryptionData.hyperwalletKeySetPath) {
            this.isEncrypted = true;
            this.clientPrivateKeySetPath = encryptionData.clientPrivateKeySetPath;
            this.hyperwalletKeySetPath = encryptionData.hyperwalletKeySetPath;
            this.encryption = new Encryption(this.clientPrivateKeySetPath, this.hyperwalletKeySetPath);
        }
    }

    /**
     * Format response to documents model before passing to callback
     *
     * @param {Object} res - Response object
     *
     */
    formatResForCallback(res) {
        const retRes = res;

        if (res && res.body) {
            const retBody = res.body;
            const documents = retBody.documents;
            if (documents && documents.length > 0) {
                const documentsArr = [];
                documents.forEach(dVal => {
                    const doc = dVal;
                    if (dVal.reasons && dVal.reasons.length > 0) {
                        const reasonsArr = [];
                        dVal.reasons.forEach(rVal => {
                            reasonsArr.push(new HyperwalletVerificationDocumentReason(rVal));
                        });
                        doc.reasons = reasonsArr;
                    }
                    documentsArr.push(new HyperwalletVerificationDocument(doc));
                });
                retBody.documents = documentsArr;
                retRes.body = retBody;
            }
        }
        return retRes;
    }

    /**
     * Do a POST call to the Hyperwallet API server
     *
     * @param {string} partialUrl - The api endpoint to call (gets prefixed by `server` and `/rest/v4/`)
     * @param {Object} data - The data to send to the server
     * @param {Object} params - Query parameters to send in this call
     * @param {api-callback} callback - The callback for this call
     */
    doPost(partialUrl, data, params, callback) {
        let contentType = "application/json";
        let accept = "application/json";
        let requestDataPromise = new Promise((resolve) => resolve(data));
        if (this.isEncrypted) {
            contentType = "application/jose+json";
            accept = "application/jose+json";
            this.createJoseJsonParser();
            requestDataPromise = this.encryption.encrypt(data);
        }
        requestDataPromise.then((requestData) => {
            request
                .post(`${this.server}/rest/v4/${partialUrl}`)
                .auth(this.username, this.password)
                .set("User-Agent", `Hyperwallet Node SDK v${this.version}`)
                .set("x-sdk-version", this.version)
                .set("x-sdk-type", "NodeJS")
                .set("x-sdk-contextId", this.contextId)
                .type(contentType)
                .accept(accept)
                .query(params)
                .send(requestData)
                .end(this.wrapCallback("POST", callback));
        }).catch(() => callback([{ message: "Failed to encrypt body for POST request" }], undefined, undefined));
    }

    /**
     * Do a PUT call to the Hyperwallet API server to upload documents
     *
     * @param {string} partialUrl - The api endpoint to call (gets prefixed by `server` and `/rest/v4/`)
     * @param {Object} data - The data to send to the server
     * @param {api-callback} callback - The callback for this call
     */
    doPutMultipart(partialUrl, data, callback) {
        let contentType = "multipart/form-data";
        let accept = "application/json";
        /* eslint-disable no-unused-vars */
        const keys = Object.keys(data);
        /* eslint-enable no-unused-vars */

        let requestDataPromise = new Promise((resolve) => resolve(data));
        if (this.isEncrypted) {
            contentType = "multipart/form-data";
            accept = "application/jose+json";
            this.createJoseJsonParser();
            requestDataPromise = this.encryption.encrypt(data);
        }
        requestDataPromise.then(() => {
            const req = request
                .put(`${this.server}/rest/v4/${partialUrl}`)
                .auth(this.username, this.password)
                .set("User-Agent", `Hyperwallet Node SDK v${this.version}`)
                .set("x-sdk-version", this.version)
                .set("x-sdk-type", "NodeJS")
                .set("x-sdk-contextId", this.contextId)
                .type(contentType)
                .accept(accept);
            keys.forEach(key => {
                if (key === "data") {
                    req.field(key, JSON.stringify(data[key]));
                } else {
                    req.attach(key, data[key]);
                }
            });
            req.end(this.wrapCallback("PUT", callback));
        }).catch((err) => callback(err, undefined, undefined));
    }

    /**
     * Do a PUT call to the Hyperwallet API server
     *
     * @param {string} partialUrl - The api endpoint to call (gets prefixed by server and /rest/v4/)
     * @param {Object} data - The data to send to the server
     * @param {Object} params - Query parameters to send in this call
     * @param {api-callback} callback - The callback for this call
     */
    doPut(partialUrl, data, params, callback) {
        let contentType = "application/json";
        let accept = "application/json";
        let requestDataPromise = new Promise((resolve) => resolve(data));
        if (this.isEncrypted) {
            contentType = "application/jose+json";
            accept = "application/jose+json";
            this.createJoseJsonParser();
            requestDataPromise = this.encryption.encrypt(data);
        }
        requestDataPromise.then((requestData) => {
            request
                .put(`${this.server}/rest/v4/${partialUrl}`)
                .auth(this.username, this.password)
                .set("User-Agent", `Hyperwallet Node SDK v${this.version}`)
                .set("x-sdk-version", this.version)
                .set("x-sdk-type", "NodeJS")
                .set("x-sdk-contextId", this.contextId)
                .type(contentType)
                .accept(accept)
                .query(params)
                .send(requestData)
                .end(this.wrapCallback("PUT", callback));
        }).catch(() => callback([{ message: "Failed to encrypt body for PUT request" }], undefined, undefined));
    }

    /**
     * Do a GET call to the Hyperwallet API server
     *
     * @param {string} partialUrl - The api endpoint to call (gets prefixed by `server` and `/rest/v4/`)
     * @param {Object} params - Query parameters to send in this call
     * @param {api-callback} callback - The callback for this call
     */
    doGet(partialUrl, params, callback) {
        let contentType = "application/json";
        let accept = "application/json";
        if (this.isEncrypted) {
            contentType = "application/jose+json";
            accept = "application/jose+json";
            this.createJoseJsonParser();
        }
        request
            .get(`${this.server}/rest/v4/${partialUrl}`)
            .auth(this.username, this.password)
            .set("User-Agent", `Hyperwallet Node SDK v${this.version}`)
            .set("x-sdk-version", this.version)
            .set("x-sdk-type", "NodeJS")
            .set("x-sdk-contextId", this.contextId)
            .type(contentType)
            .accept(accept)
            .query(params)
            .end(this.wrapCallback("GET", callback));
    }

    /**
     * Wrap a callback to process possible API and network errors
     *
     * @param {string} httpMethod - The http method that is currently processing
     * @param {api-callback} callback - The final callback
     * @returns {function(err: Object, res: Object)} - The super agent callback
     *
     * @private
     */
    wrapCallback(httpMethod, callback = () => null) {
        return (err, res) => {
            const contentTypeHeader = res && res.header ? res.header["content-type"] : undefined;
            if (!err) {
                const expectedContentType = (this.isEncrypted) ? "application/jose+json" : "application/json";
                if (res && res.status !== 204 && contentTypeHeader && !contentTypeHeader.includes(expectedContentType)) {
                    callback([{
                        message: "Invalid Content-Type specified in Response Header",
                    }], res ? res.body : undefined, res);
                    return;
                }
            }
            if (this.isEncrypted && contentTypeHeader && contentTypeHeader.includes("application/jose+json")
              && res.body && this.isNotEmptyResponseBody(res.body)) {
                this.processEncryptedResponse(httpMethod, err, res.body, callback);
            } else {
                this.processNonEncryptedResponse(err, res, callback);
            }
        };
    }

    /**
     * Process non encrypted response from server
     *
     * @param {Object} err - Error object
     * @param {Object} res - Response object
     * @param {api-callback} callback - The final callback
     *
     * @private
     */
    processNonEncryptedResponse(err, res, callback) {
        if (!err) {
            const formattedRes = this.formatResForCallback(res);
            callback(undefined, formattedRes.body, formattedRes);
            return;
        }

        let errors = [
            {
                message: err.status ? err.message : `Could not communicate with ${this.server}`,
                code: err.status ? err.status.toString() : "COMMUNICATION_ERROR",
            },
        ];
        if (res && res.body && res.body.errors) {
            errors = res.body.errors;
        }
        callback(errors, res ? res.body : undefined, res);
    }

    /**
     * Process encrypted response from server
     *
     * @param {string} httpMethod - The http method that is currently processing
     * @param {Object} err - Error object
     * @param {Object} res - Response object
     * @param {api-callback} callback - The final callback
     *
     * @private
     */
    processEncryptedResponse(httpMethod, err, res, callback) {
        this.encryption.decrypt(res)
            .then((decryptedData) => {
                const responseBody = JSON.parse(decryptedData.payload.toString());
                if (responseBody.errors) {
                    const responseWithErrors = {};
                    responseWithErrors.body = responseBody;
                    this.processNonEncryptedResponse(responseBody, responseWithErrors, callback);
                } else {
                    const formattedRes = this.formatResForCallback({ body: responseBody });
                    callback(undefined, formattedRes.body, decryptedData);
                }
            })
            .catch(() => callback([{ message: `Failed to decrypt response for ${httpMethod} request` }], res, res));
    }

    /**
     * Creates response body parser for application/jose+json content-type
     *
     * @private
     */
    createJoseJsonParser() {
        request.parse["application/jose+json"] = (res, callback) => {
            let data = "";
            res.on("data", (chunk) => {
                data += chunk;
            });
            res.on("end", () => {
                callback(null, data);
            });
        };
    }

    /**
     * Helper function to check if the response body is an empty object
     *
     * @private
     */
    isEmptyResponseBody(body) {
        return Object.keys(body).length === 0 && Object.getPrototypeOf(body) === Object.prototype;
    }

    /**
     * Helper function to check if the response body is not an empty object
     *
     * @private
     */
    isNotEmptyResponseBody(body) {
        return !this.isEmptyResponseBody(body);
    }
}
