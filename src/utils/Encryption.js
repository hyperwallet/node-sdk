"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_jose_1 = __importDefault(require("node-jose"));
const fs_1 = __importDefault(require("fs"));
const superagent_1 = __importDefault(require("superagent"));
/**
 * The Hyperwallet Encryption processor
 */
class Encryption {
    /**
     * Create a instance of the Encryption service
     *
     * @param clientPrivateKeySetLocation - String that can be a URL or path to file with client JWK set
     * @param hyperwalletKeySetLocation - String that can be a URL or path to file with hyperwallet JWK set
     * @param encryptionAlgorithm - JWE encryption algorithm, by default value = RSA-OAEP-256
     * @param signAlgorithm - JWS signature algorithm, by default value = RS256
     * @param encryptionMethod - JWE encryption method, by default value = A256CBC-HS512
     * @param jwsExpirationMinutes - Minutes when JWS signature is valid
     */
    constructor(clientPrivateKeySetLocation, hyperwalletKeySetLocation, encryptionAlgorithm = 'RSA-OAEP-256', signAlgorithm = 'RS256', encryptionMethod = 'A256CBC-HS512', jwsExpirationMinutes = 5) {
        this.clientPrivateKeySetLocation = clientPrivateKeySetLocation;
        this.hyperwalletKeySetLocation = hyperwalletKeySetLocation;
        // this.clientKeyStore = null;
        // this.hwKeyStore = null;
        this.encryptionAlgorithm = encryptionAlgorithm;
        this.signAlgorithm = signAlgorithm;
        this.encryptionMethod = encryptionMethod;
        this.jwsExpirationMinutes = jwsExpirationMinutes;
    }
    /**
     * Makes an encrypted request : 1) signs the request body; 2) encrypts payload after signature
     *
     * @param body - The request body to be encrypted
     */
    encrypt(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyStorePromise = this.clientKeyStore && this.hwKeyStore
                ? Promise.resolve(this.hwKeyStore)
                : this.createKeyStore();
            yield keyStorePromise;
            const signedBody = yield this.signBody(body);
            return this.encryptBody(signedBody);
        });
    }
    /**
     * Decrypts encrypted response : 1) decrypts the request body; 2) verifies the payload signature
     *
     * @param body - The response body to be decrypted
     */
    decrypt(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const keyStorePromise = this.hwKeyStore
                ? Promise.resolve(this.hwKeyStore)
                : this.createKeyStore();
            yield keyStorePromise;
            const decryptedBody = yield this.decryptBody(body);
            return this.checkSignature(decryptedBody.plaintext.toString());
        });
    }
    /**
     * Verify if response body has a valid signature
     *
     * @param body - The response body to be verified
     */
    checkSignature(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const rawKey = this.hwKeyStore.all({ alg: this.signAlgorithm })[0];
                if (!rawKey) {
                    reject(new Error(`JWK set doesn't contain key with algorithm = ${this.signAlgorithm}`));
                    return;
                }
                const options = {
                    handlers: {
                        exp: jws => {
                            if (this.getCurrentTime() > jws.header.exp) {
                                reject(new Error('JWS signature has expired'));
                            }
                        }
                    }
                };
                node_jose_1.default.JWK.asKey(rawKey)
                    .then(key => node_jose_1.default.JWS.createVerify(key, options)
                    .verify(body.toString())
                    .then(resolve)
                    .catch(() => {
                    reject(new Error(`Failed to verify signature with key id = ${key.kid}`));
                }))
                    .catch(reject);
            }));
        });
    }
    /**
     * Decrypts the response body
     *
     * @param body - The response body to be decrypted
     */
    decryptBody(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const rawKey = this.clientKeyStore.all({
                    alg: this.encryptionAlgorithm
                })[0];
                if (!rawKey) {
                    reject(new Error(`JWK set doesn't contain key with algorithm = ${this.encryptionAlgorithm}`));
                    return;
                }
                node_jose_1.default.JWK.asKey(rawKey)
                    .then(key => {
                    node_jose_1.default.JWE.createDecrypt(key)
                        .decrypt(body)
                        .then(resolve)
                        .catch(() => {
                        reject(new Error(`Failed to decrypt payload with key id = ${key.kid}`));
                    });
                })
                    .catch(reject);
            }));
        });
    }
    /**
     * Encrypts the request body
     *
     * @param body - The request body to be encrypted
     */
    encryptBody(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const rawKey = this.hwKeyStore.all({ alg: this.encryptionAlgorithm })[0];
                if (!rawKey) {
                    reject(new Error(`JWK set doesn't contain key with algorithm = ${this.encryptionAlgorithm}`));
                    return;
                }
                return node_jose_1.default.JWK.asKey(rawKey)
                    .then((key) => __awaiter(this, void 0, void 0, function* () {
                    const encryptionHeader = {
                        format: 'compact',
                        alg: key.alg,
                        enc: this.encryptionMethod,
                        kid: key.kid
                    };
                    try {
                        const value = yield node_jose_1.default.JWE.createEncrypt(encryptionHeader, key)
                            .update(body)
                            .final();
                        resolve(value);
                        return;
                    }
                    catch (e) {
                        reject(new Error(`Failed to encrypt payload with key id = ${key.kid}`));
                        return;
                    }
                }))
                    .catch(reject);
            }));
        });
    }
    /**
     * Makes signature for request body
     *
     * @param body - The request body to be signed
     */
    signBody(body) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const rawKey = this.clientKeyStore.all({ alg: this.signAlgorithm })[0];
                if (!rawKey) {
                    reject(new Error(`JWK set doesn't contain key with algorithm = ${this.signAlgorithm}`));
                    return;
                }
                const key = yield node_jose_1.default.JWK.asKey(rawKey);
                const signHeader = {
                    format: 'compact',
                    alg: key.alg,
                    fields: {
                        crit: ['exp'],
                        exp: this.getSignatureExpirationTime(),
                        kid: key.kid
                    }
                };
                node_jose_1.default.JWS.createSign(signHeader, key)
                    .update(JSON.stringify(body), 'utf8')
                    .final()
                    .then(resolve)
                    .catch(() => {
                    reject(new Error(`Failed to sign with key id = ${key.kid}`));
                });
            }));
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
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.readKeySet(this.hyperwalletKeySetLocation)
                    .then((jwkSet) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const result = yield node_jose_1.default.JWK.asKeyStore(jwkSet);
                        this.hwKeyStore = result;
                    }
                    catch (e) {
                        reject(new Error('Failed to create keyStore from given jwkSet'));
                        return;
                    }
                }))
                    .then(() => this.readKeySet(this.clientPrivateKeySetLocation))
                    .then((jwkSet) => __awaiter(this, void 0, void 0, function* () {
                    return node_jose_1.default.JWK.asKeyStore(jwkSet)
                        .then(result => {
                        this.clientKeyStore = result;
                    })
                        .catch(() => {
                        reject(new Error('Failed to create keyStore from given jwkSet'));
                    });
                }))
                    .then(resolve)
                    .catch(reject);
            });
        });
    }
    /**
     * Converts JWK set in JSON format to JOSE key store format
     *
     * @param jwkSetPath - The location of JWK set (can be URL string or path to file)
     * @param jwkSet - The JSON representation of JWK set, to be converted to keystore
     */
    createKeyStoreFromJwkSet(jwkSetPath, jwkSet) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                node_jose_1.default.JWK.asKeyStore(jwkSet)
                    .then(result => {
                    if (jwkSetPath === this.clientPrivateKeySetLocation) {
                        this.clientKeyStore = result;
                    }
                    else {
                        this.hwKeyStore = result;
                    }
                    resolve(result);
                })
                    .catch(() => {
                    reject(new Error('Failed to create keyStore from given jwkSet'));
                });
            });
        });
    }
    /**
     * Reads JWK set in JSON format either from given URL or path to local file
     *
     * @param keySetPath - The location of JWK set (can be URL string or path to file)
     */
    readKeySet(keySetPath) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                // tslint:disable-next-line: non-literal-fs-path
                if (fs_1.default.existsSync(keySetPath)) {
                    // tslint:disable-next-line: non-literal-fs-path
                    fs_1.default.readFile(keySetPath, { encoding: 'utf-8' }, (err, keySetData) => {
                        if (!err) {
                            resolve(keySetData);
                        }
                        else {
                            reject(new Error(err.message));
                        }
                    });
                }
                else {
                    superagent_1.default(keySetPath)
                        .then(response => {
                        const responseBody = response.body && Object.keys(response.body).length !== 0
                            ? response.body
                            : response.text;
                        resolve(responseBody);
                    })
                        .catch(err => {
                        reject(new Error(`Wrong JWK set location path = ${keySetPath}`));
                    });
                }
            });
        });
    }
    /**
     * Checks if an input string is a valid URL
     *
     * @param url - The URL string to be verified
     * @param callback - The callback method to process the verification result of input url
     */
    checkUrlIsValid(url) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield superagent_1.default(url);
                return response.status === 200;
            }
            catch (e) {
                return false;
            }
        });
    }
    /**
     * Convert encrypted string to array of Buffer
     *
     * @param encryptedBody - Encrypted body to be decoded
     */
    base64Decode(encryptedBody) {
        const parts = encryptedBody.split('.');
        const decodedParts = [];
        parts.forEach(elem => {
            decodedParts.push(node_jose_1.default.util.base64url.decode(elem));
        });
        const decodedBody = {};
        decodedBody.parts = decodedParts;
        return decodedBody;
    }
    /**
     * Convert array of Buffer to encrypted string
     *
     * @param decodedBody - Array of Buffer to be decoded to encrypted string
     */
    base64Encode(decodedBody) {
        const encodedParts = [];
        decodedBody.parts.forEach(part => {
            encodedParts.push(node_jose_1.default.util.base64url.encode(Buffer.from(JSON.parse(JSON.stringify(part)).data)));
        });
        return encodedParts.join('.');
    }
}
exports.Encryption = Encryption;
exports.default = Encryption;
//# sourceMappingURL=Encryption.js.map