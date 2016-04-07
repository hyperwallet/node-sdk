module.exports.init = function(options) {

	// Public methods are at the bottom

	var hyperwallet = {};

	options.version = require('./package.json').version;;

	var util = require('./lib/util').init(options);

	////////////////////////////////////////////////////////////////////////////////
	// User Handling
	////////////////////////////////////////////////////////////////////////////////

	hyperwallet.createUser = function(data, callback) {
		util.addProgramToken(data);
		util.post('/users', data, callback);
	};

	hyperwallet.getUser = function(userToken, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		util.get('/users/' + encodeURIComponent(userToken), null, callback);
	};

	hyperwallet.updateUser = function(userToken, data, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		util.addProgramToken(data);
		util.put('/users/' + encodeURIComponent(userToken), data, callback);
	};

	hyperwallet.listUsers = function(options, callback) {
		util.get('/users', options, callback);
	};

	////////////////////////////////////////////////////////////////////////////////
	// Prepaid Cards
	////////////////////////////////////////////////////////////////////////////////

	hyperwallet.createUserPrepaidCard = function(userToken, data, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		util.post('/users/' + encodeURIComponent(userToken) + '/transfer-methods', data, callback);
	};

	hyperwallet.getUserPrepaidCard = function(userToken, prepaidCardToken, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		if (!prepaidCardToken) {
			util.error({ message: 'Prepaid Card token is required' }, callback);
			return;
		}
		util.get('/users/' + encodeURIComponent(userToken) + '/prepaid-cards/' + encodeURIComponent(prepaidCardToken), null, callback);
	};

	hyperwallet.updateUserPrepaidCard = function(userToken, prepaidCardToken, data, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		if (!prepaidCardToken) {
			util.error({ message: 'Prepaid Card token is required' }, callback);
			return;
		}
		util.put('/users/' + encodeURIComponent(userToken) + '/prepaid-cards/' + encodeURIComponent(prepaidCardToken), data, callback);
	};

	hyperwallet.listUserPrepaidCards = function(userToken, options, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		util.get('/users/' + encodeURIComponent(userToken) + '/prepaid-cards', options, callback);
	};

	////////////////////////////////////////////////////////////////////////////////
	// Bank Accounts
	////////////////////////////////////////////////////////////////////////////////

	hyperwallet.createUserBankAccount = function(userToken, data, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		util.post('/users/' + encodeURIComponent(userToken) + '/bank-accounts', data, callback);
	};

	hyperwallet.getUserBankAccount = function(userToken, bankAccountToken, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		if (!bankAccountToken) {
			util.error({ message: 'Bank Account token is required' }, callback);
			return;
		}
		util.get('/users/' + encodeURIComponent(userToken) + '/bank-accounts/' + encodeURIComponent(bankAccountToken), null, callback);
	};

	hyperwallet.updateUserBankAccount = function(userToken, bankAccountToken, data, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		if (!bankAccountToken) {
			util.error({ message: 'Bank Account token is required' }, callback);
			return;
		}
		util.put('/users/' + encodeURIComponent(userToken) + '/bank-accounts/' + encodeURIComponent(bankAccountToken), data, callback);
	};

	hyperwallet.deactivateUserBankAccount = function(userToken, bankAccountToken, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		if (!bankAccountToken) {
			util.error({ message: 'Bank Account token is required' }, callback);
			return;
		}
		var transition = {
			"transition": "DE-ACTIVATED"
		};
		util.post('/users/' + encodeURIComponent(userToken) + '/bank-accounts/' + encodeURIComponent(bankAccountToken) + '/status-transitions', transition, callback);
	};

	hyperwallet.listUserBankAccounts = function(userToken, options, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		util.get('/users/' + encodeURIComponent(userToken) + '/bank-accounts', options, callback);
	};

	////////////////////////////////////////////////////////////////////////////////
	// Status Transitions
	////////////////////////////////////////////////////////////////////////////////

	hyperwallet.createPrepaidCardStatusTransition = function(userToken, cardToken, data, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		if (!cardToken) {
			util.error({ message: 'Card token is required' }, callback);
			return;
		}
		util.post('/users/' + encodeURIComponent(userToken) + '/prepaid-cards/' + encodeURIComponent(cardToken) + '/status-transitions', data, callback);
	};

	hyperwallet.getPrepaidCardStatusTransition = function(userToken, prepaidCardToken, statusTransitionToken, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		if (!prepaidCardToken) {
			util.error({ message: 'Prepaid Card token is required' }, callback);
			return;
		}
		if (!statusTransitionToken) {
			util.error({ message: 'Status Transition token is required' }, callback);
			return;
		}
		util.get('/users/' + encodeURIComponent(userToken) + '/prepaid-cards/' + encodeURIComponent(prepaidCardToken) + '/status-transitions/' + encodeURIComponent(statusTransitionToken), null, callback);
	};

	hyperwallet.listPrepaidCardStatusTransitions = function(userToken, prepaidCardToken, options, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		if (!prepaidCardToken) {
			util.error({ message: 'Prepaid Card token is required' }, callback);
			return;
		}
		util.get('/users/' + encodeURIComponent(userToken) + '/prepaid-cards/' + encodeURIComponent(prepaidCardToken) + '/status-transitions' , options, callback);
	};

	hyperwallet.createBankAccountStatusTransition = function(userToken, cardToken, data, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		if (!cardToken) {
			util.error({ message: 'Bank Account token is required' }, callback);
			return;
		}
		util.post('/users/' + encodeURIComponent(userToken) + '/bank-accounts/' + encodeURIComponent(cardToken) + '/status-transitions', data, callback);
	};

	hyperwallet.getBankAccountStatusTransition = function(userToken, bankAccountToken, statusTransitionToken, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		if (!bankAccountToken) {
			util.error({ message: 'Bank Account token is required' }, callback);
			return;
		}
		if (!statusTransitionToken) {
			util.error({ message: 'Status Transition token is required' }, callback);
			return;
		}
		util.get('/users/' + encodeURIComponent(userToken) + '/bank-accounts/' + encodeURIComponent(bankAccountToken) + '/status-transitions/' + encodeURIComponent(statusTransitionToken), null, callback);
	};


	////////////////////////////////////////////////////////////////////////////////
	// Payment Methods
	////////////////////////////////////////////////////////////////////////////////

	hyperwallet.createPayment = function(data, callback) {
		util.addProgramToken(data);
		util.post('/payments', data, callback);
	};

	hyperwallet.getPayment = function(paymentToken, callback) {
		if (!paymentToken) {
			util.error({ message: 'Payment token is required' }, callback);
			return;
		}
		util.get('/payments/' + encodeURIComponent(paymentToken), null, callback);
	};

	hyperwallet.listPayments = function(options, callback) {
		util.get('/payments', options, callback);
	};

	////////////////////////////////////////////////////////////////////////////////
	// Transfer Method Configurations
	////////////////////////////////////////////////////////////////////////////////

	hyperwallet.getTransferMethodConfigurations = function(userToken, data, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		data.userToken = userToken;
		util.get('/transfer-method-configurations', data, callback);
	};

	hyperwallet.listTransferMethodConfigurations = function(userToken, callback) {
		util.get('/transfer-method-configurations', {'userToken':userToken}, callback);
	};

	////////////////////////////////////////////////////////////////////////////////
	// Response
	////////////////////////////////////////////////////////////////////////////////

	return hyperwallet;
}
