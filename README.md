[![Build Status](https://travis-ci.org/hyperwallet/node-sdk.png?branch=master)](https://travis-ci.org/hyperwallet/node-sdk)
[![Coverage Status](https://coveralls.io/repos/github/hyperwallet/node-sdk/badge.svg?branch=master)](https://coveralls.io/github/hyperwallet/node-sdk?branch=master)
[![Document](http://hyperwallet.github.io/node-sdk/badge.svg?t=0)](http://hyperwallet.github.io/node-sdk)
[![NPM version](https://badge.fury.io/js/hyperwallet-sdk.png)](http://badge.fury.io/js/hyperwallet-sdk)
[![Dependency Status](https://david-dm.org/hyperwallet/node-sdk.png)](https://david-dm.org/hyperwallet/node-sdk)

Hyperwallet REST SDK (Beta)
===========================

A library to manage users, transfer methods and payments through the Hyperwallet API


Installation
------------

```bash
$ npm install hyperwallet-sdk
```


Documentation
-------------

Documentation is available at http://hyperwallet.github.io/node-sdk.


API Overview
------------

To write an app using the SDK

* Register for a sandbox account and get your username, password and program token at the [Hyperwallet Program Portal](https://portal.hyperwallet.com).
* Add dependency `hyperwallet-sdk` to your `package.json`.
* Require `hyperwallet-sdk` in your file
  ```js
  var Hyperwallet = require("hyperwallet-sdk");
  ```
  
* Create a instance of the Hyperwallet Client (with username, password and program token)
  ```js
  var client = new Hyperwallet({
    username: "restapiuser@4917301618",
    password: "mySecurePassword!",
    programToken: "prg-645fc30d-83ed-476c-a412-32c82738a20e",
  });
  ```
* Start making API calls (e.g. create a user)
  ```js
  var userData = {
     clientUserId: "test-client-id-1",
     profileType: "INDIVIDUAL",
     firstName: "Daffyd",
     lastName: "y Goliath",
     email: "testmail-1@hyperwallet.com",
     addressLine1: "123 Main Street",
     city: "Austin",
     stateProvince: "TX",
     country: "US",
     postalCode: "78701",
  };

  client.createUser(userDate, function(errors, body, res) {
     if (errors) {
        console.log("Create User Failed");
        console.log(errors);
     } else {
        console.log("Create User Response");
        console.log(body);
     }
  });
  ```
  The displayed callback format is valid for all SDK methods. For more information see the [Callback Documentation](http://hyperwallet.github.io/node-sdk/typedef/index.html#static-typedef-api-callback).


Development
-----------

Run the tests using [`npm`](https://www.npmjs.com/):

```bash
$ npm install
$ npm test
```


Reference
---------

[REST API Reference](https://sandbox.hyperwallet.com/developer-portal/#/docs)


License
-------

[MIT](https://raw.githubusercontent.com/hyperwallet/node-sdk/master/LICENSE)
