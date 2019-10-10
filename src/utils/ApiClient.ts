import request from 'superagent';
import { Encryption } from './Encryption';
import { ApiCallback } from '../types/ApiCallback';

const packageJson = require('../../package.json');

/**
 * The callback interface for api calls
 *
 * @param [errors] - In case of an error an array with error objects otherwise undefined
 * @param [errors[].fieldName] - The field name (if error is caused by a particular field)
 * @param errors[].message - The error message
 * @param errors[].code - The error code
 * @param data - The rest response body
 * @param res - The raw superagent response object
 */

/**
 * The Hyperwallet API Client
 */
export class ApiClient {
  /**
   * The API username
   */
  public username: string;

  /**
   * The API password
   */
  public password: string;

  /**
   * The API server to connect to
   */
  public server: string;

  /**
   * The Node SDK Version number
   */
  public version: String;

  /**
   * The flag shows if encryption is enabled
   */
  public isEncrypted: boolean;

  /**
   * String that can be a URL or path to file with client JWK set
   */
  public clientPrivateKeySetPath: string;

  /**
   * String that can be a URL or path to file with hyperwallet JWK set
   */
  public hyperwalletKeySetPath: string;

  /**
   * The encryption helper class
   */
  public encryption: Encryption;

  /**
   * Create a instance of the API client
   *
   * @param username - The API username
   * @param password - The API password
   * @param server - The API server to connect to
   * @param encryptionData - The API encryption data
   */
  constructor(
    username: string,
    password: string,
    server: string,
    encryptionData?: {
      clientPrivateKeySetPath: string;
      hyperwalletKeySetPath: string;
    }
  ) {
    this.username = username;
    this.password = password;
    this.server = server;
    this.version = packageJson.version;
    this.isEncrypted = false;

    if (
      encryptionData &&
      encryptionData.clientPrivateKeySetPath &&
      encryptionData.hyperwalletKeySetPath
    ) {
      this.isEncrypted = true;
      this.clientPrivateKeySetPath = encryptionData.clientPrivateKeySetPath;
      this.hyperwalletKeySetPath = encryptionData.hyperwalletKeySetPath;
      this.encryption = new Encryption(
        this.clientPrivateKeySetPath,
        this.hyperwalletKeySetPath
      );
    }
  }

  /**
   * Do a POST call to the Hyperwallet API server
   *
   * @param partialUrl - The api endpoint to call (gets prefixed by `server` and `/rest/v3/`)
   * @param data - The data to send to the server
   * @param params - Query parameters to send in this call
   * @param callback - The callback for this call
   */
  public doPost(partialUrl, data: Record<string, any>, params, callback) {
    let contentType = 'application/json';
    let accept = 'application/json';
    let requestDataPromise = new Promise<Record<string, any> | string>(
      resolve => {
        resolve(data);
      }
    );
    if (this.isEncrypted) {
      contentType = 'application/jose+json';
      accept = 'application/jose+json';
      this.createJoseJsonParser();
      requestDataPromise = this.encryption.encrypt(data);
    }

    requestDataPromise
      .then(requestData => {
        request
          .post(`${this.server}/rest/v3/${partialUrl}`)
          .auth(this.username, this.password)
          .set('User-Agent', `Hyperwallet Node SDK v${this.version}`)
          .type(contentType)
          .accept(accept)
          .query(params)
          .send(requestData)
          .end(this.wrapCallback('POST', callback));
      })
      .catch(() =>
        callback(
          'Failed to encrypt body for POST request',
          undefined,
          undefined
        )
      );
  }

  /**
   * Do a PUT call to the Hyperwallet API server
   *
   * @param partialUrl - The api endpoint to call (gets prefixed by `server` and `/rest/v3/`)
   * @param data - The data to send to the server
   * @param params - Query parameters to send in this call
   * @param callback - The callback for this call
   */
  public doPut(partialUrl, data, params, callback) {
    let contentType = 'application/json';
    let accept = 'application/json';
    let requestDataPromise = new Promise<Record<string, any> | string>(
      resolve => {
        resolve(data);
      }
    );
    if (this.isEncrypted) {
      contentType = 'application/jose+json';
      accept = 'application/jose+json';
      this.createJoseJsonParser();
      requestDataPromise = this.encryption.encrypt(data);
    }
    requestDataPromise
      .then(requestData => {
        request
          .put(`${this.server}/rest/v3/${partialUrl}`)
          .auth(this.username, this.password)
          .set('User-Agent', `Hyperwallet Node SDK v${this.version}`)
          .type(contentType)
          .accept(accept)
          .query(params)
          .send(requestData)
          .end(this.wrapCallback('PUT', callback));
      })
      .catch(() =>
        callback('Failed to encrypt body for PUT request', undefined, undefined)
      );
  }

