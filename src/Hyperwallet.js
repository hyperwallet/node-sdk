import ApiClient from "./ApiClient";

/**
 * The Hyperwallet SDK Client
 */
class Hyperwallet {

    /**
     * Create a instance of the SDK Client
     *
     * @param {Object} config - The API config
     * @param {string} config.username - The API username
     * @param {string} config.password - The API password
     * @param {string} [config.programToken] - The program token that is used for some API calls
     * @param {string} [config.server=https://beta.paylution.com] - The API server to connect to
     */
    constructor({ username, password, programToken, server = "https://beta.paylution.com" }) {
        if (!username || !password) {
            throw new Error("You need to specify your API username and password!");
        }

        /**
         * The instance of the ApiClient
         *
         * @type {ApiClient}
         */
        this.client = new ApiClient(username, password, server);

        /**
         * The program token that is used for some API calls
         *
         * @type {string}
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
     * @param {function} callback - The callback for this call
     */
    createUser(data, callback) {
        this.addProgramToken(data);
        this.client.doPost("users", data, {}, callback);
    }

    /**
     * Load a user based on userToken
     *
     * @param {string} userToken - The user token
     * @param {function} callback - The callback for this call
     *
     * @throws Will throw an error if userToken is not provided
     */
    getUser(userToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}`, {}, callback);
    }

    updateUser(userToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.addProgramToken(data);
        this.client.doPut(`users/${encodeURIComponent(userToken)}`, data, {}, callback);
    }

    listUsers(options, callback) {
        this.client.doGet("users", options, callback);
    }

    //--------------------------------------
    // Prepaid Cards
    //--------------------------------------
    createPrepaidCard(userToken, data, callback) {
        if (!userToken) {
            throw new Error("User token is required");
        }
        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards`, data, {}, callback);
    }

    getPrepaidCard(userToken, prepaidCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}`, {}, callback);
    }

    updatePrepaidCard(userToken, prepaidCardToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }
        this.client.doPut(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}`, data, {}, callback);
    }

    listPrepaidCards(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/prepaid-cards`, options, callback);
    }

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
    
    createPrepaidCardStatusTransition(userToken, prepaidCardToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }

        this.client.doPost(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, data, {}, callback);
    }

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

    listPrepaidCardStatusTransitions(userToken, prepaidCardToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!prepaidCardToken) {
            throw new Error("prepaidCardToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/prepaid-cards/${encodeURIComponent(prepaidCardToken)}/status-transitions`, {}, callback);
    }

    //--------------------------------------
    // Bank Accounts
    //--------------------------------------
    createBankAccount(userToken, data, callback) {
        if (!userToken) {
            throw new Error("User token is required");
        }
        this.client.doPost(`users/${encodeURIComponent(userToken)}/bank-accounts`, data, {}, callback);
    }

    getBankAccount(userToken, bankAccountToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankAccountToken) {
            throw new Error("bankAccountToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/bank-accounts/${encodeURIComponent(bankAccountToken)}`, {}, callback);
    }

    updateBankAccount(userToken, bankAccountToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankAccountToken) {
            throw new Error("bankAccountToken is required");
        }
        this.client.doPut(`users/${encodeURIComponent(userToken)}/bank-accounts/${encodeURIComponent(bankAccountToken)}`, data, {}, callback);
    }

    listBankAccounts(userToken, options, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/bank-accounts`, options, callback);
    }

    deactivateBankAccount(userToken, bankAccountToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankAccountToken) {
            throw new Error("bankAccountToken is required");
        }

        const transition = {
            transition: "DE-ACTIVATED",
        };
        this.client.doPost(`users/${encodeURIComponent(userToken)}/bank-accounts/${encodeURIComponent(bankAccountToken)}/status-transitions`, transition, {}, callback);
    }

    createBankAccountStatusTransition(userToken, bankAccountToken, data, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankAccountToken) {
            throw new Error("bankAccountToken is required");
        }

        this.client.doPost(`users/${encodeURIComponent(userToken)}/bank-accounts/${encodeURIComponent(bankAccountToken)}/status-transitions`, data, {}, callback);
    }

    listBankAccountStatusTransitions(userToken, bankAccountToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        if (!bankAccountToken) {
            throw new Error("bankAccountToken is required");
        }
        this.client.doGet(`users/${encodeURIComponent(userToken)}/bank-accounts/${encodeURIComponent(bankAccountToken)}/status-transitions`, {}, callback);
    }

    //--------------------------------------
    // Payments
    //--------------------------------------
    createPayment(data, callback) {
        this.addProgramToken(data);
        this.client.doPost("payments", data, {}, callback);
    }

    getPayment(paymentToken, callback) {
        if (!paymentToken) {
            throw new Error("paymentToken is required");
        }
        this.client.doGet(`payments/${encodeURIComponent(paymentToken)}`, {}, callback);
    }

    listPayments(options, callback) {
        this.client.doGet("payments", options, callback);
    }

    //--------------------------------------
    // Transfer Method Configurations
    //--------------------------------------
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

    listTransferMethodConfigurations(userToken, callback) {
        if (!userToken) {
            throw new Error("userToken is required");
        }
        this.client.doGet("transfer-method-configurations", { userToken }, callback);
    }

    //--------------------------------------
    // Internal Utils
    //--------------------------------------
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

}

export default Hyperwallet;
