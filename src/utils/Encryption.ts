import jose from "node-jose";
import fs from "fs";
import request from "superagent";

/**
 * The Hyperwallet Encryption processor
 */
export class Encryption {
  /**
   * String that can be a URL or path to file with client JWK set
   */
  public clientPrivateKeySetLocation: string;

  /**
   * String that can be a URL or path to file with hyperwallet JWK set
   */
  public hyperwalletKeySetLocation: string;

  /**
   * Client KeyStore object
   */
  public clientKeyStore: jose.JWK.KeyStore;

  /**
   * Hyperwallet KeyStore object
   */
  public hwKeyStore: jose.JWK.KeyStore;

  /**
   * JWE encryption algorithm, by default value = RSA-OAEP-256
   */
  public encryptionAlgorithm: string;

  /**
   * JWS signature algorithm, by default value = RS256
   */
  public signAlgorithm: string;

  /**
   * JWE encryption method, by default value = A256CBC-HS512
   */
  public encryptionMethod: string;

  /**
   * Minutes when JWS signature is valid, by default value = 5
   */
  public jwsExpirationMinutes: number;

  /**
   * Create a instance of the Encryption service
   *
   * @param {string} clientPrivateKeySetLocation - String that can be a URL or path to file with client JWK set
   * @param {string} hyperwalletKeySetLocation - String that can be a URL or path to file with hyperwallet JWK set
   * @param {string} encryptionAlgorithm - JWE encryption algorithm, by default value = RSA-OAEP-256
   * @param {string} signAlgorithm - JWS signature algorithm, by default value = RS256
   * @param {string} encryptionMethod - JWE encryption method, by default value = A256CBC-HS512
   * @param {number} jwsExpirationMinutes - Minutes when JWS signature is valid
   */
  constructor(
    clientPrivateKeySetLocation,
    hyperwalletKeySetLocation,
    encryptionAlgorithm = "RSA-OAEP-256",
    signAlgorithm = "RS256",
    encryptionMethod = "A256CBC-HS512",
    jwsExpirationMinutes = 5
  ) {
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
   * @param {string} body - The request body to be encrypted
   */
  encrypt(body: Record<string, any>): Promise<string> {
    const keyStorePromise =
      this.clientKeyStore && this.hwKeyStore
        ? Promise.resolve(this.hwKeyStore)
        : this.createKeyStore();

    return keyStorePromise
      .then(() => this.signBody(body))
      .then(signedBody => this.encryptBody(signedBody));
  }

  /**
   * Decrypts encrypted response : 1) decrypts the request body; 2) verifies the payload signature
   *
   * @param {string} body - The response body to be decrypted
   */
  decrypt(body): Promise<jose.JWS.VerificationResult> {
    const keyStorePromise = this.hwKeyStore
      ? Promise.resolve(this.hwKeyStore)
      : this.createKeyStore();

    return keyStorePromise
      .then(() => this.decryptBody(body))
      .then(decryptedBody =>
        this.checkSignature(decryptedBody.plaintext.toString())
      );
  }

  /**
   * Verify if response body has a valid signature
   *
   * @param {string} body - The response body to be verified
   */
  public async checkSignature(
    body: string
  ): Promise<jose.JWS.VerificationResult> {
    return new Promise(async (resolve, reject) => {
      const rawKey = this.hwKeyStore.all({ alg: this.signAlgorithm })[0];

      if (!rawKey) {
        reject(
          new Error(
            `JWK set doesn't contain key with algorithm = ${this.signAlgorithm}`
          )
        );
      }

      const options = {
        handlers: {
          exp: jws => {
            if (this.getCurrentTime() > jws.header.exp) {
              reject(new Error("JWS signature has expired"));
            }
          }
        }
      };

      const key = await jose.JWK.asKey(rawKey);

      jose.JWS.createVerify(key, options)
        .verify(body.toString())
        .then(result => resolve(result))
        .catch(() =>
          reject(
            new Error(`Failed to verify signature with key id = ${key.kid}`)
          )
        );
    });
  }

  /**
   * Decrypts the response body
   *
   * @param {string} body - The response body to be decrypted
   */
  public async decryptBody(body: string): Promise<jose.JWE.DecryptResult> {
    return new Promise(async (resolve, reject) => {
      const rawKey = this.clientKeyStore.all({
        alg: this.encryptionAlgorithm
      })[0];

      if (!rawKey) {
        reject(
          new Error(
            `JWK set doesn't contain key with algorithm = ${this.encryptionAlgorithm}`
          )
        );
      }

      const key = await jose.JWK.asKey(rawKey);

      jose.JWE.createDecrypt(key)
        .decrypt(body)
        .then(result => resolve(result))
        .catch(() =>
          reject(
            new Error(`Failed to decrypt payload with key id = ${key.kid}`)
          )
        );
    });
  }

  /**
   * Encrypts the request body
   *
   * @param {string} body - The request body to be encrypted
   */
  public async encryptBody(body: jose.JWS.CreateSignResult): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const rawKey = this.hwKeyStore.all({ alg: this.encryptionAlgorithm })[0];
      if (!rawKey) {
        reject(
          new Error(
            `JWK set doesn't contain key with algorithm = ${this.encryptionAlgorithm}`
          )
        );
      }

      const key = await jose.JWK.asKey(rawKey);

      const encryptionHeader = {
        format: "compact" as "compact" | "flattened",
        alg: key.alg,
        enc: this.encryptionMethod,
        kid: key.kid
      };

      jose.JWE.createEncrypt(encryptionHeader, key)
        .update(body)
        .final()
        .then(result => resolve(result))
        .catch(() =>
          reject(
            new Error(`Failed to encrypt payload with key id = ${key.kid}`)
          )
        );
    });
  }

  /**
   * Makes signature for request body
   *
   * @param {string} body - The request body to be signed
   */
  signBody(body: Record<string, any>): Promise<jose.JWS.CreateSignResult> {
    return new Promise(async (resolve, reject) => {
      const rawKey = this.clientKeyStore.all({ alg: this.signAlgorithm })[0];

      if (!rawKey) {
        reject(
          new Error(
            `JWK set doesn't contain key with algorithm = ${this.signAlgorithm}`
          )
        );
      }

      const key = await jose.JWK.asKey(rawKey);

      const signHeader = {
        format: "compact" as "compact" | "flattened",
        alg: key.alg,
        fields: {
          crit: ["exp"],
          exp: this.getSignatureExpirationTime(),
          kid: key.kid
        }
      };

      jose.JWS.createSign(signHeader, key)
        .update(JSON.stringify(body), "utf8")
        .final()
        .then(result => resolve(result))
        .catch(() =>
          reject(new Error(`Failed to sign with key id = ${key.kid}`))
        );
    });
  }

  /**
   * Calculates signature expiration time in seconds ( by default expiration time = 5 minutes )
   */
  getSignatureExpirationTime() {
    const millisecondsInMinute = 60000;
    const millisecondsInSecond = 1000;
    const currentTime = new Date(
      new Date().getTime() + this.jwsExpirationMinutes * millisecondsInMinute
    ).getTime();
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
        .then(jwkSet => {
          return jose.JWK.asKeyStore(jwkSet as any)
            .then(result => {
              this.hwKeyStore = result;
            })
            .catch(() =>
              reject(new Error("Failed to create keyStore from given jwkSet"))
            );
        })
        .then(() => this.readKeySet(this.clientPrivateKeySetLocation))
        .then(async jwkSet => {
          return jose.JWK.asKeyStore(jwkSet as any)
            .then(result => {
              this.clientKeyStore = result;
            })
            .catch(() =>
              reject(new Error("Failed to create keyStore from given jwkSet"))
            );
        })
        .then(result => resolve(result))
        .catch(error => reject(error));
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
      jose.JWK.asKeyStore(jwkSet)
        .then(result => {
          if (jwkSetPath === this.clientPrivateKeySetLocation) {
            this.clientKeyStore = result;
          } else {
            this.hwKeyStore = result;
          }
          resolve(result);
        })
        .catch(() =>
          reject(new Error("Failed to create keyStore from given jwkSet"))
        );
    });
  }

  /**
   * Reads JWK set in JSON format either from given URL or path to local file
   *
   * @param {string} keySetPath - The location of JWK set (can be URL string or path to file)
   */
  readKeySet(keySetPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (fs.existsSync(keySetPath)) {
        fs.readFile(keySetPath, { encoding: "utf-8" }, (err, keySetData) => {
          if (!err) {
            resolve(keySetData);
          } else {
            reject(new Error(err.message));
          }
        });
      } else {
        request(keySetPath)
          .then(response => {
            const responseBody =
              response.body && Object.keys(response.body).length !== 0
                ? response.body
                : response.text;
            resolve(responseBody);
          })
          .catch(err =>
            reject(
              new Error(
                `Wrong JWK set location path = ${keySetPath}. Error: ${err}`
              )
            )
          );
      }
    });
  }

  /**
   * Checks if an input string is a valid URL
   *
   * @param {string} url - The URL string to be verified
   * @param {string} callback - The callback method to process the verification result of input url
   */
  checkUrlIsValid(url) {
    return request(url)
      .then(response => response.status === 200)
      .catch(() => false);
  }

  /**
   * Convert encrypted string to array of Buffer
   *
   * @param {string} encryptedBody - Encrypted body to be decoded
   */
  base64Decode(encryptedBody) {
    const parts = encryptedBody.split(".");
    const decodedParts: string[] = [];
    parts.forEach(elem => {
      decodedParts.push(jose.util.base64url.decode(elem));
    });
    const decodedBody: Record<string, any> = {};
    decodedBody.parts = decodedParts;
    return decodedBody;
  }

  /**
   * Convert array of Buffer to encrypted string
   *
   * @param {string} decodedBody - Array of Buffer to be decoded to encrypted string
   */
  base64Encode(decodedBody) {
    const encodedParts: string[] = [];
    decodedBody.parts.forEach(part => {
      encodedParts.push(
        jose.util.base64url.encode(
          Buffer.from(JSON.parse(JSON.stringify(part)).data)
        )
      );
    });
    return encodedParts.join(".");
  }
}

export default Encryption;
