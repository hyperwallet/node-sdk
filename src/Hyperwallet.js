import objectAssign from "object-assign";
import ApiClient from "./utils/ApiClient";

/**
 * The Hyperwallet SDK Client
 */
export default class Hyperwallet {
    /**
     * Create a instance of the SDK Client
     *
     * @param {Object} config - The API config
     * @param {string} config.username - The API username
     * @param {string} config.password - The API password
     * @param {string} [config.programToken] - The program token that is used for some API calls
     * @param {Object} [config.encryptionData] - The JSON object of encryption data
     * @param {string} [config.server=https://api.sandbox.hyperwallet.com] - The API server to connect to
     */
    constructor({
        username, password, programToken, encryptionData, server = "https://api.sandbox.hyperwallet.com",
    }) {
        if (!username || !password) {
            throw new Error("You need to specify your API username and password!");
        }
        /**
         * The instance of the ApiClient
         *
         * @type {ApiClient}
         * @protected
         */
        this.client = new ApiClient(username, password, server, encryptionData);

        /**
         * The program token that is used for some API calls
         *
         * @type {string}
         * @protected
         */
        this.programToken = programToken;
    }

    //--------------------------------------
    // Users
    //--------------------------------------

    /**
     * Create a user
     *
     * @param {Object} data - The user data
     * @param {api-callback} callback - The callback for this call
     */
    createUser(data, callback) {
        this.addProgramToken(data);
        this.client.doPost("users", data, {}, callback);
    }

