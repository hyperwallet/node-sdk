// tslint:disable: informative-docs
import { Agent } from 'https';
import objectAssign from 'object-assign';
import ApiClient from './utils/ApiClient';
export interface IHyperwalletOptions {
  /**
   * The API username
   */
  username: string;

  /**
   * The API password
   */
  password: string;

  /**
   * The program token that is used for some API calls
   */
  programToken?: string;

  /**
   * The JSON object of encryption data
   */
  encryptionData?: {
    clientPrivateKeySetPath: string;
    hyperwalletKeySetPath: string;
  };

  /**
   * The API server to connect to
   */
  server?: string;

  /**
   * A custom HTTPS agent
   */
  httpsAgent?: Agent;
}

/**
 * The Hyperwallet SDK Client
 */
export class Hyperwallet {
  /**
   * The instance of the ApiClient
   */
  public client: ApiClient;

  /**
   * The program token that is used for some API calls
   */
  public programToken: string | undefined;

  /**
   * Create a instance of the SDK Client
   *
   * @param config - The API config
   * @param config.username - The API username
   * @param config.password - The API password
   * @param [config.programToken] -
   * @param [config.encryptionData] -
   * @param [config.server=https://api.sandbox.hyperwallet.com] -
   */
  constructor({
    username,
    password,
    programToken,
    encryptionData,
    server = 'https://api.sandbox.hyperwallet.com',
    httpsAgent
  }: IHyperwalletOptions) {
    if (!username || !password) {
      throw new Error('You need to specify your API username and password!');
    }

    this.client = new ApiClient(
      username,
      password,
      server,
      encryptionData,
      httpsAgent
    );

    this.programToken = programToken;
  }

  /**
   * Handle 204 response for list calls
   *
   * @param callback - The api callback
   * @param - A wrapper api callback
   */
  public static handle204Response(callback) {
    return (err, data, res) => {
      if (!err && res.status === 204) {
        callback(
          err,
          {
            count: 0,
            data: []
          },
          res
        );

        return;
      }
      callback(err, data, res);
    };
  }

  // --------------------------------------
  // Users
  // --------------------------------------

  /**
   * Create a user
   *
   * @param data - The user data
   * @param callback - The callback for this call
   */
  public createUser(data, callback) {
    this.addProgramToken(data);
    this.client.doPost('users', data, {}, callback);
  }

  /**
   * Load a user
   *
   * @param userToken - The user token
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken is not provided
   */
  public getUser(userToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    this.client.doGet(`users/${encodeURIComponent(userToken)}`, {}, callback);
  }

  /**
   * Update a user
   *
   * @param userToken - The user token
   * @param data - The user data that should be updated
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken is not provided
   */
  public updateUser(userToken, data, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    this.addProgramToken(data);
    this.client.doPut(
      `users/${encodeURIComponent(userToken)}`,
      data,
      {},
      callback
    );
  }

  /**
   * List all users
   *
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   */
  public listUsers(options, callback) {
    this.client.doGet(
      'users',
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  /**
   * Get user status transition
   *
   * @param userToken - The user token
   * @param statusTransitionToken - The user status transition token
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken is not provided
   */
  public getUserStatusTransition(userToken, statusTransitionToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!statusTransitionToken) {
      throw new Error('statusTransitionToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(
        userToken
      )}/status-transitions/${encodeURIComponent(statusTransitionToken)}`,
      {},
      callback
    );
  }

  /**
   * List all user status transitions
   *
   * @param userToken - The user token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken is not provided
   */
  public listUserStatusTransitions(userToken, options, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(userToken)}/status-transitions`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  // --------------------------------------
  // Prepaid Cards
  // --------------------------------------

  /**
   * Create a prepaid card
   *
   * @param userToken - The user token
   * @param data - The prepaid card data
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken is not provided
   */
  public createPrepaidCard(userToken, data, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    this.client.doPost(
      `users/${encodeURIComponent(userToken)}/prepaid-cards`,
      data,
      {},
      callback
    );
  }

  /**
   * Get a prepaid card
   *
   * @param userToken - The user token
   * @param prepaidCardToken - The prepaid card token
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken or prepaidCardToken is not provided
   */
  public getPrepaidCard(userToken, prepaidCardToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!prepaidCardToken) {
      throw new Error('prepaidCardToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(
        userToken
      )}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}`,
      {},
      callback
    );
  }

  /**
   * Update a prepaid card
   *
   * @param userToken - The user token
   * @param prepaidCardToken - The prepaid card token
   * @param data - The prepaid card data to update
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken or prepaidCardToken is not provided
   */
  public updatePrepaidCard(userToken, prepaidCardToken, data, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!prepaidCardToken) {
      throw new Error('prepaidCardToken is required');
    }
    this.client.doPut(
      `users/${encodeURIComponent(
        userToken
      )}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}`,
      data,
      {},
      callback
    );
  }

  /**
   * List all prepaid cards
   *
   * @param userToken - The user token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken is not provided
   */
  public listPrepaidCards(userToken, options, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(userToken)}/prepaid-cards`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  /**
   * Suspend a prepaid card
   *
   * @param userToken - The user token
   * @param prepaidCardToken - The prepaid card token
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken or prepaidCardToken is not provided
   */
  public suspendPrepaidCard(userToken, prepaidCardToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!prepaidCardToken) {
      throw new Error('prepaidCardToken is required');
    }