  /**
   * Do a GET call to the Hyperwallet API server
   *
   * @param partialUrl - The api endpoint to call (gets prefixed by `server` and `/rest/v3/`)
   * @param params - Query parameters to send in this call
   * @param callback - The callback for this call
   */
  public doGet(partialUrl, params, callback) {
    let contentType = 'application/json';
    let accept = 'application/json';
    if (this.isEncrypted) {
      contentType = 'application/jose+json';
      accept = 'application/jose+json';
      this.createJoseJsonParser();
    }
    request
      .get(`${this.server}/rest/v3/${partialUrl}`)
      .auth(this.username, this.password)
      .set('User-Agent', `Hyperwallet Node SDK v${this.version}`)
      .type(contentType)
      .accept(accept)
      .query(params)
      .end(this.wrapCallback('GET', callback));
  }

  /**
   * Wrap a callback to process possible API and network errors
   *
   * @param httpMethod - The http method that is currently processing
   * @param callback - The final callback
   * @returns - The super agent callback
   */
  public wrapCallback(
    httpMethod: string,
    callback: ApiCallback = (err: Object, res: Object) => null
  ) {
    return (err: any, res?: any) => {
      const expectedContentType = this.isEncrypted
        ? 'application/jose+json'
        : 'application/json';

      const invalidContentType =
        res &&
        res.header &&
        res.status !== 204 &&
        res.header['content-type'].indexOf(expectedContentType) === -1;

      if (invalidContentType) {
        callback(
          [
            {
              message: 'Invalid Content-Type specified in Response Header'
            }
          ],
          res ? res.body : undefined,
          res
        );

        return;
      }

      if (this.isEncrypted) {
        this.processEncryptedResponse(
          httpMethod,
          err,
          res && res.body != null ? res.body : undefined,
          callback
        );
      } else {
        this.processNonEncryptedResponse(err, res, callback);
      }
    };
  }

  /**
   * Process non encrypted response from server
   *
   * @param err - Error object
   * @param res - Response object
   * @param callback - The final callback
   */
  public processNonEncryptedResponse(err, res, callback: ApiCallback) {
    if (!err) {
      callback(undefined, res.body, res);

      return;
    }

    let errors = [
      {
        message: `Could not communicate with ${this.server}`,
        code: 'COMMUNICATION_ERROR'
      }
    ];
    if (res && res.body && res.body.errors) {
      errors = res.body.errors;
    }

    callback(errors, res ? res.body : undefined, res);
  }

  /**
   * Process encrypted response from server
   *
   * @param httpMethod - The http method that is currently processing
   * @param err - Error object
   * @param res - Response object
   * @param callback - The final callback
   */
  public processEncryptedResponse(
    httpMethod: string,
    err: object,
    res: object,
    callback: ApiCallback
  ) {
    if (!res) {
      callback([{ message: 'Tried to decrypt empty response body' }]);

      return;
    }

    this.encryption
      .decrypt(res)
      .then(decryptedData => {
        const responseBody = JSON.parse(decryptedData.payload.toString());
        if (responseBody.errors) {
          const responseWithErrors: Record<string, any> = {};
          responseWithErrors.body = responseBody;

          this.processNonEncryptedResponse(
            responseBody,
            responseWithErrors,
            callback
          );
        } else {
          callback(undefined, responseBody, decryptedData);
        }
      })
      .catch(() => {
        callback(
          [{ message: `Failed to decrypt response for ${httpMethod} request` }],
          res || undefined,
          res || undefined
        );

        return;
      });
  }

  /**
   * Creates response body parser for application/jose+json content-type
   */
  private createJoseJsonParser() {
    request.parse['application/jose+json'] = (res, callback) => {
      let data = '';
      res.on('data', chunk => {
        data += chunk;
      });
      res.on('end', () => {
        callback(null, data);
      });
    };
  }
}

export default ApiClient;