    /**
     * Load a user
     *
     * @param {string} userToken - The user token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    getUser(userToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}`, {}, callback);
    }

    /**
     * Update a user
     *
     * @param {string} userToken - The user token
     * @param {Object} data - The user data that should be updated
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    updateUser(userToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.addProgramToken(data);
        this.client.doPut(`users/${encodeURIComponent(userToken)}`, data, {}, callback);
    }

    /**
     * List all users
     *
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     */
    listUsers(options, callback) {
        const LIST_USER_FILTERS = ["clientUserId", "email", "programToken", "status", "verificationStatus", "taxVerificationStatus",
            "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_USER_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_USER_FILTERS));
        }
        this.client.doGet("users", options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Activate a user
     *
     * @param {string} userToken -  user token
     * @param {api-callback} callback -  callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    activateUser(userToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const transition = {
            transition: "ACTIVATED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Deactivate a user
     *
     * @param {string} userToken -  user token
     * @param {api-callback} callback -  callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    deactivateUser(userToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const transition = {
            transition: "DE_ACTIVATED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Lock a user account
     *
     * @param {string} userToken -  user token
     * @param {api-callback} callback -  callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    lockUser(userToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const transition = {
            transition: "LOCKED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Freeze a user account
     *
     * @param {string} userToken -  user token
     * @param {api-callback} callback -  callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    freezeUser(userToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const transition = {
            transition: "FROZEN",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Pre-activate a user account
     *
     * @param {string} userToken -  user token
     * @param {api-callback} callback -  callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    preactivateUser(userToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const transition = {
            transition: "PRE_ACTIVATED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Create a user status transition
     *
     * @param {string} userToken - user token
     * @param {Object} data - user status transition data
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    createUserStatusTransition(userToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }

        this.client.doPost(`users/${encodeURIComponent(userToken)}/status-transitions`, data, {}, callback);
    }

    /**
     * Get user status transition
     *
     * @param {string} userToken - The user token
     * @param {string} statusTransitionToken - The user status transition token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    getUserStatusTransition(userToken, statusTransitionToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!statusTransitionToken) {
            throw new Error("statusTransitionToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/status-transitions/${encodeURIComponent(statusTransitionToken)}`,
            {},
            callback);
    }

    /**
     * List all user status transitions
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    listUserStatusTransitions(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const LIST_USER_STATUS_TRANSITION_FILTERS = ["transition", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_USER_STATUS_TRANSITION_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_USER_STATUS_TRANSITION_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/status-transitions`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Upload Documents to User
     *
     * @param {string} userToken - The user token
     * @param {Object} data - JSON object of the data and files to be uploaded
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    uploadDocuments(userToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!data || Object.keys(data).length < 1) {
            throw new Error("Files for upload are required");
        }
        this.client.doPutMultipart(`users/${encodeURIComponent(userToken)}`, data, callback);
    }

    //--------------------------------------
    // Prepaid Cards
    //--------------------------------------

    /**
     * Create a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {Object} data - The prepaid card data
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    createPrepaidCard(userToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards`, data, {}, callback);
    }

    /**
     * Get a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    getPrepaidCard(userToken, prepaidCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}`, {}, callback);
    }

    /**
     * Update a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {Object} data - The prepaid card data to update
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    updatePrepaidCard(userToken, prepaidCardToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }
        this.client.doPut(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}`, data, {}, callback);
    }

    /**
     * List all prepaid cards
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    listPrepaidCards(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const LIST_PREPAID_CARDS_FILTERS = ["status", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_PREPAID_CARDS_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_PREPAID_CARDS_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/prepaid-cards`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Suspend a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    suspendPrepaidCard(userToken, prepaidCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }

        const transition = {
            transition: "SUSPENDED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Unsuspend a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    unsuspendPrepaidCard(userToken, prepaidCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }

        const transition = {
            transition: "UNSUSPENDED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Mark a prepaid card as lost or stolen
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    lostOrStolenPrepaidCard(userToken, prepaidCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }

        const transition = {
            transition: "LOST_OR_STOLEN",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Deactivate a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    deactivatePrepaidCard(userToken, prepaidCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }

        const transition = {
            transition: "DE_ACTIVATED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Lock a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    lockPrepaidCard(userToken, prepaidCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }

        const transition = {
            transition: "LOCKED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Unlock a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    unlockPrepaidCard(userToken, prepaidCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }

        const transition = {
            transition: "UNLOCKED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Create a prepaid card status transition
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {Object} data - The prepaid card status transition data
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    createPrepaidCardStatusTransition(userToken, prepaidCardToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }

        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, data, {}, callback);
    }

    /**
     * Get a prepaid card status transition
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {string} statusTransitionToken - The prepaid card status transition token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken, prepaidCardToken or statusTransitionToken is not provided
     */
    getPrepaidCardStatusTransition(userToken, prepaidCardToken, statusTransitionToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }
        if (!statusTransitionToken) {
            throw new Error("statusTransitionToken is required");
        }

        this.client.doGet(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions/${encodeURIComponent(statusTransitionToken)}`, {}, callback);
    }

    /**
     * List all prepaid card status transitions
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    listPrepaidCardStatusTransitions(userToken, prepaidCardToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }
        const LIST_PREPAID_CARD_STATUS_TRANSITION_FILTERS = ["transition", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_PREPAID_CARD_STATUS_TRANSITION_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_PREPAID_CARD_STATUS_TRANSITION_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, options, Hyperwallet.handle204Response(callback));
    }

    //--------------------------------------
    // Bank Cards
    //--------------------------------------

    /**
     * Create a Bank card
     *
     * @param {string} userToken - The user token
     * @param {Object} data - The bank card data
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    createBankCard(userToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doPost(`users/${encodeURIComponent(userToken)}/bank-cards`, data, {}, callback);
    }

    /**
     * Get a bank card
     *
     * @param {string} userToken - The user token
     * @param {string} bankCardToken - The bank card token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or bankCardToken is not provided
     */
    getBankCard(userToken, bankCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankCardToken) {
            throw new Error("bankCardToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/bank-cards/${encodeURIComponent(bankCardToken)}`, {}, callback);
    }

    /**
     * Update a bank card
     *
     * @param {string} userToken - The user token
     * @param {string} bankCardToken - The bank card token
     * @param {Object} data - The bank card data to update
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or bankCardToken is not provided
     */
    updateBankCard(userToken, bankCardToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankCardToken) {
            throw new Error("bankCardToken is required");
        }
        this.client.doPut(`users/${encodeURIComponent(userToken)}/bank-cards/${encodeURIComponent(bankCardToken)}`, data, {}, callback);
    }

    /**
     * List all bank cards
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    listBankCards(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const LIST_BANK_CARDS_FILTERS = ["status", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_BANK_CARDS_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_BANK_CARDS_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/bank-cards`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Deactivate a bank card
     *
     * @param {string} userToken - The user token
     * @param {string} bankCardToken - The bank card token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or bankCardToken is not provided
     */
    deactivateBankCard(userToken, bankCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankCardToken) {
            throw new Error("bankCardToken is required");
        }

        const transition = {
            transition: "DE_ACTIVATED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/bank-cards/${encodeURIComponent(bankCardToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Create a bank card status transition
     *
     * @param {string} userToken - The user token
     * @param {string} bankCardToken - The bank card token
     * @param {Object} data - The bank card status transition data
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or bankCardToken is not provided
     */
    createBankCardStatusTransition(userToken, bankCardToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankCardToken) {
            throw new Error("bankCardToken is required");
        }

        this.client.doPost(`users/${encodeURIComponent(userToken)}/bank-cards/${encodeURIComponent(bankCardToken)}/status-transitions`, data, {}, callback);
    }

    /**
     * Get a bank card status transition
     *
     * @param {string} userToken - The user token
     * @param {string} bankCardToken - The bank card token
     * @param {string} statusTransitionToken - The bank card status transition token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken, bankCardToken or statusTransitionToken is not provided
     */
    getBankCardStatusTransition(userToken, bankCardToken, statusTransitionToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankCardToken) {
            throw new Error("bankCardToken is required");
        }
        if (!statusTransitionToken) {
            throw new Error("statusTransitionToken is required");
        }

        this.client.doGet(`users/${encodeURIComponent(userToken)}/bank-cards/${encodeURIComponent(bankCardToken)}/status-transitions/${encodeURIComponent(statusTransitionToken)}`, {}, callback);
    }

    /**
     * List all bank card status transitions
     *
     * @param {string} userToken - The user token
     * @param {string} bankCardToken - The bank card token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or bankCardToken is not provided
     */
    listBankCardStatusTransitions(userToken, bankCardToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankCardToken) {
            throw new Error("bankCardToken is required");
        }
        const LIST_BANK_CARD_STATUS_TRANSITION_FILTERS = ["transition", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_BANK_CARD_STATUS_TRANSITION_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_BANK_CARD_STATUS_TRANSITION_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/bank-cards/${encodeURIComponent(bankCardToken)}/status-transitions`, options, Hyperwallet.handle204Response(callback));
    }

    //--------------------------------------
    // Authentication Token
    //--------------------------------------

    /**
     * Get authentication token
     *
     * @param {string} userToken - The user token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    getAuthenticationToken(userToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doPost(`users/${encodeURIComponent(userToken)}/authentication-token`, {}, {}, callback);
    }

    //--------------------------------------
    // Paper Checks
    //--------------------------------------

    /**
     * Create a paper check
     *
     * @param {string} userToken - The user token
     * @param {Object} data - The paper check data
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    createPaperCheck(userToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doPost(`users/${encodeURIComponent(userToken)}/paper-checks`, data, {}, callback);
    }

    /**
     * Get a paper check
     *
     * @param {string} userToken - The user token
     * @param {string} paperCheckToken - The paper check token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or paperCheckToken is not provided
     */
    getPaperCheck(userToken, paperCheckToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!paperCheckToken) {
            throw new Error("paperCheckToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/paper-checks/${encodeURIComponent(paperCheckToken)}`, {}, callback);
    }

    /**
     * Update a paper check
     *
     * @param {string} userToken - The user token
     * @param {string} paperCheckToken - The paper check token
     * @param {Object} data - The paper check data to update
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or paperCheckToken is not provided
     */
    updatePaperCheck(userToken, paperCheckToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!paperCheckToken) {
            throw new Error("paperCheckToken is required");
        }
        this.client.doPut(`users/${encodeURIComponent(userToken)}/paper-checks/${encodeURIComponent(paperCheckToken)}`, data, {}, callback);
    }

    /**
     * List all paper checks
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    listPaperChecks(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const LIST_PAPER_CHECKS_FILTERS = ["status", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_PAPER_CHECKS_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_PAPER_CHECKS_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/paper-checks`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Deactivate a paper check
     *
     * @param {string} userToken - The user token
     * @param {string} paperCheckToken - The paper check token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or paperCheckToken is not provided
     */
    deactivatePaperCheck(userToken, paperCheckToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!paperCheckToken) {
            throw new Error("paperCheckToken is required");
        }

        const transition = {
            transition: "DE_ACTIVATED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/paper-checks/${encodeURIComponent(paperCheckToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Create a paper check status transition
     *
     * @param {string} userToken - The user token
     * @param {string} paperCheckToken - The paper check token
     * @param {Object} data - The paper check status transition data
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or paperCheckToken is not provided
     */
    createPaperCheckStatusTransition(userToken, paperCheckToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!paperCheckToken) {
            throw new Error("paperCheckToken is required");
        }

        this.client.doPost(`users/${encodeURIComponent(userToken)}/paper-checks/${encodeURIComponent(paperCheckToken)}/status-transitions`, data, {}, callback);
    }

    /**
     * Get a paper check status transition
     *
     * @param {string} userToken - The user token
     * @param {string} paperCheckToken - The paper check token
     * @param {string} statusTransitionToken - The paper check status transition token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken, paperCheckToken or statusTransitionToken is not provided
     */
    getPaperCheckStatusTransition(userToken, paperCheckToken, statusTransitionToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!paperCheckToken) {
            throw new Error("paperCheckToken is required");
        }
        if (!statusTransitionToken) {
            throw new Error("statusTransitionToken is required");
        }

        this.client.doGet(`users/${encodeURIComponent(userToken)}/paper-checks/${encodeURIComponent(paperCheckToken)}/status-transitions/${encodeURIComponent(statusTransitionToken)}`, {}, callback);
    }

    /**
     * List all paper check status transitions
     *
     * @param {string} userToken - The user token
     * @param {string} paperCheckToken - The paper check token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or paperCheckToken is not provided
     */
    listPaperCheckStatusTransitions(userToken, paperCheckToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!paperCheckToken) {
            throw new Error("paperCheckToken is required");
        }
        const LIST_PAPER_CHECK_STATUS_TRANSITION_FILTERS = ["transition", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_PAPER_CHECK_STATUS_TRANSITION_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_PAPER_CHECK_STATUS_TRANSITION_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/paper-checks/${encodeURIComponent(paperCheckToken)}/status-transitions`, options, Hyperwallet.handle204Response(callback));
    }

    //--------------------------------------
    // Transfers
    //--------------------------------------

    /**
     * Create a transfer
     *
     * @param {Object} data - The transfer data
     * @param {api-callback} callback - The callback for this call
     */
    createTransfer(data, callback) {
        if (!data.sourceToken) {
            throw new Error("sourceToken is required");
        }
        if (!data.destinationToken) {
            throw new Error("destinationToken is required");
        }
        if (!data.clientTransferId) {
            throw new Error("clientTransferId is required");
        }
        this.client.doPost("transfers", data, {}, callback);
    }

    /**
     * Get a transfer
     *
     * @param {string} transferToken - The transfer token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if transferToken is not provided
     */
    getTransfer(transferToken, callback) {
        if (!transferToken) {
            throw new Error("transferToken is required");
        }
        this.client.doGet(`transfers/${encodeURIComponent(transferToken)}`, {}, callback);
    }

    /**
     * List all transfers
     *
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     */
    listTransfers(options, callback) {
        const LIST_TRANSFERS_FILTERS = ["clientTransferId", "sourceToken", "destinationToken", "createdBefore", "createdAfter", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_TRANSFERS_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_TRANSFERS_FILTERS));
        }
        this.client.doGet("transfers", options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Create a transfer status transition
     *
     * @param {string} transferToken - The transfer token
     * @param {Object} data - The transfer status transition data
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if transferToken is not provided
     */
    createTransferStatusTransition(transferToken, data, callback) {
        if (!transferToken) {
            throw new Error("transferToken is required");
        }

        this.client.doPost(`transfers/${encodeURIComponent(transferToken)}/status-transitions`, data, {}, callback);
    }

    //--------------------------------------
    // Transfer Refunds
    //--------------------------------------

    /**
     * Create a transfer refund
     *
     * @param {string} transferToken - The transfer token
     * @param {Object} data - The transfer refund data
     * @param {api-callback} callback - The callback for this call
     */
    createTransferRefund(transferToken, data, callback) {
        if (!transferToken) {
            throw new Error("transferToken is required");
        }
        if (!data.clientRefundId) {
            throw new Error("clientRefundId is required");
        }
        this.client.doPost(`transfers/${encodeURIComponent(transferToken)}/refunds`, data, {}, callback);
    }

    /**
     * Get a transfer
     *
     * @param {string} transferToken - The transfer token
     * @param {string} transferRefundToken - The transfer refund token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if transferToken is not provided
     */
    getTransferRefund(transferToken, transferRefundToken, callback) {
        if (!transferToken) {
            throw new Error("transferToken is required");
        }
        if (!transferRefundToken) {
            throw new Error("transferRefundToken is required");
        }
        this.client.doGet(`transfers/${encodeURIComponent(transferToken)}/refunds/${encodeURIComponent(transferRefundToken)}`, {}, callback);
    }

    /**
     * List all transfers
     *
     * @param {string} transferToken - The transfer token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     */
    listTransferRefunds(transferToken, options, callback) {
        if (!transferToken) {
            throw new Error("transferToken is required");
        }
        this.client.doGet(`transfers/${encodeURIComponent(transferToken)}/refunds`, options, Hyperwallet.handle204Response(callback));
    }

    //--------------------------------------
    // PayPal Accounts
    //--------------------------------------

    /**
     * Create a PayPal account
     *
     * @param {string} userToken - The user token
     * @param {Object} data - The PayPal account data
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    createPayPalAccount(userToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!data.transferMethodCountry) {
            throw new Error("transferMethodCountry is required");
        }
        if (!data.transferMethodCurrency) {
            throw new Error("transferMethodCurrency is required");
        }
        if (!data.email && !data.accountId) {
            throw new Error("email or accountId is required");
        }
        this.client.doPost(`users/${encodeURIComponent(userToken)}/paypal-accounts`, data, {}, callback);
    }

    /**
     * Get a PayPal account
     *
     * @param {string} userToken - The user token
     * @param {string} payPalAccountToken - The PayPal account token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or payPalAccountToken is not provided
     */
    getPayPalAccount(userToken, payPalAccountToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!payPalAccountToken) {
            throw new Error("payPalAccountToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/paypal-accounts/${encodeURIComponent(payPalAccountToken)}`, {}, callback);
    }

    /**
     * List all PayPal accounts
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    listPayPalAccounts(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const LIST_PAYPAL_ACCOUNTS_FILTERS = ["status", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_PAYPAL_ACCOUNTS_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_PAYPAL_ACCOUNTS_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/paypal-accounts`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Update a PayPal account
     *
     * @param {string} userToken - The user token
     * @param {string} payPalAccountToken - The PayPal account token
     * @param {Object} data - The PayPal account data to update
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or payPalAccountToken is not provided
     */
    updatePayPalAccount(userToken, payPalAccountToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!payPalAccountToken) {
            throw new Error("payPalAccountToken is required");
        }
        this.client.doPut(`users/${encodeURIComponent(userToken)}/paypal-accounts/${encodeURIComponent(payPalAccountToken)}`, data, {}, callback);
    }

    /**
     * Activate a PayPal account
     *
     * @param {string} userToken - The user token
     * @param {string} payPalAccountToken - The PayPal account token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or payPalAccountToken is not provided
     */
    activatePayPalAccount(userToken, payPalAccountToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!payPalAccountToken) {
            throw new Error("payPalAccountToken is required");
        }

        const transition = {
            transition: "ACTIVATED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/paypal-accounts/${encodeURIComponent(payPalAccountToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Deactivate a PayPal account
     *
     * @param {string} userToken - The user token
     * @param {string} payPalAccountToken - The PayPal account token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or payPalAccountToken is not provided
     */
    deactivatePayPalAccount(userToken, payPalAccountToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!payPalAccountToken) {
            throw new Error("payPalAccountToken is required");
        }

        const transition = {
            transition: "DE_ACTIVATED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/paypal-accounts/${encodeURIComponent(payPalAccountToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Create PayPal account status transition
     *
     * @param {string} userToken - The user token
     * @param {string} payPalAccountToken - PayPal account token
     * @param {Object} data - PayPal account status transition data
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or payPalAccountToken is not provided
     */
    createPayPalAccountStatusTransition(userToken, payPalAccountToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!payPalAccountToken) {
            throw new Error("payPalAccountToken is required");
        }

        this.client.doPost(`users/${encodeURIComponent(userToken)}/paypal-accounts/${encodeURIComponent(payPalAccountToken)}/status-transitions`, data, {}, callback);
    }

    /**
     * Get PayPal account status transition
     *
     * @param {string} userToken - The user token
     * @param {string} payPalAccountToken - PayPal account token
     * @param {string} statusTransitionToken - The PayPal account status transition token
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or payPalAccountToken or statusTransitionToken is not provided
     */
    getPayPalAccountStatusTransition(userToken, payPalAccountToken, statusTransitionToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!payPalAccountToken) {
            throw new Error("payPalAccountToken is required");
        }
        if (!statusTransitionToken) {
            throw new Error("statusTransitionToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/paypal-accounts/${encodeURIComponent(payPalAccountToken)}/status-transitions/${encodeURIComponent(statusTransitionToken)}`,
            {}, callback);
    }

    /**
     * List PayPal account status transition
     *
     * @param {string} userToken - The user token
     * @param {string} payPalAccountToken - PayPal account token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or payPalAccountToken is not provided
     */
    listPayPalAccountStatusTransitions(userToken, payPalAccountToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!payPalAccountToken) {
            throw new Error("payPalAccountToken is required");
        }
        const LIST_PAYPAL_ACCOUNTS_STATUS_TRANSITION_FILTERS = ["transition", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_PAYPAL_ACCOUNTS_STATUS_TRANSITION_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_PAYPAL_ACCOUNTS_STATUS_TRANSITION_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/paypal-accounts/${encodeURIComponent(payPalAccountToken)}/status-transitions`, options, Hyperwallet.handle204Response(callback));
    }

    //--------------------------------------
    // Bank Accounts
    //--------------------------------------

    /**
     * Create a bank account
     *
     * @param {string} userToken - The user token
     * @param {Object} data - The bank account data
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    createBankAccount(userToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doPost(`users/${encodeURIComponent(userToken)}/bank-accounts`, data, {}, callback);
    }

    /**
     * Get a bank account
     *
     * @param {string} userToken - The user token
     * @param {string} bankAccountToken - The bank account token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or bankAccountToken is not provided
     */
    getBankAccount(userToken, bankAccountToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankAccountToken) {
            throw new Error("bankAccountToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/bank-accounts/${encodeURIComponent(bankAccountToken)}`, {}, callback);
    }

    /**
     * Update a bank account
     *
     * @param {string} userToken - The user token
     * @param {string} bankAccountToken - The bank account token
     * @param {Object} data - The bank account data to update
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or bankAccountToken is not provided
     */
    updateBankAccount(userToken, bankAccountToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankAccountToken) {
            throw new Error("bankAccountToken is required");
        }
        this.client.doPut(`users/${encodeURIComponent(userToken)}/bank-accounts/${encodeURIComponent(bankAccountToken)}`, data, {}, callback);
    }

    /**
     * List all bank accounts
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    listBankAccounts(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const LIST_BANK_ACCOUNTS_FILTERS = ["type", "status", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_BANK_ACCOUNTS_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_BANK_ACCOUNTS_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/bank-accounts`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Deactivate a bank account
     *
     * @param {string} userToken - The user token
     * @param {string} bankAccountToken - The bank account token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or bankAccountToken is not provided
     */
    deactivateBankAccount(userToken, bankAccountToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankAccountToken) {
            throw new Error("bankAccountToken is required");
        }
        const transition = {
            transition: "DE_ACTIVATED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/bank-accounts/${encodeURIComponent(bankAccountToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Create a bank account status transition
     *
     * @param {string} userToken - The user token
     * @param {string} bankAccountToken - The bank account token
     * @param {Object} data - The bank account status transition data
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or bankAccountToken is not provided
     */
    createBankAccountStatusTransition(userToken, bankAccountToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankAccountToken) {
            throw new Error("bankAccountToken is required");
        }

        this.client.doPost(`users/${encodeURIComponent(userToken)}/bank-accounts/${encodeURIComponent(bankAccountToken)}/status-transitions`, data, {}, callback);
    }

    /**
     * Get bank account status transition
     *
     * @param {string} userToken - The user token
     * @param {string} bankAccountToken - The bank account token
     * @param {string} bankAccountToken - The bank account token
     * @param {string} statusTransitionToken - The bank account status transition token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or bankAccountToken is not provided
     */
    getBankAccountStatusTransition(userToken, bankAccountToken, statusTransitionToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankAccountToken) {
            throw new Error("bankAccountToken is required");
        }
        if (!statusTransitionToken) {
            throw new Error("statusTransitionToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/bank-accounts/${encodeURIComponent(bankAccountToken)}/status-transitions/${encodeURIComponent(statusTransitionToken)}`,
            {},
            callback);
    }

    /**
     * List all bank account status transitions
     *
     * @param {string} userToken - The user token
     * @param {string} bankAccountToken - The bank account token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or bankAccountToken is not provided
     */
    listBankAccountStatusTransitions(userToken, bankAccountToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankAccountToken) {
            throw new Error("bankAccountToken is required");
        }
        const LIST_BANK_ACCOUNT_STATUS_TRANSITION_FILTERS = ["transition", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_BANK_ACCOUNT_STATUS_TRANSITION_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_BANK_ACCOUNT_STATUS_TRANSITION_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/bank-accounts/${encodeURIComponent(bankAccountToken)}/status-transitions`, options, Hyperwallet.handle204Response(callback));
    }

    //--------------------------------------
    // Balances
    //--------------------------------------

    /**
     * List balances for a user
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    listBalancesForUser(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const LIST_USER_BALANCE_FILTERS = ["currency", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_USER_BALANCE_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_USER_BALANCE_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/balances`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * List balances for a prepaid card
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    listBalancesForPrepaidCard(userToken, prepaidCardToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }
        const LIST_PREPAID_CARD_BALANCE_FILTERS = ["sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_PREPAID_CARD_BALANCE_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_PREPAID_CARD_BALANCE_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/balances`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * List balances for a program accounts
     *
     * @param {string} programToken - The program token
     * @param {string} accountToken - The account token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if programToken or accountToken is not provided
     */
    listBalancesForAccount(programToken, accountToken, options, callback) {
        if (!programToken) {
            throw new Error("programToken is required");
        }
        if (!accountToken) {
            throw new Error("accountToken is required");
        }
        const LIST_ACCOUNT_BALANCE_FILTERS = ["currency", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_ACCOUNT_BALANCE_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_ACCOUNT_BALANCE_FILTERS));
        }
        this.client.doGet(`programs/${encodeURIComponent(programToken)}/accounts/${encodeURIComponent(accountToken)}/balances`, options, Hyperwallet.handle204Response(callback));
    }

    //--------------------------------------
    // Payments
    //--------------------------------------

    /**
     * Create a payment
     *
     * @param {Object} data - The payment data
     * @param {api-callback} callback - The callback for this call
     */
    createPayment(data, callback) {
        this.addProgramToken(data);
        this.client.doPost("payments", data, {}, callback);
    }

    /**
     * Get a payment
     *
     * @param {string} paymentToken - The payment token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if paymentToken is not provided
     */
    getPayment(paymentToken, callback) {
        if (!paymentToken) {
            throw new Error("paymentToken is required");
        }
        this.client.doGet(`payments/${encodeURIComponent(paymentToken)}`, {}, callback);
    }


    /**
     * List all payments
     *
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if invalid payment is provided
     */
    listPayments(options, callback) {
        const LIST_PAYMENT_FILTERS = ["clientPaymentId", "releaseDate", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_PAYMENT_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_PAYMENT_FILTERS));
        }
        this.client.doGet("payments", options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Create a payment status transition
     *
     * @param {string} paymentToken - The payment token
     * @param {Object} data - The payment status transition data
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if paymentToken is not provided
     */
    createPaymentStatusTransition(paymentToken, data, callback) {
        if (!paymentToken) {
            throw new Error("paymentToken is required");
        }

        this.client.doPost(`payments/${encodeURIComponent(paymentToken)}/status-transitions`, data, {}, callback);
    }

    /**
     * Get payment status transition
     *
     * @param {string} paymentToken - The payment token
     * @param {string} statusTransitionToken - The payment status transition token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if paymentToken is not provided
     */
    getPaymentStatusTransition(paymentToken, statusTransitionToken, callback) {
        if (!paymentToken) {
            throw new Error("paymentToken is required");
        }
        if (!statusTransitionToken) {
            throw new Error("statusTransitionToken is required");
        }
        this.client.doGet(`payments/${encodeURIComponent(paymentToken)}/status-transitions/${encodeURIComponent(statusTransitionToken)}`,
            {},
            callback);
    }

    /**
     * List all payment status transitions
     *
     * @param {string} paymentToken - The payment token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if paymentToken is not provided
     */
    listPaymentStatusTransitions(paymentToken, options, callback) {
        if (!paymentToken) {
            throw new Error("paymentToken is required");
        }
        const LIST_PAYMENT_STATUS_TRANSITION_FILTERS = ["transition", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_PAYMENT_STATUS_TRANSITION_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_PAYMENT_STATUS_TRANSITION_FILTERS));
        }

        this.client.doGet(`payments/${encodeURIComponent(paymentToken)}/status-transitions`, options, Hyperwallet.handle204Response(callback));
    }