    const transition = {
      transition: 'SUSPENDED'
    };
    this.client.doPost(
      `users/${encodeURIComponent(
        userToken
      )}/prepaid-cards/${encodeURIComponent(
        prepaidCardToken
      )}/status-transitions`,
      transition,
      {},
      callback
    );
  }

  /**
   * Unsuspend a prepaid card
   *
   * @param userToken - The user token
   * @param prepaidCardToken - The prepaid card token
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken or prepaidCardToken is not provided
   */
  public unsuspendPrepaidCard(userToken, prepaidCardToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!prepaidCardToken) {
      throw new Error('prepaidCardToken is required');
    }

    const transition = {
      transition: 'UNSUSPENDED'
    };
    this.client.doPost(
      `users/${encodeURIComponent(
        userToken
      )}/prepaid-cards/${encodeURIComponent(
        prepaidCardToken
      )}/status-transitions`,
      transition,
      {},
      callback
    );
  }

  /**
   * Mark a prepaid card as lost or stolen
   *
   * @param userToken - The user token
   * @param prepaidCardToken - The prepaid card token
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken or prepaidCardToken is not provided
   */
  public lostOrStolenPrepaidCard(userToken, prepaidCardToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!prepaidCardToken) {
      throw new Error('prepaidCardToken is required');
    }

    const transition = {
      transition: 'LOST_OR_STOLEN'
    };
    this.client.doPost(
      `users/${encodeURIComponent(
        userToken
      )}/prepaid-cards/${encodeURIComponent(
        prepaidCardToken
      )}/status-transitions`,
      transition,
      {},
      callback
    );
  }

  /**
   * Deactivate a prepaid card
   *
   * @param userToken - The user token
   * @param prepaidCardToken - The prepaid card token
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken or prepaidCardToken is not provided
   */
  public deactivatePrepaidCard(userToken, prepaidCardToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!prepaidCardToken) {
      throw new Error('prepaidCardToken is required');
    }

    const transition = {
      transition: 'DE_ACTIVATED'
    };
    this.client.doPost(
      `users/${encodeURIComponent(
        userToken
      )}/prepaid-cards/${encodeURIComponent(
        prepaidCardToken
      )}/status-transitions`,
      transition,
      {},
      callback
    );
  }

  /**
   * Lock a prepaid card
   *
   * @param userToken - The user token
   * @param prepaidCardToken - The prepaid card token
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken or prepaidCardToken is not provided
   */
  public lockPrepaidCard(userToken, prepaidCardToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!prepaidCardToken) {
      throw new Error('prepaidCardToken is required');
    }

    const transition = {
      transition: 'LOCKED'
    };
    this.client.doPost(
      `users/${encodeURIComponent(
        userToken
      )}/prepaid-cards/${encodeURIComponent(
        prepaidCardToken
      )}/status-transitions`,
      transition,
      {},
      callback
    );
  }

  /**
   * Unlock a prepaid card
   *
   * @param userToken - The user token
   * @param prepaidCardToken - The prepaid card token
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken or prepaidCardToken is not provided
   */
  public unlockPrepaidCard(userToken, prepaidCardToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!prepaidCardToken) {
      throw new Error('prepaidCardToken is required');
    }

    const transition = {
      transition: 'UNLOCKED'
    };
    this.client.doPost(
      `users/${encodeURIComponent(
        userToken
      )}/prepaid-cards/${encodeURIComponent(
        prepaidCardToken
      )}/status-transitions`,
      transition,
      {},
      callback
    );
  }

  /**
   * Create a prepaid card status transition
   *
   * @param userToken - The user token
   * @param prepaidCardToken - The prepaid card token
   * @param data - The prepaid card status transition data
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken or prepaidCardToken is not provided
   */
  public createPrepaidCardStatusTransition(
    userToken,
    prepaidCardToken,
    data,
    callback
  ) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!prepaidCardToken) {
      throw new Error('prepaidCardToken is required');
    }

    this.client.doPost(
      `users/${encodeURIComponent(
        userToken
      )}/prepaid-cards/${encodeURIComponent(
        prepaidCardToken
      )}/status-transitions`,
      data,
      {},
      callback
    );
  }

  /**
   * Get a prepaid card status transition
   *
   * @param userToken - The user token
   * @param prepaidCardToken - The prepaid card token
   * @param statusTransitionToken - The prepaid card status transition token
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken, prepaidCardToken or statusTransitionToken is not provided
   */
  public getPrepaidCardStatusTransition(
    userToken,
    prepaidCardToken,
    statusTransitionToken,
    callback
  ) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!prepaidCardToken) {
      throw new Error('prepaidCardToken is required');
    }
    if (!statusTransitionToken) {
      throw new Error('statusTransitionToken is required');
    }

    this.client.doGet(
      `users/${encodeURIComponent(
        userToken
      )}/prepaid-cards/${encodeURIComponent(
        prepaidCardToken
      )}/status-transitions/${encodeURIComponent(statusTransitionToken)}`,
      {},
      callback
    );
  }

  /**
   * List all prepaid card status transitions
   *
   * @param userToken - The user token
   * @param prepaidCardToken - The prepaid card token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken or prepaidCardToken is not provided
   */
  public listPrepaidCardStatusTransitions(
    userToken,
    prepaidCardToken,
    options,
    callback
  ) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!prepaidCardToken) {
      throw new Error('prepaidCardToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(
        userToken
      )}/prepaid-cards/${encodeURIComponent(
        prepaidCardToken
      )}/status-transitions`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  // --------------------------------------
  // Bank Cards
  // --------------------------------------

  /**
   * Create a Bank card
   *
   * @param userToken - The user token
   * @param data - The bank card data
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken is not provided
   */
  public createBankCard(userToken, data, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    this.client.doPost(
      `users/${encodeURIComponent(userToken)}/bank-cards`,
      data,
      {},
      callback
    );
  }

  /**
   * Get a bank card
   *
   * @param userToken - The user token
   * @param bankCardToken - The bank card token
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken or bankCardToken is not provided
   */
  public getBankCard(userToken, bankCardToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!bankCardToken) {
      throw new Error('bankCardToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(userToken)}/bank-cards/${encodeURIComponent(
        bankCardToken
      )}`,
      {},
      callback
    );
  }

  /**
   * Update a bank card
   *
   * @param userToken - The user token
   * @param bankCardToken - The bank card token
   * @param data - The bank card data to update
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken or bankCardToken is not provided
   */
  public updateBankCard(userToken, bankCardToken, data, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!bankCardToken) {
      throw new Error('bankCardToken is required');
    }
    this.client.doPut(
      `users/${encodeURIComponent(userToken)}/bank-cards/${encodeURIComponent(
        bankCardToken
      )}`,
      data,
      {},
      callback
    );
  }

  /**
   * List all bank cards
   *
   * @param userToken - The user token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken is not provided
   */
  public listBankCards(userToken, options, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(userToken)}/bank-cards`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  /**
   * Deactivate a bank card
   *
   * @param userToken - The user token
   * @param bankCardToken - The bank card token
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken or bankCardToken is not provided
   */
  public deactivateBankCard(userToken, bankCardToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!bankCardToken) {
      throw new Error('bankCardToken is required');
    }

    const transition = {
      transition: 'DE_ACTIVATED'
    };
    this.client.doPost(
      `users/${encodeURIComponent(userToken)}/bank-cards/${encodeURIComponent(
        bankCardToken
      )}/status-transitions`,
      transition,
      {},
      callback
    );
  }

  /**
   * Create a bank card status transition
   *
   * @param userToken - The user token
   * @param bankCardToken - The bank card token
   * @param data - The bank card status transition data
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken or bankCardToken is not provided
   */
  public createBankCardStatusTransition(
    userToken,
    bankCardToken,
    data,
    callback
  ) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!bankCardToken) {
      throw new Error('bankCardToken is required');
    }

    this.client.doPost(
      `users/${encodeURIComponent(userToken)}/bank-cards/${encodeURIComponent(
        bankCardToken
      )}/status-transitions`,
      data,
      {},
      callback
    );
  }

  /**
   * Get a bank card status transition
   *
   * @param userToken - The user token
   * @param bankCardToken - The bank card token
   * @param statusTransitionToken - The bank card status transition token
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken, bankCardToken or statusTransitionToken is not provided
   */
  public getBankCardStatusTransition(
    userToken,
    bankCardToken,
    statusTransitionToken,
    callback
  ) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!bankCardToken) {
      throw new Error('bankCardToken is required');
    }
    if (!statusTransitionToken) {
      throw new Error('statusTransitionToken is required');
    }

    this.client.doGet(
      `users/${encodeURIComponent(userToken)}/bank-cards/${encodeURIComponent(
        bankCardToken
      )}/status-transitions/${encodeURIComponent(statusTransitionToken)}`,
      {},
      callback
    );
  }

  /**
   * List all bank card status transitions
   *
   * @param userToken - The user token
   * @param bankCardToken - The bank card token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken or bankCardToken is not provided
   */
  public listBankCardStatusTransitions(
    userToken,
    bankCardToken,
    options,
    callback
  ) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!bankCardToken) {
      throw new Error('bankCardToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(userToken)}/bank-cards/${encodeURIComponent(
        bankCardToken
      )}/status-transitions`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  // --------------------------------------
  // Authentication Token
  // --------------------------------------

  /**
   * Get authentication token
   *
   * @param userToken - The user token
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken is not provided
   */
  public getAuthenticationToken(userToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    this.client.doPost(
      `users/${encodeURIComponent(userToken)}/authentication-token`,
      {},
      {},
      callback
    );
  }

  // --------------------------------------
  // Paper Checks
  // --------------------------------------

  /**
   * Create a paper check
   *
   * @param userToken - The user token
   * @param data - The paper check data
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken is not provided
   */
  public createPaperCheck(userToken, data, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    this.client.doPost(
      `users/${encodeURIComponent(userToken)}/paper-checks`,
      data,
      {},
      callback
    );
  }

  /**
   * Get a paper check
   *
   * @param userToken - The user token
   * @param paperCheckToken - The paper check token
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken or paperCheckToken is not provided
   */
  public getPaperCheck(userToken, paperCheckToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!paperCheckToken) {
      throw new Error('paperCheckToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(userToken)}/paper-checks/${encodeURIComponent(
        paperCheckToken
      )}`,
      {},
      callback
    );
  }

  /**
   * Update a paper check
   *
   * @param userToken - The user token
   * @param paperCheckToken - The paper check token
   * @param data - The paper check data to update
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken or paperCheckToken is not provided
   */
  public updatePaperCheck(userToken, paperCheckToken, data, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!paperCheckToken) {
      throw new Error('paperCheckToken is required');
    }
    this.client.doPut(
      `users/${encodeURIComponent(userToken)}/paper-checks/${encodeURIComponent(
        paperCheckToken
      )}`,
      data,
      {},
      callback
    );
  }

  /**
   * List all paper checks
   *
   * @param userToken - The user token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken is not provided
   */
  public listPaperChecks(userToken, options, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(userToken)}/paper-checks`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  /**
   * Deactivate a paper check
   *
   * @param userToken - The user token
   * @param paperCheckToken - The paper check token
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken or paperCheckToken is not provided
   */
  public deactivatePaperCheck(userToken, paperCheckToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!paperCheckToken) {
      throw new Error('paperCheckToken is required');
    }

    const transition = {
      transition: 'DE_ACTIVATED'
    };
    this.client.doPost(
      `users/${encodeURIComponent(userToken)}/paper-checks/${encodeURIComponent(
        paperCheckToken
      )}/status-transitions`,
      transition,
      {},
      callback
    );
  }

  /**
   * Create a paper check status transition
   *
   * @param userToken - The user token
   * @param paperCheckToken - The paper check token
   * @param data - The paper check status transition data
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken or paperCheckToken is not provided
   */
  public createPaperCheckStatusTransition(
    userToken,
    paperCheckToken,
    data,
    callback
  ) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!paperCheckToken) {
      throw new Error('paperCheckToken is required');
    }

    this.client.doPost(
      `users/${encodeURIComponent(userToken)}/paper-checks/${encodeURIComponent(
        paperCheckToken
      )}/status-transitions`,
      data,
      {},
      callback
    );
  }

  /**
   * Get a paper check status transition
   *
   * @param userToken - The user token
   * @param paperCheckToken - The paper check token
   * @param statusTransitionToken - The paper check status transition token
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken, paperCheckToken or statusTransitionToken is not provided
   */
  public getPaperCheckStatusTransition(
    userToken,
    paperCheckToken,
    statusTransitionToken,
    callback
  ) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!paperCheckToken) {
      throw new Error('paperCheckToken is required');
    }
    if (!statusTransitionToken) {
      throw new Error('statusTransitionToken is required');
    }

    this.client.doGet(
      `users/${encodeURIComponent(userToken)}/paper-checks/${encodeURIComponent(
        paperCheckToken
      )}/status-transitions/${encodeURIComponent(statusTransitionToken)}`,
      {},
      callback
    );
  }

  /**
   * List all paper check status transitions
   *
   * @param userToken - The user token
   * @param paperCheckToken - The paper check token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken or paperCheckToken is not provided
   */
  public listPaperCheckStatusTransitions(
    userToken,
    paperCheckToken,
    options,
    callback
  ) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!paperCheckToken) {
      throw new Error('paperCheckToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(userToken)}/paper-checks/${encodeURIComponent(
        paperCheckToken
      )}/status-transitions`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  // --------------------------------------
  // Transfers
  // --------------------------------------

  /**
   * Create a transfer
   *
   * @param data - The transfer data
   * @param callback - The callback for this call
   */
  public createTransfer(data, callback) {
    if (!data.sourceToken) {
      throw new Error('sourceToken is required');
    }
    if (!data.destinationToken) {
      throw new Error('destinationToken is required');
    }
    if (!data.clientTransferId) {
      throw new Error('clientTransferId is required');
    }
    this.client.doPost('transfers', data, {}, callback);
  }

  /**
   * Get a transfer
   *
   * @param transferToken - The transfer token
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if transferToken is not provided
   */
  public getTransfer(transferToken, callback) {
    if (!transferToken) {
      throw new Error('transferToken is required');
    }
    this.client.doGet(
      `transfers/${encodeURIComponent(transferToken)}`,
      {},
      callback
    );
  }

  /**
   * List all transfers
   *
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   */
  public listTransfers(options, callback) {
    this.client.doGet(
      'transfers',
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  /**
   * Create a transfer status transition
   *
   * @param transferToken - The transfer token
   * @param data - The transfer status transition data
   * @param callback - The callback for this call
   * @throws Will throw an error if transferToken is not provided
   */
  public createTransferStatusTransition(transferToken, data, callback) {
    if (!transferToken) {
      throw new Error('transferToken is required');
    }

    this.client.doPost(
      `transfers/${encodeURIComponent(transferToken)}/status-transitions`,
      data,
      {},
      callback
    );
  }

  // --------------------------------------
  // PayPal Accounts
  // --------------------------------------

  /**
   * Create a PayPal account
   *
   * @param userToken - The user token
   * @param data - The PayPal account data
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken is not provided
   */
  public createPayPalAccount(userToken, data, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!data.transferMethodCountry) {
      throw new Error('transferMethodCountry is required');
    }
    if (!data.transferMethodCurrency) {
      throw new Error('transferMethodCurrency is required');
    }
    if (!data.email) {
      throw new Error('email is required');
    }
    this.client.doPost(
      `users/${encodeURIComponent(userToken)}/paypal-accounts`,
      data,
      {},
      callback
    );
  }

  /**
   * Get a PayPal account
   *
   * @param userToken - The user token
   * @param payPalAccountToken - The PayPal account token
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken or payPalAccountToken is not provided
   */
  public getPayPalAccount(userToken, payPalAccountToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!payPalAccountToken) {
      throw new Error('payPalAccountToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(
        userToken
      )}/paypal-accounts/${encodeURIComponent(payPalAccountToken)}`,
      {},
      callback
    );
  }

  /**
   * List all PayPal accounts
   *
   * @param userToken - The user token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken is not provided
   */
  public listPayPalAccounts(userToken, options, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(userToken)}/paypal-accounts`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  // --------------------------------------
  // Bank Accounts
  // --------------------------------------

  /**
   * Create a bank account
   *
   * @param userToken - The user token
   * @param data - The bank account data
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken is not provided
   */
  public createBankAccount(userToken, data, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    this.client.doPost(
      `users/${encodeURIComponent(userToken)}/bank-accounts`,
      data,
      {},
      callback
    );
  }

  /**
   * Get a bank account
   *
   * @param userToken - The user token
   * @param bankAccountToken - The bank account token
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken or bankAccountToken is not provided
   */
  public getBankAccount(userToken, bankAccountToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!bankAccountToken) {
      throw new Error('bankAccountToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(
        userToken
      )}/bank-accounts/${encodeURIComponent(bankAccountToken)}`,
      {},
      callback
    );
  }

  /**
   * Update a bank account
   *
   * @param userToken - The user token
   * @param bankAccountToken - The bank account token
   * @param data - The bank account data to update
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken or bankAccountToken is not provided
   */
  public updateBankAccount(userToken, bankAccountToken, data, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!bankAccountToken) {
      throw new Error('bankAccountToken is required');
    }
    this.client.doPut(
      `users/${encodeURIComponent(
        userToken
      )}/bank-accounts/${encodeURIComponent(bankAccountToken)}`,
      data,
      {},
      callback
    );
  }

  /**
   * List all bank accounts
   *
   * @param userToken - The user token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken is not provided
   */
  public listBankAccounts(userToken, options, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(userToken)}/bank-accounts`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  /**
   * Deactivate a bank account
   *
   * @param userToken - The user token
   * @param bankAccountToken - The bank account token
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken or bankAccountToken is not provided
   */
  public deactivateBankAccount(userToken, bankAccountToken, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!bankAccountToken) {
      throw new Error('bankAccountToken is required');
    }

    const transition = {
      transition: 'DE-ACTIVATED'
    };
    this.client.doPost(
      `users/${encodeURIComponent(
        userToken
      )}/bank-accounts/${encodeURIComponent(
        bankAccountToken
      )}/status-transitions`,
      transition,
      {},
      callback
    );
  }

  /**
   * Create a bank account status transition
   *
   * @param userToken - The user token
   * @param bankAccountToken - The bank account token
   * @param data - The bank account status transition data
   * @param callback - The callback for this call
   * @throws Will throw an error if userToken or bankAccountToken is not provided
   */
  public createBankAccountStatusTransition(
    userToken,
    bankAccountToken,
    data,
    callback
  ) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!bankAccountToken) {
      throw new Error('bankAccountToken is required');
    }

    this.client.doPost(
      `users/${encodeURIComponent(
        userToken
      )}/bank-accounts/${encodeURIComponent(
        bankAccountToken
      )}/status-transitions`,
      data,
      {},
      callback
    );
  }

  /**
   * Get bank account status transition
   *
   * @param userToken - The user token
   * @param bankAccountToken - The bank account token
   * @param bankAccountToken - The bank account token
   * @param statusTransitionToken - The bank account status transition token
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken or bankAccountToken is not provided
   */
  public getBankAccountStatusTransition(
    userToken,
    bankAccountToken,
    statusTransitionToken,
    callback
  ) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!bankAccountToken) {
      throw new Error('bankAccountToken is required');
    }
    if (!statusTransitionToken) {
      throw new Error('statusTransitionToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(
        userToken
      )}/bank-accounts/${encodeURIComponent(
        bankAccountToken
      )}/status-transitions/${encodeURIComponent(statusTransitionToken)}`,
      {},
      callback
    );
  }

  /**
   * List all bank account status transitions
   *
   * @param userToken - The user token
   * @param bankAccountToken - The bank account token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken or bankAccountToken is not provided
   */
  public listBankAccountStatusTransitions(
    userToken,
    bankAccountToken,
    options,
    callback
  ) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!bankAccountToken) {
      throw new Error('bankAccountToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(
        userToken
      )}/bank-accounts/${encodeURIComponent(
        bankAccountToken
      )}/status-transitions`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  // --------------------------------------
  // Balances
  // --------------------------------------

  /**
   * List balances for a user
   *
   * @param userToken - The user token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken is not provided
   */
  public listBalancesForUser(userToken, options, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(userToken)}/balances`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  /**
   * List balances for a prepaid card
   *
   * @param userToken - The user token
   * @param prepaidCardToken - The prepaid card token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken or prepaidCardToken is not provided
   */
  public listBalancesForPrepaidCard(
    userToken,
    prepaidCardToken,
    options,
    callback
  ) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!prepaidCardToken) {
      throw new Error('prepaidCardToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(
        userToken
      )}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/balances`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  /**
   * List balances for a program accounts
   *
   * @param programToken - The program token
   * @param accountToken - The account token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if programToken or accountToken is not provided
   */
  public listBalancesForAccount(programToken, accountToken, options, callback) {
    if (!programToken) {
      throw new Error('programToken is required');
    }
    if (!accountToken) {
      throw new Error('accountToken is required');
    }
    this.client.doGet(
      `programs/${encodeURIComponent(
        programToken
      )}/accounts/${encodeURIComponent(accountToken)}/balances`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  // --------------------------------------
  // Payments
  // --------------------------------------

  /**
   * Create a payment
   *
   * @param data - The payment data
   * @param callback - The callback for this call
   */
  public createPayment(data, callback) {
    this.addProgramToken(data);
    this.client.doPost('payments', data, {}, callback);
  }

  /**
   * Get a payment
   *
   * @param paymentToken - The payment token
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if paymentToken is not provided
   */
  public getPayment(paymentToken, callback) {
    if (!paymentToken) {
      throw new Error('paymentToken is required');
    }
    this.client.doGet(
      `payments/${encodeURIComponent(paymentToken)}`,
      {},
      callback
    );
  }

  /**
   * List all payments
   *
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   */
  public listPayments(options, callback) {
    this.client.doGet(
      'payments',
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  /**
   * Create a payment status transition
   *
   * @param paymentToken - The payment token
   * @param data - The payment status transition data
   * @param callback - The callback for this call
   * @throws Will throw an error if paymentToken is not provided
   */
  public createPaymentStatusTransition(paymentToken, data, callback) {
    if (!paymentToken) {
      throw new Error('paymentToken is required');
    }

    this.client.doPost(
      `payments/${encodeURIComponent(paymentToken)}/status-transitions`,
      data,
      {},
      callback
    );
  }

  /**
   * Get payment status transition
   *
   * @param paymentToken - The payment token
   * @param statusTransitionToken - The payment status transition token
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if paymentToken is not provided
   */
  public getPaymentStatusTransition(
    paymentToken,
    statusTransitionToken,
    callback
  ) {
    if (!paymentToken) {
      throw new Error('paymentToken is required');
    }
    if (!statusTransitionToken) {
      throw new Error('statusTransitionToken is required');
    }
    this.client.doGet(
      `payments/${encodeURIComponent(
        paymentToken
      )}/status-transitions/${encodeURIComponent(statusTransitionToken)}`,
      {},
      callback
    );
  }

  /**
   * List all payment status transitions
   *
   * @param paymentToken - The payment token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if paymentToken is not provided
   */
  public listPaymentStatusTransitions(paymentToken, options, callback) {
    if (!paymentToken) {
      throw new Error('paymentToken is required');
    }
    this.client.doGet(
      `payments/${encodeURIComponent(paymentToken)}/status-transitions`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  // --------------------------------------
  // Programs
  // --------------------------------------

  /**
   * Get a program
   *
   * @param programToken - The program token
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if programToken is not provided
   */
  public getProgram(programToken, callback) {
    if (!programToken) {
      throw new Error('programToken is required');
    }
    this.client.doGet(
      `programs/${encodeURIComponent(programToken)}`,
      {},
      callback
    );
  }

  // --------------------------------------
  // Program Accounts
  // --------------------------------------

  /**
   * Get a program account
   *
   * @param programToken - The program token
   * @param accountToken - The account token
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if programToken is not provided
   */
  public getProgramAccount(programToken, accountToken, callback) {
    if (!programToken) {
      throw new Error('programToken is required');
    }
    if (!accountToken) {
      throw new Error('accountToken is required');
    }
    this.client.doGet(
      `programs/${encodeURIComponent(
        programToken
      )}/accounts/${encodeURIComponent(accountToken)}`,
      {},
      callback
    );
  }

  // --------------------------------------
  // Transfer Method Configurations
  // --------------------------------------

  /**
   * Get a transfer method configuration
   *
   * @param userToken - The user token
   * @param country - The transfer method country
   * @param currency - The transfer method currency
   * @param type - The transfer method type
   * @param profileType - The profile type
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken, country, currency, type or profileType is not provided
   */
  public getTransferMethodConfiguration(
    userToken,
    country,
    currency,
    type,
    profileType,
    callback
  ) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!country) {
      throw new Error('country is required');
    }
    if (!currency) {
      throw new Error('currency is required');
    }
    if (!type) {
      throw new Error('type is required');
    }
    if (!profileType) {
      throw new Error('profileType is required');
    }
    this.client.doGet(
      'transfer-method-configurations',
      {
        userToken,
        country,
        currency,
        type,
        profileType
      },
      callback
    );
  }

  /**
   * List all transfer method configurations
   *
   * @param userToken - The user token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken is not provided
   */
  public listTransferMethodConfigurations(userToken, options, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    const params = options
      ? objectAssign({}, options, { userToken })
      : { userToken };
    this.client.doGet(
      'transfer-method-configurations',
      params,
      Hyperwallet.handle204Response(callback)
    );
  }

  /**
   * Create a transfer method
   *
   * @param userToken The user token
   * @param jsonCacheToken The json cache token supplied by the widget
   * @param data - Transfer method data
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken is not provided
   * @throws Will throw an error if jsonCacheToken is not provided
   */
  public createTransferMethod(userToken, jsonCacheToken, data, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }

    if (!jsonCacheToken) {
      throw new Error('jsonCacheToken is required');
    }

    const headers = { 'Json-Cache-Token': jsonCacheToken };
    this.client.doPost(
      `users/${encodeURIComponent(userToken)}/transfer-methods`,
      data,
      headers,
      callback
    );
  }

  // --------------------------------------
  // Receipts
  // --------------------------------------

  /**
   * List all program account receipts
   *
   * @param programToken - The program token
   * @param accountToken - The account token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if programToken or accountToken is not provided
   */
  public listReceiptsForProgramAccount(
    programToken,
    accountToken,
    options,
    callback
  ) {
    if (!programToken) {
      throw new Error('programToken is required');
    }
    if (!accountToken) {
      throw new Error('accountToken is required');
    }
    this.client.doGet(
      `programs/${encodeURIComponent(
        programToken
      )}/accounts/${encodeURIComponent(accountToken)}/receipts`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  /**
   * List all user receipts
   *
   * @param userToken - The user token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken is not provided
   */
  public listReceiptsForUser(userToken, options, callback) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(userToken)}/receipts`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  /**
   * List all prepaid card receipts
   *
   * @param userToken - The user token
   * @param prepaidCardToken - The prepaid card token
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if userToken or prepaidCardToken is not provided
   */
  public listReceiptsForPrepaidCard(
    userToken,
    prepaidCardToken,
    options,
    callback
  ) {
    if (!userToken) {
      throw new Error('userToken is required');
    }
    if (!prepaidCardToken) {
      throw new Error('prepaidCardToken is required');
    }
    this.client.doGet(
      `users/${encodeURIComponent(
        userToken
      )}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/receipts`,
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  // --------------------------------------
  // Webhooks: Notifications
  // -------------------------------------

  /**
   * List webhook notifications
   *
   * @param options - The query parameters to send
   * @param callback - The callback for this call
   */
  public listWebhookNotifications(options, callback) {
    this.client.doGet(
      'webhook-notifications',
      options,
      Hyperwallet.handle204Response(callback)
    );
  }

  /**
   * Get a single webhook notification
   *
   * @param webhookToken - Webhook token
   * @param callback - The callback for this call
   *
   * @throws Will throw an error if webhookToken is not provided
   */
  public getWebhookNotification(webhookToken, callback) {
    if (!webhookToken) {
      throw new Error('webhookToken is required');
    }
    this.client.doGet(
      `webhook-notifications/${encodeURIComponent(webhookToken)}`,
      {},
      callback
    );
  }

  // --------------------------------------
  // Internal utils
  // --------------------------------------

  /**
   * Add program token to data object if not already set
   *
   * @param data - The data object
   * @param - The adjusted object
   */
  public addProgramToken(data) {
    if (!data || !this.programToken) {
      return data;
    }
    if (data.programToken) {
      return data;
    }

    data.programToken = this.programToken;

    return data;
  }
}

export default Hyperwallet;
