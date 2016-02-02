rest-v3-node-sdk
================

```js
var hyperwallet = require('hyperwallet-node').init({ username: 'username', password: 'password' });
```

For the following examples, you can catch the results with a function like this one:

```js
var handleResponse = function(error, body) {
	if (error) {
		console.log('ERROR: ' + JSON.stringify(error, null, 4}, handleResponse);
		return;
	}
	console.log('RESPONSE: ' + JSON.stringify(body, null, 4}, handleResponse);
};
```

For general usage, require hyperwallet and initialize it with a username and password, then call its top-level methods
directly.  You can optionally pass in a program code as a third parameter to init and it will be used as a default if one is
not provided in direct calls.

Create a user:

```js
hyperwallet.createUser({ 
		'clientUserId': Math.floor(Math.random() * (1000000000 - 1)) + 1,
		'profileType': 'INDIVIDUAL',
		'firstName': 'Daffyd',
		'lastName': 'y Goliath',
		'email': 'testmail-' + rand + '@hyperwallet.com',
		'addressLine1': '123 Main Street',
		'city': 'Austin',
		'stateProvince': 'TX',
		'country': 'US',
		'postalCode': '78701',
		'programToken': 'prg-7d1d6eb2-c48f-442a-8bf4-b50431225ece'
	}, handleResponse);
```

Retrieve a single user:

```js
        hyperwallet.getUser('usr-de305d54-75b4-432b-aac2-eb6b9e546014', handleResponse);
```

Update a user:

```js
        var updatedUser = hyperwallet.updateUser('usr-de305d54-75b4-432b-aac2-eb6b9e546014', {
                'clientUserId'  : Math.floor(Math.random() * (1000000000 - 1)) + 1,
                'profileType'   : 'INDIVIDUAL',
                'firstName'     : 'Jerry',
                'lastName'      : 'Peterson',
                'email'         : 'jerry@fakeemail.com',
                'addressLine1'  : '123 Anyplace St',
                'city'          : 'Austin',
                'stateProvince' : 'TX',
                'postalCode'    : '78701',
                'country'       : 'US'
	}, handleResponse);
```

List users:

```js
        var list = Hyperwallet.listUsers(null, handleResponse);

        var list = hyperwallet.listUsers({
                'offset' : 50,
                'limit'  : 25
        }, handleResponse);
```

Create a transfer method:

```js
        var method = hyperwallet.createUserTransferMethod('usr-de305d54-75b4-432b-aac2-eb6b9e546014', {
                'type'                   : 'BANK_ACCOUNT',
                'transferMethodCountry'  : 'CA',
                'transferMethodCurrency' : 'CAD',
                'bankId'                 : '001',
                'branchId'               : '00011',
                'bankAccountId'          : '304414255570'
        }, handleResponse);
```

Retrieve a single transfer method:

```js
        var method = hyperwallet.getUserTransferMethod('usr-de305d54-75b4-432b-aac2-eb6b9e546014', 'trm-ac5727ac-8fe7-42fb-b69d-977ebdd7b48b', handleResponse);
```

Update a transfer method:

```js
        var method = hyperwallet.updateUserTransferMethod('usr-de305d54-75b4-432b-aac2-eb6b9e546014', 'trm-ac5727ac-8fe7-42fb-b69d-977ebdd7b48b', {
                'bankId'        : '021',
                'branchId'      : '00011',
                'bankAccountId' : '123456789012'
        }, handleResponse);
```

List transfer methods:

```js
	var list = hyperwallet.listUserTransferMethods('usr-de305d54-75b4-432b-aac2-eb6b9e546014', null, handleResponse);

        var list = hyperwallet.listUserTransferMethods('usr-de305d54-75b4-432b-aac2-eb6b9e546014', {
                'offset' : 50,
                'limit'  : 25
        }, handleResponse);
```

Create payment:

```js
        var payment = hyperwallet.createPayment({
                'amount'      : '121.12',
                'currency'    : 'USD',
                'description' : 'Earnings for 2015 Q1',
                'memo'        : 'PmtBatch-20150501',
                'purpose'     : 'PP0013'
        }, handleResponse);
```

Retrieve a payment:

```js
        var payment = hyperwallet.getPayment('pmt-aa308d58-75b4-432b-dec1-eb6b9e341111', handleResponse);
```

List payments:

```js
        var list = hyperwallet.listPayments(null, handleResponse);

        var list = hyperwallet.listPayments({
                'offset' : 50,
                'limit'  : 25
        }, handleResponse);
```

Retrieve transfer method configurations:

```js
        var list = hyperwallet.getTransferMethodConfigurations('usr-de305d54-75b4-432b-aac2-eb6b9e546014', {
                'country'     : 'US'
                'currency'    : 'USD',
                'type'        : 'BANK_ACCOUNT',
                'profileType' : 'INDIVIDUAL'
        }, handleResponse);
```

List transfer method configurations:

```js
        var list = hyperwallet.listTransferMethodConfigurations('usr-de305d54-75b4-432b-aac2-eb6b9e546014', {
                'offset' : 50,
                'limit'  : 25
        }, handleResponse);
```