    //--------------------------------------
    // Programs
    //--------------------------------------

    /**
     * Get a program
     *
     * @param {string} programToken - The program token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if programToken is not provided
     */
    getProgram(programToken, callback) {
        if (!programToken) {
            throw new Error("programToken is required");
        }
        this.client.doGet(`programs/${encodeURIComponent(programToken)}`, {}, callback);
    }

    //--------------------------------------
    // Program Accounts
    //--------------------------------------

    /**
     * Get a program account
     *
     * @param {string} programToken - The program token
     * @param {string} accountToken - The account token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if programToken is not provided
     */
    getProgramAccount(programToken, accountToken, callback) {
        if (!programToken) {
            throw new Error("programToken is required");
        }
        if (!accountToken) {
            throw new Error("accountToken is required");
        }
        this.client.doGet(`programs/${encodeURIComponent(programToken)}/accounts/${encodeURIComponent(accountToken)}`, {}, callback);
    }


    //--------------------------------------
    // Transfer Method Configurations
    //--------------------------------------

    /**
     * Get a transfer method configuration
     *
     * @param {string} userToken - The user token
     * @param {string} country - The transfer method country
     * @param {string} currency - The transfer method currency
     * @param {string} type - The transfer method type
     * @param {string} profileType - The profile type
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken, country, currency, type or profileType is not provided
     */
    getTransferMethodConfiguration(userToken, country, currency, type, profileType, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!country) {
            throw new Error("country is required");
        }
        if (!currency) {
            throw new Error("currency is required");
        }
        if (!type) {
            throw new Error("type is required");
        }
        if (!profileType) {
            throw new Error("profileType is required");
        }
        this.client.doGet("transfer-method-configurations", {
            userToken,
            country,
            currency,
            type,
            profileType,
        }, callback);
    }

    /**
     * List all transfer method configurations
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    listTransferMethodConfigurations(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const LIST_TRANSFER_METHOD_CONFIG_FILTERS = ["userToken", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_TRANSFER_METHOD_CONFIG_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_TRANSFER_METHOD_CONFIG_FILTERS));
        }
        const params = options ? objectAssign({}, options, { userToken }) : { userToken };
        this.client.doGet("transfer-method-configurations", params, Hyperwallet.handle204Response(callback));
    }

    /**
     * Create a transfer method
     *
     * @param {string} userToken The user token
     * @param {string} jsonCacheToken The json cache token supplied by the widget
     * @param {Object} data - Transfer method data
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     * @throws Will throw an error if jsonCacheToken is not provided
     */
    createTransferMethod(userToken, jsonCacheToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }

        if (!jsonCacheToken) {
            throw new Error("jsonCacheToken is required");
        }

        const headers = { "Json-Cache-Token": jsonCacheToken };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/transfer-methods`, data, headers, callback);
    }

    //--------------------------------------
    // Receipts
    //--------------------------------------

    /**
     * List all program account receipts
     *
     * @param {string} programToken - The program token
     * @param {string} accountToken - The account token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if programToken or accountToken is not provided
     */
    listReceiptsForProgramAccount(programToken, accountToken, options, callback) {
        if (!programToken) {
            throw new Error("programToken is required");
        }
        if (!accountToken) {
            throw new Error("accountToken is required");
        }
        const LIST_ACCOUNT_RECEIPTS_FILTERS = ["currency", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_ACCOUNT_RECEIPTS_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_ACCOUNT_RECEIPTS_FILTERS));
        }
        this.client.doGet(`programs/${encodeURIComponent(programToken)}/accounts/${encodeURIComponent(accountToken)}/receipts`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * List all user receipts
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    listReceiptsForUser(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const LIST_USER_RECEIPTS_FILTERS = ["createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_USER_RECEIPTS_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_USER_RECEIPTS_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/receipts`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * List all prepaid card receipts
     *
     * @param {string} userToken - The user token
     * @param {string} prepaidCardToken - The prepaid card token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or prepaidCardToken is not provided
     */
    listReceiptsForPrepaidCard(userToken, prepaidCardToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }
        const LIST_PREPAID_CARD_RECEIPTS_FILTERS = ["createdBefore", "createdAfter"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_PREPAID_CARD_RECEIPTS_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_PREPAID_CARD_RECEIPTS_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/receipts`, options, Hyperwallet.handle204Response(callback));
    }

    //--------------------------------------
    // Webhooks: Notifications
    //-------------------------------------

    /**
     * List webhook notifications
     *
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     */
    listWebhookNotifications(options, callback) {
        const LIST_WEBHOOK_NOTIFICATIONS_FILTERS = ["programToken", "createdBefore", "createdAfter",
            "type", "sortBy", "limit"];

        if (options && !Hyperwallet.isValidFilter(options, LIST_WEBHOOK_NOTIFICATIONS_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_WEBHOOK_NOTIFICATIONS_FILTERS));
        }
        this.client.doGet("webhook-notifications", options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Get a single webhook notification
     *
     * @param {string} webhookToken - Webhook token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if webhookToken is not provided
     */
    getWebhookNotification(webhookToken, callback) {
        if (!webhookToken) {
            throw new Error("webhookToken is required");
        }
        this.client.doGet(`webhook-notifications/${encodeURIComponent(webhookToken)}`, {}, callback);
    }

    //--------------------------------------
    // Internal utils
    //--------------------------------------

    /**
     * Add program token to data object if not already set
     *
     * @param {Object} data - The data object
     * @returns {Object} - The adjusted object
     *
     * @private
     */
    addProgramToken(data) {
        if (!data || !this.programToken) {
            return data;
        }
        if (data.programToken) {
            return data;
        }

        data.programToken = this.programToken; // eslint-disable-line no-param-reassign
        return data;
    }

    /**
     * Handle 204 response for list calls
     *
     * @param {api-callback} callback - The api callback
     * @returns {api-callback} - A wrapper api callback
     *
     * @private
     */
    static handle204Response(callback) {
        return (err, data, res) => {
            if (!err && res.status === 204) {
                callback(err, {
                    hasNextPage: false,
                    hasPreviousPage: false,
                    limit: 0,
                    data: [],
                }, res);
                return;
            }
            callback(err, data, res);
        };
    }

    //--------------------------------------
    // Venmo Accounts
    //--------------------------------------

    /**
     * Create a Venmo account
     *
     * @param {string} userToken - The user token
     * @param {Object} data - The Venmo account data
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    createVenmoAccount(userToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!data.transferMethodCountry) {
            throw new Error("transferMethodCountry is required");
        }
        if (!data.transferMethodCurrency) {
            throw new Error("transferMethodCurrency is required");
        }
        if (!data.accountId) {
            throw new Error("Account is required");
        }
        this.client.doPost(`users/${encodeURIComponent(userToken)}/venmo-accounts`, data, {}, callback);
    }

    /**
     * Get a Venmo account
     *
     * @param {string} userToken - The user token
     * @param {string} venmoAccountToken - The venmo account token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or venmoAccountToken is not provided
     */
    getVenmoAccount(userToken, venmoAccountToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!venmoAccountToken) {
            throw new Error("venmoAccountToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/venmo-accounts/${encodeURIComponent(venmoAccountToken)}`, {}, callback);
    }

    /**
     * List all Venmo accounts
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    listVenmoAccounts(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const LIST_VENMO_ACCOUNTS_FILTERS = ["type", "status", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_VENMO_ACCOUNTS_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_VENMO_ACCOUNTS_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/venmo-accounts`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Update a venmo account
     *
     * @param {string} userToken - The user token
     * @param {string} venmoAccountToken - The bank account token
     * @param {Object} data - The venmo account data to update
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or venmoAccountToken is not provided
     */
    updateVenmoAccount(userToken, venmoAccountToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!venmoAccountToken) {
            throw new Error("venmoAccountToken is required");
        }
        this.client.doPut(`users/${encodeURIComponent(userToken)}/venmo-accounts/${encodeURIComponent(venmoAccountToken)}`, data, {}, callback);
    }

    /**
     * Deactivate a venmo account
     *
     * @param {string} userToken -  user token
     * @param {string} venmoAccountToken - Venmo account token
     * @param {api-callback} callback - callback for this call
     *
     * @throws Will throw an error if userToken or venmoAccountToken is not provided
     */

    deactivateVenmoAccount(userToken, venmoAccountToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!venmoAccountToken) {
            throw new Error("venmoAccountToken is required");
        }

        const transition = {
            transition: "DE_ACTIVATED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/venmo-accounts/${encodeURIComponent(venmoAccountToken)}/status-transitions`, transition, {}, callback);
    }

    /**
     * Create Venmo account status transition
     *
     * @param {string} userToken - The user token
     * @param {string} venmoAccountToken - venmo account token
     * @param {Object} data - Venmo account status transition data
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken or venmoAccountToken is not provided
     */
    createVenmoAccountStatusTransition(userToken, venmoAccountToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!venmoAccountToken) {
            throw new Error("venmoAccountToken is required");
        }

        this.client.doPost(`users/${encodeURIComponent(userToken)}/venmo-accounts/${encodeURIComponent(venmoAccountToken)}/status-transitions`, data, {}, callback);
    }

    /**
     * Get Venmo account status transition
     *
     * @param {string} userToken -user token
     * @param {string} venmoAccountToken - The venmo account token
     * @param {string} statusTransitionToken - The venmo account status transition token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or venmoAccountToken is not provided
     */
    getVenmoAccountStatusTransition(userToken, venmoAccountToken, statusTransitionToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!venmoAccountToken) {
            throw new Error("venmoAccountToken is required");
        }
        if (!statusTransitionToken) {
            throw new Error("statusTransitionToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/venmo-accounts/${encodeURIComponent(venmoAccountToken)}/status-transitions/${encodeURIComponent(statusTransitionToken)}`,
            {},
            callback);
    }

    /**
     * List all venmo account status transitions
     *
     * @param {string} userToken - user token
     * @param {string} venmoAccountToken - venmo account token
     * @param {Object} options - query parameters to send
     * @param {api-callback} callback - callback for this call
     *
     * @throws Will throw an error if userToken or venmoAccountToken is not provided
     */
    listVenmoAccountStatusTransitions(userToken, venmoAccountToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!venmoAccountToken) {
            throw new Error("venmoAccountToken is required");
        }
        const LIST_VENMO_ACCOUNT_STATUS_TRANSITION_FILTERS = ["transition", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_VENMO_ACCOUNT_STATUS_TRANSITION_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_VENMO_ACCOUNT_STATUS_TRANSITION_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/venmo-accounts/${encodeURIComponent(venmoAccountToken)}/status-transitions`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Validate the options filter
     *
     * @param {Object} options - The query parameters in the URI
     * @param {Object} listFilters - Defined list of filters for a business object
     */

    static isValidFilter(options, listFilters) {
        return Object.keys(options).every(elem => listFilters.includes(elem));
    }

    //--------------------------------------
    // Business StakeHolder
    //--------------------------------------

    /**
     * Create a Business Stakeholder
     *
     * @param {string} userToken - The Stakeholder token
     * @param {Object} data - The Stakeholder data
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    createBusinessStakeholder(userToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doPost(`users/${encodeURIComponent(userToken)}/business-stakeholders`, data, {}, callback);
    }

    /**
     * Update a Business Stakeholder
     *
     * @param {string} userToken - The user token
     * @param {string} stakeholderToken - The user token
     * @param {Object} data - The Stakeholder data that should be updated
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    updateBusinessStakeholder(userToken, stakeholderToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!stakeholderToken) {
            throw new Error("stakeholderToken is required");
        }
        this.client.doPut(`users/${encodeURIComponent(userToken)}/business-stakeholders/${encodeURIComponent(stakeholderToken)}`, data, {}, callback);
    }

    /**
     * List all Business Stakeholder
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    listBusinessStakeholders(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const LIST_BUSINESS_STAKEHOLDERS_FILTERS = ["status", "createdBefore", "createdAfter", "sortBy", "limit"];
        // TODO: Is this included in api, if so follow rules of user listing?
        if (options && !Hyperwallet.isValidFilter(options, LIST_BUSINESS_STAKEHOLDERS_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_BUSINESS_STAKEHOLDERS_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/business-stakeholders`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Activate a Business Stakeholder transition
     *
     * @param {string} userToken -  user token
     * @param {string} stakeholderToken -  stakeholder token
     * @param {api-callback} callback -  callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    activateBusinessStakeholder(userToken, stakeholderToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!stakeholderToken) {
            throw new Error("stakeholderToken is required");
        }
        const data = {
            transition: "ACTIVATED",
        };
        this.createBusinessStakeholderStatusTransition(userToken, stakeholderToken, data, callback);
    }

    /**
     * Deactivate a Business Stakeholder transition
     *
     * @param {string} userToken -  user token
     * @param {string} stakeholderToken -  stakeholder token
     * @param {api-callback} callback -  callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    deactivateBusinessStakeholder(userToken, stakeholderToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!stakeholderToken) {
            throw new Error("stakeholderToken is required");
        }
        const data = {
            transition: "DE_ACTIVATED",
        };
        this.createBusinessStakeholderStatusTransition(userToken, stakeholderToken, data, callback);
    }

    /**
     * Create a Business Stakeholder transition
     *
     * @param {string} userToken - user token
     * @param {string} stakeholderToken -  stakeholder token
     * @param {Object} data - Stakeholder transition data
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    createBusinessStakeholderStatusTransition(userToken, stakeholderToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!stakeholderToken) {
            throw new Error("stakeholderToken is required");
        }
        this.client.doPost(`users/${encodeURIComponent(userToken)}/business-stakeholders/${encodeURIComponent(stakeholderToken)}/status-transitions`, data, {}, callback);
    }

    /**
     * Get Business Stakeholder status transition
     *
     * @param {string} userToken -user token
     * @param {string} stakeholderToken - The Business Stakeholder token
     * @param {string} statusTransitionToken - The Business Stakeholder status transition token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken or stakeholderToken is not provided
     */
    getBusinessStakeholderStatusTransition(userToken, stakeholderToken, statusTransitionToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!stakeholderToken) {
            throw new Error("stakeholderToken is required");
        }
        if (!statusTransitionToken) {
            throw new Error("statusTransitionToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/business-stakeholders/${encodeURIComponent(stakeholderToken)}/status-transitions/${encodeURIComponent(statusTransitionToken)}`,
            {},
            callback);
    }

    /**
     * List all Business Stakeholder status transitions
     *
     * @param {string} userToken - user token
     * @param {string} stakeholderToken - Business Stakeholder token
     * @param {Object} options - query parameters to send
     * @param {api-callback} callback - callback for this call
     *
     * @throws Will throw an error if userToken or stakeholderToken is not provided
     */
    listBusinessStakeholderStatusTransitions(userToken, stakeholderToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!stakeholderToken) {
            throw new Error("stakeholderToken is required");
        }
        const LIST_BUSINESS_STAKEHOLDER_STATUS_TRANSITION_FILTERS = ["transition", "createdBefore", "createdAfter", "sortBy", "offset", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_BUSINESS_STAKEHOLDER_STATUS_TRANSITION_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_BUSINESS_STAKEHOLDER_STATUS_TRANSITION_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/business-stakeholders/${encodeURIComponent(stakeholderToken)}/status-transitions`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Upload Documents to Business Stakeholder
     *
     * @param {string} userToken - The user token
     * @param {string} stakeholderToken -  stakeholder token
     * @param {Object} data - JSON object of the data and files to be uploaded
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    uploadBusinessStakeholderDocuments(userToken, stakeholderToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!stakeholderToken) {
            throw new Error("stakeholderToken is required");
        }
        if (!data || Object.keys(data).length < 1) {
            throw new Error("Files for upload are required");
        }
        this.client.doPutMultipart(`users/${encodeURIComponent(userToken)}/business-stakeholders/${encodeURIComponent(stakeholderToken)}`, data, callback);
    }

    /**
     * List of Transfer Methods
     *
     * @param {string} userToken - The user token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     * @throws Will throw an error if userToken is not provided
     */
    listTransferMethods(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        const LIST_TRANSFER_METHODS_FILTERS = ["status", "type", "createdBefore", "createdAfter", "sortBy", "limit"];
        if (options && !Hyperwallet.isValidFilter(options, LIST_TRANSFER_METHODS_FILTERS)) {
            throw new Error("Invalid Filter. Expected - ".concat(LIST_TRANSFER_METHODS_FILTERS));
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/transfer-methods`, options, Hyperwallet.handle204Response(callback));
    }

    /**
     * Get a transfer status transition
     *
     * @param {string} transferToken - The transfer token
     * @param {string} statusTransitionToken - The status transition token token
     * @param {api-callback} callback - The callback for this call
     *
     * @throws Will throw an error if transferToken is not provided
     * @throws Will throw an error if statusTransitionToken is not provided
     */
    getTransferStatusTransition(transferToken, statusTransitionToken, callback) {
        if (!transferToken) {
            throw new Error("transferToken is required");
        }
        if (!statusTransitionToken) {
            throw new Error("statusTransitionToken is required");
        }
        this.client.doGet(`transfers/${encodeURIComponent(transferToken)}/status-transitions/${encodeURIComponent(statusTransitionToken)}`, {}, callback);
    }

    /**
     * List all transfer status transitions
     *
     * @param {string} transferToken - The transfer token
     * @param {Object} options - The query parameters to send
     * @param {api-callback} callback - The callback for this call
     */
    listTransferStatusTransition(transferToken, options, callback) {
        if (!transferToken) {
            throw new Error("transferToken is required");
        }
        this.client.doGet(`transfers/${encodeURIComponent(transferToken)}/status-transitions`, options, Hyperwallet.handle204Response(callback));
    }
}
