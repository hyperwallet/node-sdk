import jose from "node-jose";
import fs from "fs";
import request from "superagent";
import https from "https";

/**
 * The Hyperwallet Encryption processor
 */
export default class Encryption {

    /**
     * Create a instance of the Encryption service
     *
     * @param {string} clientPrivateKeySetLocation - String that can be a URL or path to file with client JWK set
     * @param {string} hyperwalletKeySetLocation - String that can be a URL or path to file with hyperwallet JWK set
     * @param {string} encryptionAlgorithm - JWE encryption algorithm, by default value = RSA-OAEP-256
     * @param {string} signAlgorithm - JWS signature algorithm, by default value = RS256
     * @param {string} encryptionMethod - JWE encryption method, by default value = A256CBC-HS512
     * @param {string} jwsExpirationMinutes - Minutes when JWS signature is valid
     */
    constructor(clientPrivateKeySetLocation, hyperwalletKeySetLocation, encryptionAlgorithm = "RSA-OAEP-256",
        signAlgorithm = "RS256", encryptionMethod = "A256CBC-HS512", jwsExpirationMinutes = 5) {
        /**
         * String that can be a URL or path to file with client JWK set
         *
         * @type {string}
         * @protected
         */
        this.clientPrivateKeySetLocation = clientPrivateKeySetLocation;

        /**
         * String that can be a URL or path to file with hyperwallet JWK set
         *
         * @type {string}
         * @protected
         */
        this.hyperwalletKeySetLocation = hyperwalletKeySetLocation;

        /**
         * Client KeyStore object
         *
         * @type {string}
         * @protected
         */
        this.clientKeyStore = null;

        /**
         * Hyperwallet KeyStore object
         *
         * @type {string}
         * @protected
         */
        this.hwKeyStore = null;

        /**
         * JWE encryption algorithm, by default value = RSA-OAEP-256
         *
         * @type {string}
         * @protected
         */
        this.encryptionAlgorithm = encryptionAlgorithm;

        /**
         * JWS signature algorithm, by default value = RS256
         *
         * @type {string}
         * @protected
         */
        this.signAlgorithm = signAlgorithm;

        /**
         * JWE encryption method, by default value = A256CBC-HS512
         *
         * @type {string}
         * @protected
         */
        this.encryptionMethod = encryptionMethod;

        /**
         * Minutes when JWS signature is valid, by default value = 5
         *
         * @type {number}
         * @protected
         */
        this.jwsExpirationMinutes = jwsExpirationMinutes;
    }

    /**
     * Makes an encrypted request : 1) signs the request body; 2) encrypts payload after signature
     *
     * @param {string} body - The request body to be encrypted
     */
    encrypt(body) {
        return new Promise((resolve, reject) => {
            const keyStorePromise = (this.clientKeyStore && this.hwKeyStore) ? Promise.resolve(this.keyStore) : this.createKeyStore();
            keyStorePromise
                .then(() => this.signBody(body))
                .then((signedBody) => this.encryptBody(signedBody))
                .then((result) => resolve(result))
                .catch((error) => reject(error));
        });
    }

    /**
     * Decrypts encrypted response : 1) decrypts the request body; 2) verifies the payload signature
     *
     * @param {string} body - The response body to be decrypted
     */
    decrypt(body) {
        return new Promise((resolve, reject) => {
            const keyStorePromise = this.keyStore ? Promise.resolve(this.keyStore) : this.createKeyStore();
            keyStorePromise
                .then(() => this.decryptBody(body))
                .then((decryptedBody) => this.checkSignature(decryptedBody.plaintext))
                .then((result) => resolve(result))
                .catch((error) => reject(error));
        });
    }

    /**
     * Verify if response body has a valid signature
     *
     * @param {string} body - The response body to be verified
     */
    checkSignature(body) {
        return new Promise((resolve, reject) => {
            const key = this.hwKeyStore.all({ alg: this.signAlgorithm })[0];
            if (!key) {
                reject(new Error(`JWK set doesn't contain key with algorithm = ${this.signAlgorithm}`));
            }
            const options = {
                handlers: {
                    exp: (jws) => {
                        if (this.getCurrentTime() > jws.header.exp) {
                            reject(new Error("JWS signature has expired"));
                        }
                    },
                },
            };
            jose.JWS.createVerify(key, options)
                .verify(body.toString())
                .then((result) => resolve(result))
                .catch(() => reject(new Error(`Failed to verify signature with key id = ${key.kid}`)));
        });
    }

    /**
     * Decrypts the response body
     *
     * @param {string} body - The response body to be decrypted
     */
    decryptBody(body) {
        return new Promise((resolve, reject) => {
            const key = this.clientKeyStore.all({ alg: this.encryptionAlgorithm })[0];
            if (!key) {
                reject(new Error(`JWK set doesn't contain key with algorithm = ${this.encryptionAlgorithm}`));
            }
            jose.JWE.createDecrypt(key)
                .decrypt(body)
                .then((result) => resolve(result))
                .catch(() => reject(new Error(`Failed to decrypt payload with key id = ${key.kid}`)));
        });
    }

