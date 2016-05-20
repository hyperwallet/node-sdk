import Hyperwallet from "../src/Hyperwallet";

console.log("------------------------------------------------------------------------------------------------");
console.log("- This example is showing you how to create a user, create a transfer method and pay that user -");
console.log("------------------------------------------------------------------------------------------------");
console.log();

// Read config from env variables
const server = process.env.HYPERWALLET_SERVER || "https://sandbox.hyperwallet.com";
const username = process.env.HYPERWALLET_USERNAME;
const password = process.env.HYPERWALLET_PASSWORD;
const programToken = process.env.HYPERWALLET_PROGRAM_TOKEN;
if (!username || !password || !programToken) {
    console.error("Error: Please make sure that you have set the system environment variables HYPERWALLET_USERNAME, HYPERWALLET_PASSWORD and HYPERWALLET_PROGRAM_TOKEN!");
    process.exit(-1);
}

// Add logging for response
function logResponse(callback) {
    return (error, body, res) => {
        if (error) {
            console.log(`ERROR: ${JSON.stringify(error, null, 4)}`);
        } else {
            console.log(`RESPONSE: ${JSON.stringify(body, null, 4)}`);
        }
        callback(error, body, res);
    };
}


/**
 * Create a instance of the Hyperwallet REST SDK
 */
const hyperwallet = new Hyperwallet({
    username,
    password,
    server,
});


/**
 * 1.) Create a user within the Hyperwallet platform
 */
function createUser() {
    console.log("1.) Create User");

    const rand = Math.floor(Math.random() * (1000000000 - 1)) + 1;
    hyperwallet.createUser({
        clientUserId: rand,
        profileType: "INDIVIDUAL",
        firstName: "Daffyd",
        lastName: "y Goliath",
        email: `testmail-${rand}@hyperwallet.com`,
        addressLine1: "123 Main Street",
        city: "Austin",
        stateProvince: "TX",
        country: "US",
        postalCode: "78701",
        programToken,
    }, logResponse((error, body) => {
        if (!error) {
            createBankAccount(body.token);
        }
    }));
}


/**
 * 2.) Create a bank account within the Hyperwallet platform
 */
function createBankAccount(userToken) {
    console.log();
    console.log(`2.) Create Bank Account for user ${userToken}`);

    const rand = Math.floor(Math.random() * (1000000000 - 1)) + 1;
    hyperwallet.createBankAccount(userToken, {
        transferMethodCountry: "US",
        transferMethodCurrency: "USD",
        type: "BANK_ACCOUNT",
        branchId: "121122676",
        bankAccountPurpose: "CHECKING",
        bankAccountId: rand,
    }, logResponse((error, body) => {
        if (!error) {
            createPayment(userToken, body.token);
        }
    }));
}


/**
 * 3.) Create a payment within the Hyperwallet platform
 */
function createPayment(userToken, bankAccountToken) {
    console.log();
    console.log(`3.) Create Payment for user ${userToken} and bank account ${bankAccountToken}`);

    const rand = Math.floor(Math.random() * (1000000000 - 1)) + 1;
    hyperwallet.createPayment({
        destinationToken: userToken,
        programToken,
        clientPaymentId: `nsdk-${rand}`,
        currency: "USD",
        amount: "50.15",
        purpose: "OTHER",
    }, logResponse(() => console.log()));
}


// Execute example
createUser();
