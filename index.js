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
	// Transfer Methods
	////////////////////////////////////////////////////////////////////////////////

	hyperwallet.createUserTransferMethod = function(userToken, data, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		util.post('/users/' + encodeURIComponent(userToken) + '/transfer-methods', data, callback);
	};

	hyperwallet.getUserTransferMethod = function(userToken, transferMethodToken, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		if (!transferMethodToken) {
			util.error({ message: 'Transfer Method token is required' }, callback);
			return;
		}
		util.get('/users/' + encodeURIComponent(userToken) + '/transfer-methods/' + encodeURIComponent(transferMethodToken), null, callback);
	};

	hyperwallet.updateUserTransferMethod = function(userToken, transferMethodToken, data, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		if (!transferMethodToken) {
			util.error({ message: 'Transfer Method token is required' }, callback);
			return;
		}
		util.put('/users/' + encodeURIComponent(userToken) + '/transfer-methods/' + encodeURIComponent(transferMethodToken), data, callback);
	};

	hyperwallet.listUserTransferMethods = function(userToken, options, callback) {
		if (!userToken) {
			util.error({ message: 'User token is required' }, callback);
			return;
		}
		util.get('/users/' + encodeURIComponent(userToken) + '/transfer-methods', options, callback);
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