    /**
     * Encrypts the request body
     *
     * @param {string} body - The request body to be encrypted
     */
    encryptBody(body) {
        return new Promise((resolve, reject) => {
            const key = this.hwKeyStore.all({ alg: this.encryptionAlgorithm })[0];
            if (!key) {
                reject(new Error(`JWK set doesn't contain key with algorithm = ${this.encryptionAlgorithm}`));
            }
            const encryptionHeader = {
                format: "compact",
                alg: key.alg,
                enc: this.encryptionMethod,
                kid: key.kid,
            };
            jose.JWE.createEncrypt(encryptionHeader, key)
                .update(body)
                .final()
                .then((result) => resolve(result))
                .catch(() => reject(new Error(`Failed to encrypt payload with key id = ${key.kid}`)));
        });
    }

    /**
     * Makes signature for request body
     *
     * @param {string} body - The request body to be signed
     */
    signBody(body) {
        return new Promise((resolve, reject) => {
            const key = this.clientKeyStore.all({ alg: this.signAlgorithm })[0];
            if (!key) {
                reject(new Error(`JWK set doesn't contain key with algorithm = ${this.signAlgorithm}`));
            }
            const signHeader = {
                format: "compact",
                alg: key.alg,
                fields: {
                    crit: ["exp"],
                    exp: this.getSignatureExpirationTime(),
                    kid: key.kid,
                },
            };
            jose.JWS.createSign(signHeader, key)
                .update(JSON.stringify(body), "utf8")
                .final()
                .then((result) => resolve(result))
                .catch(() => reject(new Error(`Failed to sign with key id = ${key.kid}`)));
        });
    }

    /**
     * Calculates signature expiration time in seconds ( by default expiration time = 5 minutes )
     */
    getSignatureExpirationTime() {
        const millisecondsInMinute = 60000;
        const millisecondsInSecond = 1000;
        const currentTime = new Date(new Date().getTime() + this.jwsExpirationMinutes * millisecondsInMinute).getTime();
        return Math.round(currentTime / millisecondsInSecond);
    }

    /**
     * Get current time in seconds
     */
    getCurrentTime() {
        const millisecondsInSecond = 1000;
        return Math.round(new Date().getTime() / millisecondsInSecond);
    }

    /**
     * Creates 2 JWK key stores : 1) for client keys 2) for hyperwallet keys
     */
    createKeyStore() {
        return new Promise((resolve, reject) => {
            this.readKeySet(this.hyperwalletKeySetLocation)
                .then((jwkSet) => this.createKeyStoreFromJwkSet(this.hyperwalletKeySetLocation, jwkSet))
                .then(() => this.readKeySet(this.clientPrivateKeySetLocation))
                .then((jwkSet) => this.createKeyStoreFromJwkSet(this.clientPrivateKeySetLocation, jwkSet))
                .then((result) => resolve(result))
                .catch((error) => reject(error));
        });
    }

    /**
     * Converts JWK set in JSON format to JOSE key store format
     *
     * @param {string} jwkSetPath - The location of JWK set (can be URL string or path to file)
     * @param {string} jwkSet - The JSON representation of JWK set, to be converted to keystore
     */
    createKeyStoreFromJwkSet(jwkSetPath, jwkSet) {
        return new Promise((resolve, reject) => {
            jose.JWK.asKeyStore(jwkSet).
            then((result) => {
                if (jwkSetPath === this.clientPrivateKeySetLocation) {
                    this.clientKeyStore = result;
                } else {
                    this.hwKeyStore = result;
                }
                resolve(result);
            })
            .catch(() => reject(new Error("Failed to create keyStore from given jwkSet")));
        });
    }

    /**
     * Reads JWK set in JSON format either from given URL or path to local file
     *
     * @param {string} keySetPath - The location of JWK set (can be URL string or path to file)
     */
    readKeySet(keySetPath) {
        return new Promise((resolve, reject) => {
            if (fs.existsSync(keySetPath)) {
                fs.readFile(keySetPath, { encoding: "utf-8" }, (err, keySetData) => {
                    if (!err) {
                        resolve(keySetData);
                    } else {
                        reject(new Error(err));
                    }
                });
            } else {
                this.checkUrlIsValid(keySetPath, (isValid) => {
                    if (isValid) {
                        const req = https.get(keySetPath, (res) => {
                            let keySetData = "";
                            res.on("data", (chunk) => {
                                keySetData += chunk;
                            });
                            res.on("end", () => resolve(keySetData));
                        });
                        req.end();
                    } else {
                        reject(new Error(`Wrong JWK set location path = ${keySetPath}`));
                    }
                });
            }
        });
    }

    /**
     * Checks if an input string is a valid URL
     *
     * @param {string} url - The URL string to be verified
     * @param {string} callback - The callback method to process the verification result of input url
     */
    checkUrlIsValid(url, callback) {
        request(url, (error, response) => {
            callback(!error && response.statusCode === 200);
        });
    }
}
