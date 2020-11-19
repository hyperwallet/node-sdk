import chai, { expect } from "chai";
import dirtyChai from "dirty-chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

import Hyperwallet from "../src/Hyperwallet";

chai.should();
chai.use(dirtyChai);
chai.use(sinonChai);

/** @test {Hyperwallet} */
describe("Hyperwallet", () => {
    /** @test {Hyperwallet#constructor} */
    describe("constructor()", () => {
        /** @test {Hyperwallet#constructor} */
        it("should initialize ApiClient with default server", () => {
            const client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });

            client.client.username.should.be.equal("test-username");
            client.client.password.should.be.equal("test-password");
            client.client.server.should.be.equal("https://api.sandbox.hyperwallet.com");
        });

        /** @test {Hyperwallet#constructor} */
        it("should set programToken to undefined if not provided", () => {
            const client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });

            expect(client.programToken).to.be.undefined();
        });

        /** @test {Hyperwallet#constructor} */
        it("should set programToken if provided", () => {
            const client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
                programToken: "test-program-token",
            });

            client.programToken.should.be.equal("test-program-token");
        });

        /** @test {Hyperwallet#constructor} */
        it("should initialize ApiClient with provided server", () => {
            const client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
                server: "test-server",
            });

            client.client.server.should.be.equal("test-server");
        });

        /** @test {Hyperwallet#constructor} */
        it("should throw error if username is missing", () => {
            expect(() => new Hyperwallet({
                password: "test-password",
            })).to.throw("You need to specify your API username and password!");
        });

        /** @test {Hyperwallet#constructor} */
        it("should throw error if password is missing", () => {
            expect(() => new Hyperwallet({
                username: "test-username",
            })).to.throw("You need to specify your API username and password!");
        });

        /** @test {Hyperwallet#constructor} */
        it("should throw error if username and password is missing", () => {
            expect(() => new Hyperwallet({
            })).to.throw("You need to specify your API username and password!");
        });
    });

    //--------------------------------------
    // TLS verification
    //--------------------------------------

    describe("listUsers()", () => {
        it("should not have any TLS issues", (cb) => {
            const client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.listUsers({}, (err, body, res) => {
                res.status.should.be.equal(401);
                cb();
            });
        });
    });

    //--------------------------------------
    // Users
    //--------------------------------------

    /** @test {Hyperwallet#createUser} */
    describe("createUser()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createUser} */
        it("should do post call to users endpoint without programToken added", () => {
            const callback = () => null;
            client.createUser({
                test: "value",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users", {
                test: "value",
            }, {}, callback);
        });

        /** @test {Hyperwallet#createUser} */
        it("should do post call to users endpoint with programToken added", () => {
            client.programToken = "test-program-token";

            const callback = () => null;
            client.createUser({
                test: "value",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users", {
                test: "value",
                programToken: "test-program-token",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#getUser} */
    describe("getUser()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getUser} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.getUser(undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#getUser} */
        it("should do get call if userToken is provided", () => {
            const callback = () => null;
            client.getUser("test-user-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#updateUser} */
    describe("updateUser()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPut: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#updateUser} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.updateUser(undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#updateUser} */
        it("should do put call to users endpoint without programToken added", () => {
            const callback = () => null;
            client.updateUser("test-user-token", {
                test: "value",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token", {
                test: "value",
            }, {}, callback);
        });

        /** @test {Hyperwallet#updateUser} */
        it("should do put call to users endpoint with programToken added", () => {
            client.programToken = "test-program-token";

            const callback = () => null;
            client.updateUser("test-user-token", {
                test: "value",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token", {
                test: "value",
                programToken: "test-program-token",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#listUsers} */
    describe("listUsers()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listUsers} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listUsers({ clientUserId: "test-client-user-id", status: "test-status" }, callback);
            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users", { clientUserId: "test-client-user-id", status: "test-status" });
        });

        /** @test {Hyperwallet#listUsers} */
        it("should throw error for invalid filter", () => {
            const callback = () => null;
            expect(() => client.listUsers({ test1: "value" }, callback)).to.throw("Invalid Filter. Expected - clientUserId,email,programToken,status,verificationStatus");
        });

        /** @test {Hyperwallet#listUsers} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listUsers({}, callback);
            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users", {});
        });

        /** @test {Hyperwallet#listUsers} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listUsers({}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    /** @test {Hyperwallet#activateUser} */
    describe("activateUser()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /**
         * @test {Hyperwallet#activateUser}
         */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.activateUser(undefined, callback)).to.throw("userToken is required");
        });

        /**
         * @test {Hyperwallet#activateUser}
         */
        it("should send transition to 'ACTIVATED'", () => {
            const callback = () => null;
            client.activateUser("test-user-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/status-transitions", {
                transition: "ACTIVATED",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#deactivateUser} */
    describe("deactivateUser()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /**
         * @test {Hyperwallet#deactivateUser}
         */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.deactivateUser(undefined, callback)).to.throw("userToken is required");
        });

        /**
         * @test {Hyperwallet#deactivateUser}
         */
        it("should send transition to 'DE_ACTIVATED'", () => {
            const callback = () => null;
            client.deactivateUser("test-user-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/status-transitions", {
                transition: "DE_ACTIVATED",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#lockUser} */
    describe("lockUser()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /**
         * @test {Hyperwallet#lockUser}
         */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.lockUser(undefined, callback)).to.throw("userToken is required");
        });

        /**
         * @test {Hyperwallet#lockUser}
         */
        it("should send transition to 'LOCKED'", () => {
            const callback = () => null;
            client.lockUser("test-user-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/status-transitions", {
                transition: "LOCKED",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#freezeUser} */
    describe("freezeUser()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /**
         * @test {Hyperwallet#freezeUser}
         */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.freezeUser(undefined, callback)).to.throw("userToken is required");
        });

        /**
         * @test {Hyperwallet#freezeUser}
         */
        it("should send transition to 'FROZEN'", () => {
            const callback = () => null;
            client.freezeUser("test-user-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/status-transitions", {
                transition: "FROZEN",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#preactivateUser} */
    describe("preactivateUser()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /**
         * @test {Hyperwallet#preactivateUser}
         */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.preactivateUser(undefined, callback)).to.throw("userToken is required");
        });

        /**
         * @test {Hyperwallet#preactivateUser}
         */
        it("should send transition to 'PRE_ACTIVATED'", () => {
            const callback = () => null;
            client.preactivateUser("test-user-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/status-transitions", {
                transition: "PRE_ACTIVATED",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#createUserStatusTransition} */
    describe("createUserStatusTransition()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createUserStatusTransition} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.createUserStatusTransition(undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#createUserStatusTransition} */
        it("should send post call to user status transition endpoint", () => {
            const callback = () => null;
            client.createUserStatusTransition("test-user-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/status-transitions", {
                test: "value",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#getUserStatusTransition} */
    describe("getUserStatusTransition()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getUserStatusTransition} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.getUserStatusTransition(undefined, undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#getUserStatusTransition} */
        it("should throw error if statusTransitionToken is missing", () => {
            const callback = () => null;
            expect(() => client.getUserStatusTransition("test-user-token", undefined, callback)).to.throw("statusTransitionToken is required");
        });

        /** @test {Hyperwallet#getUserStatusTransition} */
        it("should do get call if userToken and statusTransitionToken is provided", () => {
            const callback = () => null;
            client.getUserStatusTransition("test-user-token", "status-transition-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/status-transitions/status-transition-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#listUserStatusTransitions} */
    describe("listUserStatusTransitions()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listUserStatusTransitions} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listUserStatusTransitions(undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listUserStatusTransitions} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listUserStatusTransitions("test-user-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/status-transitions", { test: "value" });
        });

        /** @test {Hyperwallet#listUserStatusTransitions} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listUserStatusTransitions("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/status-transitions", {});
        });

        /** @test {Hyperwallet#listUserStatusTransitions} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listUserStatusTransitions("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/status-transitions", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    describe("uploadDocuments()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPutMultipart: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#uploadDocuments} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.uploadDocuments(undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#uploadDocuments} */
        it("should throw error if data is missing", () => {
            const callback = () => null;
            expect(() => client.uploadDocuments("test-user-token", null, callback)).to.throw("Files for upload are require");
        });


        /** @test {Hyperwallet#uploadDocuments} */
        it("should do put call to upload multipart", () => {
            const callback = () => null;

            client.uploadDocuments("users/test-user-token", {
                test: "value",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
        });
    });

    //--------------------------------------
    // Bank Cards
    //--------------------------------------

    /** @test {Hyperwallet#createBankCard} */
    describe("createBankCard()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createBankCard} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.createBankCard(undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#createBankCard} */
        it("should do post call to bank cards endpoint", () => {
            const callback = () => null;
            client.createBankCard("test-user-token", {
                test: "value",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-cards", {
                test: "value",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#getBankCard} */
    describe("getBankCard()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getBankCard} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.getBankCard(undefined, undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#getBankCard} */
        it("should throw error if bankCardToken is missing", () => {
            const callback = () => null;
            expect(() => client.getBankCard("test-user-token", undefined, callback)).to.throw("bankCardToken is required");
        });

        /** @test {Hyperwallet#getBankCard} */
        it("should do get call if userToken and bankCardToken is provided", () => {
            const callback = () => null;
            client.getBankCard("test-user-token", "test-bank-card-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-cards/test-bank-card-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#updateBankCard} */
    describe("updateBankCard()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPut: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#updateBankCard} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.updateBankCard(undefined, undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#updateBankCard} */
        it("should throw error if bankCardToken is missing", () => {
            const callback = () => null;
            expect(() => client.updateBankCard("test-user-token", undefined, { test: "value" }, callback)).to.throw("bankCardToken is required");
        });

        /** @test {Hyperwallet#updateBankCard} */
        it("should do put call to bank cards endpoint", () => {
            const callback = () => null;
            client.updateBankCard("test-user-token", "test-bank-card-token", {
                test: "value",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-cards/test-bank-card-token", {
                test: "value",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#listBankCards} */
    describe("listBankCards()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listBankCards} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listBankCards(undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listBankCards} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listBankCards("test-user-token", { status: "test-status" }, callback);
            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-cards", { status: "test-status" });
        });

        /** @test {Hyperwallet#listBankCards} */
        it("should throw error for invalid filter", () => {
            const callback = () => null;
            expect(() => client.listBankCards("test-user-token", { test: "value" }, callback)).to.throw("Invalid Filter. Expected - status");
        });

        /** @test {Hyperwallet#listBankCards} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listBankCards("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-cards", {});
        });

        /** @test {Hyperwallet#listBankCards} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listBankCards("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-cards", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    /** @test {Hyperwallet#deactivateBankCard} */
    describe("deactivate()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /**
         * @test {Hyperwallet#deactivateBankCard}
         */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.deactivateBankCard(undefined, undefined, callback)).to.throw("userToken is required");
        });

        /**
         * @test {Hyperwallet#deactivateBankCard}
         */
        it("should throw error if bankCardToken is missing", () => {
            const callback = () => null;
            expect(() => client.deactivateBankCard("test-user-token", undefined, callback)).to.throw("bankCardToken is required");
        });

        /**
         * @test {Hyperwallet#deactivateBankCard}
         */
        it("should send transition to 'DE_ACTIVATED'", () => {
            const callback = () => null;
            client.deactivateBankCard("test-user-token", "test-bank-card-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-cards/test-bank-card-token/status-transitions", {
                transition: "DE_ACTIVATED",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#createBankCardStatusTransition} */
    describe("createBankCardStatusTransition()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createBankCardStatusTransition} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.createBankCardStatusTransition(undefined, undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#createBankCardStatusTransition} */
        it("should throw error if bankCardToken is missing", () => {
            const callback = () => null;
            expect(() => client.createBankCardStatusTransition("test-user-token", undefined, { test: "value" }, callback)).to.throw("bankCardToken is required");
        });

        /** @test {Hyperwallet#createBankCardStatusTransition} */
        it("should send post call to bank card status transition endpoint", () => {
            const callback = () => null;
            client.createBankCardStatusTransition("test-user-token", "test-bank-card-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-cards/test-bank-card-token/status-transitions", {
                test: "value",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#getBankCardStatusTransition} */
    describe("getBankCardStatusTransition()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getBankCardStatusTransition} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.getBankCardStatusTransition(undefined, undefined, undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#getBankCardStatusTransition} */
        it("should throw error if bankCardToken is missing", () => {
            const callback = () => null;
            expect(() => client.getBankCardStatusTransition("test-user-token", undefined, undefined, callback)).to.throw("bankCardToken is required");
        });

        /** @test {Hyperwallet#getBankCardStatusTransition} */
        it("should throw error if statusTransitionToken is missing", () => {
            const callback = () => null;
            expect(() => client.getBankCardStatusTransition("test-user-token", "test-bank-card-token", undefined, callback)).to.throw("statusTransitionToken is required");
        });

        /** @test {Hyperwallet#getBankCardStatusTransition} */
        it("should do get call if userToken, bankCardToken and statusTransitionToken is provided", () => {
            const callback = () => null;
            client.getBankCardStatusTransition("test-user-token", "test-bank-card-token", "status-transition-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-cards/test-bank-card-token/status-transitions/status-transition-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#listBankCardStatusTransitions} */
    describe("listBankCardStatusTransitions()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listBankCardStatusTransitions} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listBankCardStatusTransitions(undefined, undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listBankCardStatusTransitions} */
        it("should throw error if bankCardToken is missing", () => {
            const callback = () => null;
            expect(() => client.listBankCardStatusTransitions("test-user-token", undefined, {}, callback)).to.throw("bankCardToken is required");
        });

        /** @test {Hyperwallet#listBankCardStatusTransitions} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listBankCardStatusTransitions("test-user-token", "test-bank-card-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-cards/test-bank-card-token/status-transitions", { test: "value" });
        });

        /** @test {Hyperwallet#listBankCardStatusTransitions} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listBankCardStatusTransitions("test-user-token", "test-bank-card-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-cards/test-bank-card-token/status-transitions", {});
        });

        /** @test {Hyperwallet#listBankCardStatusTransitions} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listBankCardStatusTransitions("test-user-token", "test-bank-card-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-cards/test-bank-card-token/status-transitions", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    //--------------------------------------
    // Authentication Token
    //--------------------------------------

    /** @test {Hyperwallet#getAuthenticationToken} */
    describe("getAuthenticationToken()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getAuthenticationToken} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.getAuthenticationToken(undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#getAuthenticationToken} */
        it("should do post call to authentication token endpoint", () => {
            const callback = () => null;
            client.getAuthenticationToken("test-user-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/authentication-token", {}, {}, callback);
        });
    });

    //--------------------------------------
    // Paper Checks
    //--------------------------------------

    /** @test {Hyperwallet#createPaperCheck} */
    describe("createPaperCheck()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createPaperCheck} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.createPaperCheck(undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#createPaperCheck} */
        it("should do post call to paper checks endpoint", () => {
            const callback = () => null;
            client.createPaperCheck("test-user-token", {
                test: "value",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paper-checks", {
                test: "value",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#getPaperCheck} */
    describe("getPaperCheck()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getPaperCheck} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.getPaperCheck(undefined, undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#getPaperCheck} */
        it("should throw error if paperCheckToken is missing", () => {
            const callback = () => null;
            expect(() => client.getPaperCheck("test-user-token", undefined, callback)).to.throw("paperCheckToken is required");
        });

        /** @test {Hyperwallet#getPaperCheck} */
        it("should do get call if userToken and paperCheckToken is provided", () => {
            const callback = () => null;
            client.getPaperCheck("test-user-token", "test-paper-check-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paper-checks/test-paper-check-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#updatePaperCheck} */
    describe("updatePaperCheck()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPut: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#updatePaperCheck} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.updatePaperCheck(undefined, undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#updatePaperCheck} */
        it("should throw error if paperCheckToken is missing", () => {
            const callback = () => null;
            expect(() => client.updatePaperCheck("test-user-token", undefined, { test: "value" }, callback)).to.throw("paperCheckToken is required");
        });

        /** @test {Hyperwallet#updatePaperCheck} */
        it("should do put call to paper checks endpoint", () => {
            const callback = () => null;
            client.updatePaperCheck("test-user-token", "test-paper-check-token", {
                test: "value",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paper-checks/test-paper-check-token", {
                test: "value",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#listPaperChecks} */
    describe("listPaperChecks()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listPaperChecks} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listPaperChecks(undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listPaperChecks} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listPaperChecks("test-user-token", { status: "test-status" }, callback);
            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paper-checks", { status: "test-status" });
        });

        /** @test {Hyperwallet#listPaperChecks} */
        it("should throw error for invalid filter", () => {
            const callback = () => null;
            expect(() => client.listPaperChecks("test-user-token", { test: "value" }, callback)).to.throw("Invalid Filter. Expected - status");
        });

        /** @test {Hyperwallet#listPaperChecks} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listPaperChecks("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paper-checks", {});
        });

        /** @test {Hyperwallet#listPaperChecks} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listPaperChecks("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paper-checks", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    /** @test {Hyperwallet#deactivatePaperCheck} */
    describe("deactivate()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /**
         * @test {Hyperwallet#deactivatePaperCheck}
         */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.deactivatePaperCheck(undefined, undefined, callback)).to.throw("userToken is required");
        });

        /**
         * @test {Hyperwallet#deactivatePaperCheck}
         */
        it("should throw error if paperCheckToken is missing", () => {
            const callback = () => null;
            expect(() => client.deactivatePaperCheck("test-user-token", undefined, callback)).to.throw("paperCheckToken is required");
        });

        /**
         * @test {Hyperwallet#deactivatePaperCheck}
         */
        it("should send transition to 'DE_ACTIVATED'", () => {
            const callback = () => null;
            client.deactivatePaperCheck("test-user-token", "test-paper-check-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paper-checks/test-paper-check-token/status-transitions", {
                transition: "DE_ACTIVATED",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#createPaperCheckStatusTransition} */
    describe("createPaperCheckStatusTransition()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createPaperCheckStatusTransition} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.createPaperCheckStatusTransition(undefined, undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#createPaperCheckStatusTransition} */
        it("should throw error if paperCheckToken is missing", () => {
            const callback = () => null;
            expect(() => client.createPaperCheckStatusTransition("test-user-token", undefined, { test: "value" }, callback)).to.throw("paperCheckToken is required");
        });

        /** @test {Hyperwallet#createPaperCheckStatusTransition} */
        it("should send post call to paper check status transition endpoint", () => {
            const callback = () => null;
            client.createPaperCheckStatusTransition("test-user-token", "test-paper-check-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paper-checks/test-paper-check-token/status-transitions", {
                test: "value",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#getPaperCheckStatusTransition} */
    describe("getPaperCheckStatusTransition()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getPaperCheckStatusTransition} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.getPaperCheckStatusTransition(undefined, undefined, undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#getPaperCheckStatusTransition} */
        it("should throw error if paperCheckToken is missing", () => {
            const callback = () => null;
            expect(() => client.getPaperCheckStatusTransition("test-user-token", undefined, undefined, callback)).to.throw("paperCheckToken is required");
        });

        /** @test {Hyperwallet#getPaperCheckStatusTransition} */
        it("should throw error if statusTransitionToken is missing", () => {
            const callback = () => null;
            expect(() => client.getPaperCheckStatusTransition("test-user-token", "test-paper-check-token", undefined, callback)).to.throw("statusTransitionToken is required");
        });

        /** @test {Hyperwallet#getPaperCheckStatusTransition} */
        it("should do get call if userToken, paperCheckToken and statusTransitionToken is provided", () => {
            const callback = () => null;
            client.getPaperCheckStatusTransition("test-user-token", "test-paper-check-token", "status-transition-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paper-checks/test-paper-check-token/status-transitions/status-transition-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#listPaperCheckStatusTransitions} */
    describe("listPaperCheckStatusTransitions()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listPaperCheckStatusTransitions} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listPaperCheckStatusTransitions(undefined, undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listPaperCheckStatusTransitions} */
        it("should throw error if paperCheckToken is missing", () => {
            const callback = () => null;
            expect(() => client.listPaperCheckStatusTransitions("test-user-token", undefined, {}, callback)).to.throw("paperCheckToken is required");
        });

        /** @test {Hyperwallet#listPaperCheckStatusTransitions} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listPaperCheckStatusTransitions("test-user-token", "test-paper-check-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paper-checks/test-paper-check-token/status-transitions", { test: "value" });
        });

        /** @test {Hyperwallet#listPaperCheckStatusTransitions} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listPaperCheckStatusTransitions("test-user-token", "test-paper-check-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paper-checks/test-paper-check-token/status-transitions", {});
        });

        /** @test {Hyperwallet#listPaperCheckStatusTransitions} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listPaperCheckStatusTransitions("test-user-token", "test-paper-check-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paper-checks/test-paper-check-token/status-transitions", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    //--------------------------------------
    // Transfers
    //--------------------------------------

    /** @test {Hyperwallet#createTransfer} */
    describe("createTransfer()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createTransfer} */
        it("should throw error if sourceToken is missing", () => {
            const callback = () => null;
            expect(() => client.createTransfer({
                test: "value",
            }, callback)).to.throw("sourceToken is required");
        });

        /** @test {Hyperwallet#createTransfer} */
        it("should throw error if destinationToken is missing", () => {
            const callback = () => null;
            expect(() => client.createTransfer({
                sourceToken: "sourceToken",
            }, callback)).to.throw("destinationToken is required");
        });

        /** @test {Hyperwallet#createTransfer} */
        it("should throw error if clientTransferId is missing", () => {
            const callback = () => null;
            expect(() => client.createTransfer({
                sourceToken: "sourceToken",
                destinationToken: "destinationToken",
            }, callback)).to.throw("clientTransferId is required");
        });

        /** @test {Hyperwallet#createTransfer} */
        it("should do post call to transfers endpoint", () => {
            const callback = () => null;
            client.createTransfer({
                sourceToken: "sourceToken",
                destinationToken: "destinationToken",
                clientTransferId: "clientTransferId",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("transfers", {
                sourceToken: "sourceToken",
                destinationToken: "destinationToken",
                clientTransferId: "clientTransferId",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#getTransfer} */
    describe("getTransfer()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getTransfer} */
        it("should throw error if transferToken is missing", () => {
            const callback = () => null;
            expect(() => client.getTransfer(undefined, callback)).to.throw("transferToken is required");
        });

        /** @test {Hyperwallet#getTransfer} */
        it("should do get call if transferToken is provided", () => {
            const callback = () => null;
            client.getTransfer("test-transfer-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("transfers/test-transfer-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#listTransfers} */
    describe("listTransfers()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listTransfers} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listTransfers({ clientTransferId: "test-status", sourceToken: "test-sourceToken", destinationToken: "test-destinationToken" }, callback);
            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("transfers", { clientTransferId: "test-status", sourceToken: "test-sourceToken", destinationToken: "test-destinationToken" });
        });

        /** @test {Hyperwallet#listTransfers} */
        it("should throw error for invalid filter", () => {
            const callback = () => null;
            expect(() => client.listTransfers({ test: "value" }, callback)).to.throw("Invalid Filter. Expected - clientTransferId,sourceToken,destinationToken");
        });

        /** @test {Hyperwallet#listTransfers} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listTransfers({}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("transfers", {});
        });

        /** @test {Hyperwallet#listTransfers} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listTransfers({}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("transfers", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    /** @test {Hyperwallet#createTransferStatusTransition} */
    describe("createTransferStatusTransition()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createTransferStatusTransition} */
        it("should throw error if transferToken is missing", () => {
            const callback = () => null;
            expect(() => client.createTransferStatusTransition(undefined, { test: "value" }, callback)).to.throw("transferToken is required");
        });

        /** @test {Hyperwallet#createTransferStatusTransition} */
        it("should send post call to transfer status transition endpoint", () => {
            const callback = () => null;
            client.createTransferStatusTransition("test-transfer-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("transfers/test-transfer-token/status-transitions", {
                test: "value",
            }, {}, callback);
        });
    });

    //--------------------------------------
    // Transfer Refunds
    //--------------------------------------

    /** @test {Hyperwallet#createTransferRefund} */
    describe("createTransferRefund()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createTransferRefund} */
        it("should throw error if transferToken is missing", () => {
            const callback = () => null;
            expect(() => client.createTransferRefund(undefined, {
                clientRefundId: "value",
            }, callback)).to.throw("transferToken is required");
        });

        /** @test {Hyperwallet#createTransferRefund} */
        it("should throw error if clientRefundId is missing", () => {
            const callback = () => null;
            expect(() => client.createTransferRefund("test-transfer-token", {
                test: "value",
            }, callback)).to.throw("clientRefundId is required");
        });

        /** @test {Hyperwallet#createTransferRefund} */
        it("should do post call to transfer refunds endpoint", () => {
            const callback = () => null;
            client.createTransferRefund("test-transfer-token", {
                clientRefundId: "clientRefundId",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("transfers/test-transfer-token/refunds", {
                clientRefundId: "clientRefundId",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#getTransferRefund} */
    describe("getTransferRefund()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getTransferRefund} */
        it("should throw error if transferToken is missing", () => {
            const callback = () => null;
            expect(() => client.getTransferRefund(undefined, "test-transfer-refund-token",
                callback)).to.throw("transferToken is required");
        });

        /** @test {Hyperwallet#getTransferRefund} */
        it("should throw error if transferRefundToken is missing", () => {
            const callback = () => null;
            expect(() => client.getTransferRefund("test-transfer-token", undefined,
                callback)).to.throw("transferRefundToken is required");
        });

        /** @test {Hyperwallet#getTransferRefund} */
        it("should do get call if transferToken is provided", () => {
            const callback = () => null;
            client.getTransferRefund("test-transfer-token", "test-transfer-refund-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("transfers/test-transfer-token/refunds/test-transfer-refund-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#listTransferRefunds} */
    describe("listTransferRefunds()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listTransferRefunds} */
        it("should throw error if transferToken is missing", () => {
            const callback = () => null;
            expect(() => client.listTransferRefunds(undefined, {
                test: "value",
            }, callback)).to.throw("transferToken is required");
        });

        /** @test {Hyperwallet#listTransferRefunds} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listTransferRefunds("test-transfer-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("transfers/test-transfer-token/refunds", { test: "value" });
        });

        /** @test {Hyperwallet#listTransferRefunds} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listTransferRefunds("test-transfer-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("transfers/test-transfer-token/refunds", {});
        });

        /** @test {Hyperwallet#listTransferRefunds} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listTransferRefunds("test-transfer-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("transfers/test-transfer-token/refunds", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    //--------------------------------------
    // PayPal accounts
    //--------------------------------------

    /** @test {Hyperwallet#createPayPalAccount} */
    describe("createPayPalAccount()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createPayPalAccount} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.createPayPalAccount(undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#createPayPalAccount} */
        it("should throw error if transferMethodCountry is missing", () => {
            const callback = () => null;
            expect(() => client.createPayPalAccount("test-user-token", { test: "value" }, callback)).to.throw("transferMethodCountry is required");
        });

        /** @test {Hyperwallet#createPayPalAccount} */
        it("should throw error if transferMethodCurrency is missing", () => {
            const callback = () => null;
            expect(() => client.createPayPalAccount("test-user-token", {
                transferMethodCountry: "test-transferMethodCountry",
            }, callback)).to.throw("transferMethodCurrency is required");
        });

        /** @test {Hyperwallet#createPayPalAccount} */
        it("should throw error if email is missing", () => {
            const callback = () => null;
            expect(() => client.createPayPalAccount("test-user-token", {
                transferMethodCountry: "test-transferMethodCountry",
                transferMethodCurrency: "test-transferMethodCurrency",
            }, callback)).to.throw("email is required");
        });

        /** @test {Hyperwallet#createPayPalAccount} */
        it("should do post call to PayPal account endpoint", () => {
            const callback = () => null;
            client.createPayPalAccount("test-user-token", {
                transferMethodCountry: "test-transferMethodCountry",
                transferMethodCurrency: "test-transferMethodCurrency",
                email: "email",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paypal-accounts", {
                transferMethodCountry: "test-transferMethodCountry",
                transferMethodCurrency: "test-transferMethodCurrency",
                email: "email",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#getPayPalAccount} */
    describe("getPayPalAccount()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getPayPalAccount} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.getPayPalAccount(undefined, undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#getPayPalAccount} */
        it("should throw error if payPalAccountToken is missing", () => {
            const callback = () => null;
            expect(() => client.getPayPalAccount("test-user-token", undefined, callback)).to.throw("payPalAccountToken is required");
        });

        /** @test {Hyperwallet#getPayPalAccount} */
        it("should do get call if userToken and payPalAccountToken is provided", () => {
            const callback = () => null;
            client.getPayPalAccount("test-user-token", "test-paypal-account-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paypal-accounts/test-paypal-account-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#listPayPalAccounts} */
    describe("listPayPalAccounts()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listPayPalAccounts} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listPayPalAccounts(undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listPayPalAccounts} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listPayPalAccounts("test-user-token", { status: "test-status" }, callback);
            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paypal-accounts", { status: "test-status" });
        });

        /** @test {Hyperwallet#listPayPalAccounts} */
        it("should throw error for invalid filter", () => {
            const callback = () => null;
            expect(() => client.listPayPalAccounts("test-user-token", { test: "value" }, callback)).to.throw("Invalid Filter. Expected - status");
        });

        /** @test {Hyperwallet#listPayPalAccounts} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listPayPalAccounts("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paypal-accounts", {});
        });

        /** @test {Hyperwallet#listPayPalAccounts} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listPayPalAccounts("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paypal-accounts", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    /** @test {Hyperwallet#createPayPalAccountStatusTransition} */
    describe("createPayPalAccountStatusTransition()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createPayPalAccountStatusTransition} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.createPayPalAccountStatusTransition(undefined, undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#createPayPalAccountStatusTransition} */
        it("should throw error if payPalAccountToken is missing", () => {
            const callback = () => null;
            expect(() => client.createPayPalAccountStatusTransition("test-user-token", undefined, { test: "value" }, callback)).to.throw("payPalAccountToken is required");
        });

        /** @test {Hyperwallet#createPayPalAccountStatusTransition} */
        it("should send post call to paypal account status transition endpoint", () => {
            const callback = () => null;
            client.createPayPalAccountStatusTransition("test-user-token", "test-paypal-account-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/paypal-accounts/test-paypal-account-token/status-transitions", {
                test: "value",
            }, {}, callback);
        });
    });

    //--------------------------------------
    // Prepaid Cards
    //--------------------------------------

    /** @test {Hyperwallet#createPrepaidCard} */
    describe("createPrepaidCard()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createPrepaidCard} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.createPrepaidCard(undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#createPrepaidCard} */
        it("should do post call to prepaid cards endpoint", () => {
            const callback = () => null;
            client.createPrepaidCard("test-user-token", {
                test: "value",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards", {
                test: "value",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#getPrepaidCard} */
    describe("getPrepaidCard()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getPrepaidCard} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.getPrepaidCard(undefined, undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#getPrepaidCard} */
        it("should throw error if prepaidCardToken is missing", () => {
            const callback = () => null;
            expect(() => client.getPrepaidCard("test-user-token", undefined, callback)).to.throw("prepaidCardToken is required");
        });

        /** @test {Hyperwallet#getPrepaidCard} */
        it("should do get call if userToken and prepaidCardToken is provided", () => {
            const callback = () => null;
            client.getPrepaidCard("test-user-token", "test-prepaid-card-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards/test-prepaid-card-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#updatePrepaidCard} */
    describe("updatePrepaidCard()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPut: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#updatePrepaidCard} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.updatePrepaidCard(undefined, undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#updatePrepaidCard} */
        it("should throw error if prepaidCardToken is missing", () => {
            const callback = () => null;
            expect(() => client.updatePrepaidCard("test-user-token", undefined, { test: "value" }, callback)).to.throw("prepaidCardToken is required");
        });

        /** @test {Hyperwallet#updatePrepaidCard} */
        it("should do put call to prepaid cards endpoint", () => {
            const callback = () => null;
            client.updatePrepaidCard("test-user-token", "test-prepaid-card-token", {
                test: "value",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards/test-prepaid-card-token", {
                test: "value",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#listPrepaidCards} */
    describe("listPrepaidCards()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listPrepaidCards} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listPrepaidCards(undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listPrepaidCards} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listPrepaidCards("test-user-token", { status: "test-status" }, callback);
            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards", { status: "test-status" });
        });

        /** @test {Hyperwallet#listPrepaidCards} */
        it("should throw error for invalid filter", () => {
            const callback = () => null;
            expect(() => client.listPrepaidCards("test-user-token", { test: "value" }, callback)).to.throw("Invalid Filter. Expected - status");
        });

        /** @test {Hyperwallet#listPrepaidCards} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listPrepaidCards("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards", {});
        });

        /** @test {Hyperwallet#listPrepaidCards} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listPrepaidCards("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    const PREPAID_CARD_STATUS_CHANGE_METHODS = {
        suspend: "SUSPENDED",
        unsuspend: "UNSUSPENDED",
        lostOrStolen: "LOST_OR_STOLEN",
        deactivate: "DE_ACTIVATED",
        lock: "LOCKED",
        unlock: "UNLOCKED",
    };
    Object.keys(PREPAID_CARD_STATUS_CHANGE_METHODS).forEach((method) => {
        const methodName = `${method}PrepaidCard`;

        describe(`${methodName}()`, () => {
            let client;
            let apiClientSpy;

            beforeEach(() => {
                apiClientSpy = sinon.spy();
                client = new Hyperwallet({
                    username: "test-username",
                    password: "test-password",
                });
                client.client = {
                    doPost: apiClientSpy,
                };
            });

            /**
             * @test {Hyperwallet#suspendPrepaidCard}
             * @test {Hyperwallet#unsuspendPrepaidCard}
             * @test {Hyperwallet#lostOrStolenPrepaidCard}
             * @test {Hyperwallet#deactivatePrepaidCard}
             * @test {Hyperwallet#lockPrepaidCard}
             * @test {Hyperwallet#unlockPrepaidCard}
             */
            it("should throw error if userToken is missing", () => {
                const callback = () => null;
                expect(() => client[methodName](undefined, undefined, callback)).to.throw("userToken is required");
            });

            /**
             * @test {Hyperwallet#suspendPrepaidCard}
             * @test {Hyperwallet#unsuspendPrepaidCard}
             * @test {Hyperwallet#lostOrStolenPrepaidCard}
             * @test {Hyperwallet#deactivatePrepaidCard}
             * @test {Hyperwallet#lockPrepaidCard}
             * @test {Hyperwallet#unlockPrepaidCard}
             */
            it("should throw error if prepaidCardToken is missing", () => {
                const callback = () => null;
                expect(() => client[methodName]("test-user-token", undefined, callback)).to.throw("prepaidCardToken is required");
            });

            /**
             * @test {Hyperwallet#suspendPrepaidCard}
             * @test {Hyperwallet#unsuspendPrepaidCard}
             * @test {Hyperwallet#lostOrStolenPrepaidCard}
             * @test {Hyperwallet#deactivatePrepaidCard}
             * @test {Hyperwallet#lockPrepaidCard}
             * @test {Hyperwallet#unlockPrepaidCard}
             */
            it(`should send transition to '${PREPAID_CARD_STATUS_CHANGE_METHODS[method]}'`, () => {
                const callback = () => null;
                client[methodName]("test-user-token", "test-prepaid-card-token", callback);

                apiClientSpy.should.have.been.calledOnce();
                apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards/test-prepaid-card-token/status-transitions", {
                    transition: PREPAID_CARD_STATUS_CHANGE_METHODS[method],
                }, {}, callback);
            });
        });
    });

    /** @test {Hyperwallet#createPrepaidCardStatusTransition} */
    describe("createPrepaidCardStatusTransition()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createPrepaidCardStatusTransition} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.createPrepaidCardStatusTransition(undefined, undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#createPrepaidCardStatusTransition} */
        it("should throw error if prepaidCardToken is missing", () => {
            const callback = () => null;
            expect(() => client.createPrepaidCardStatusTransition("test-user-token", undefined, { test: "value" }, callback)).to.throw("prepaidCardToken is required");
        });

        /** @test {Hyperwallet#createPrepaidCardStatusTransition} */
        it("should send post call to prepaid card status transition endpoint", () => {
            const callback = () => null;
            client.createPrepaidCardStatusTransition("test-user-token", "test-prepaid-card-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards/test-prepaid-card-token/status-transitions", {
                test: "value",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#getPrepaidCardStatusTransition} */
    describe("getPrepaidCardStatusTransition()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getPrepaidCardStatusTransition} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.getPrepaidCardStatusTransition(undefined, undefined, undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#getPrepaidCardStatusTransition} */
        it("should throw error if prepaidCardToken is missing", () => {
            const callback = () => null;
            expect(() => client.getPrepaidCardStatusTransition("test-user-token", undefined, undefined, callback)).to.throw("prepaidCardToken is required");
        });

        /** @test {Hyperwallet#getPrepaidCardStatusTransition} */
        it("should throw error if statusTransitionToken is missing", () => {
            const callback = () => null;
            expect(() => client.getPrepaidCardStatusTransition("test-user-token", "test-prepaid-card-token", undefined, callback)).to.throw("statusTransitionToken is required");
        });

        /** @test {Hyperwallet#getPrepaidCardStatusTransition} */
        it("should do get call if userToken, prepaidCardToken and statusTransitionToken is provided", () => {
            const callback = () => null;
            client.getPrepaidCardStatusTransition("test-user-token", "test-prepaid-card-token", "status-transition-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards/test-prepaid-card-token/status-transitions/status-transition-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#listPrepaidCardStatusTransitions} */
    describe("listPrepaidCardStatusTransitions()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listPrepaidCardStatusTransitions} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listPrepaidCardStatusTransitions(undefined, undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listPrepaidCardStatusTransitions} */
        it("should throw error if prepaidCardToken is missing", () => {
            const callback = () => null;
            expect(() => client.listPrepaidCardStatusTransitions("test-user-token", undefined, {}, callback)).to.throw("prepaidCardToken is required");
        });

        /** @test {Hyperwallet#listPrepaidCardStatusTransitions} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listPrepaidCardStatusTransitions("test-user-token", "test-prepaid-card-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards/test-prepaid-card-token/status-transitions", { test: "value" });
        });

        /** @test {Hyperwallet#listPrepaidCardStatusTransitions} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listPrepaidCardStatusTransitions("test-user-token", "test-prepaid-card-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards/test-prepaid-card-token/status-transitions", {});
        });

        /** @test {Hyperwallet#listPrepaidCardStatusTransitions} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listPrepaidCardStatusTransitions("test-user-token", "test-prepaid-card-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards/test-prepaid-card-token/status-transitions", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    //--------------------------------------
    // Bank Accounts
    //--------------------------------------

    /** @test {Hyperwallet#createBankAccount} */
    describe("createBankAccount()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createBankAccount} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.createBankAccount(undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#createBankAccount} */
        it("should do post call to bank accounts endpoint", () => {
            const callback = () => null;
            client.createBankAccount("test-user-token", {
                test: "value",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-accounts", {
                test: "value",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#getBankAccount} */
    describe("getBankAccount()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getBankAccount} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.getBankAccount(undefined, undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#getBankAccount} */
        it("should throw error if bankAccountToken is missing", () => {
            const callback = () => null;
            expect(() => client.getBankAccount("test-user-token", undefined, callback)).to.throw("bankAccountToken is required");
        });

        /** @test {Hyperwallet#getBankAccount} */
        it("should do get call if userToken and bankAccountToken is provided", () => {
            const callback = () => null;
            client.getBankAccount("test-user-token", "test-bank-account-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-accounts/test-bank-account-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#updateBankAccount} */
    describe("updateBankAccount()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPut: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#updateBankAccount} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.updateBankAccount(undefined, undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#updateBankAccount} */
        it("should throw error if bankAccountToken is missing", () => {
            const callback = () => null;
            expect(() => client.updateBankAccount("test-user-token", undefined, { test: "value" }, callback)).to.throw("bankAccountToken is required");
        });

        /** @test {Hyperwallet#updateBankAccount} */
        it("should do put call to bank accounts endpoint", () => {
            const callback = () => null;
            client.updateBankAccount("test-user-token", "test-bank-account-token", {
                test: "value",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-accounts/test-bank-account-token", {
                test: "value",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#listBankAccounts} */
    describe("listBankAccounts()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listBankAccounts} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listBankAccounts(undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listBankAccounts} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listBankAccounts("test-user-token", { type: "test-type", status: "test-status" }, callback);
            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-accounts", { type: "test-type", status: "test-status" });
        });

        /** @test {Hyperwallet#listBankAccounts} */
        it("should throw error for invalid filter", () => {
            const callback = () => null;
            expect(() => client.listBankAccounts("test-user-token", { test: "value" }, callback)).to.throw("Invalid Filter. Expected - type,status");
        });

        /** @test {Hyperwallet#listBankAccounts} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listBankAccounts("test-user-token", {}, callback);
            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-accounts", {});
        });

        /** @test {Hyperwallet#listBankAccounts} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listBankAccounts("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-accounts", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    /** @test {Hyperwallet#deactivateBankAccount} */
    describe("deactivateBankAccount()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#deactivateBankAccount} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.deactivateBankAccount(undefined, undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#deactivateBankAccount} */
        it("should throw error if bankAccountToken is missing", () => {
            const callback = () => null;
            expect(() => client.deactivateBankAccount("test-user-token", undefined, callback)).to.throw("bankAccountToken is required");
        });

        /** @test {Hyperwallet#deactivateBankAccount} */
        it("should send transition to 'DE-ACTIVATED'", () => {
            const callback = () => null;
            client.deactivateBankAccount("test-user-token", "test-bank-account-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-accounts/test-bank-account-token/status-transitions", {
                transition: "DE-ACTIVATED",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#createBankAccountStatusTransition} */
    describe("createBankAccountStatusTransition()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createBankAccountStatusTransition} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.createBankAccountStatusTransition(undefined, undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#createBankAccountStatusTransition} */
        it("should throw error if bankAccountToken is missing", () => {
            const callback = () => null;
            expect(() => client.createBankAccountStatusTransition("test-user-token", undefined, { test: "value" }, callback)).to.throw("bankAccountToken is required");
        });

        /** @test {Hyperwallet#createBankAccountStatusTransition} */
        it("should send post call to prepaid card status transition endpoint", () => {
            const callback = () => null;
            client.createBankAccountStatusTransition("test-user-token", "test-bank-account-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-accounts/test-bank-account-token/status-transitions", {
                test: "value",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#getBankAccountStatusTransition} */
    describe("getBankAccountStatusTransition()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getBankAccountStatusTransition} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.getBankAccountStatusTransition(undefined, undefined, undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#getBankAccountStatusTransition} */
        it("should throw error if bankAccountToken is missing", () => {
            const callback = () => null;
            expect(() => client.getBankAccountStatusTransition("test-user-token", undefined, undefined, callback)).to.throw("bankAccountToken is required");
        });

        /** @test {Hyperwallet#getBankAccountStatusTransition} */
        it("should throw error if statusTransitionToken is missing", () => {
            const callback = () => null;
            expect(() => client.getBankAccountStatusTransition("test-user-token", "test-bank-account-token", undefined, callback)).to.throw("statusTransitionToken is required");
        });

        /** @test {Hyperwallet#getBankAccountStatusTransition} */
        it("should do get call if userToken, bankAccountToken and statusTransitionToken is provided", () => {
            const callback = () => null;
            client.getBankAccountStatusTransition("test-user-token", "test-bank-account-token", "status-transition-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-accounts/test-bank-account-token/status-transitions/status-transition-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#listBankAccountStatusTransitions} */
    describe("listBankAccountStatusTransitions()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listBankAccountStatusTransitions} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listBankAccountStatusTransitions(undefined, undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listBankAccountStatusTransitions} */
        it("should throw error if bankAccountToken is missing", () => {
            const callback = () => null;
            expect(() => client.listBankAccountStatusTransitions("test-user-token", undefined, {}, callback)).to.throw("bankAccountToken is required");
        });

        /** @test {Hyperwallet#listBankAccountStatusTransitions} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listBankAccountStatusTransitions("test-user-token", "test-bank-account-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-accounts/test-bank-account-token/status-transitions", { test: "value" });
        });

        /** @test {Hyperwallet#listBankAccountStatusTransitions} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listBankAccountStatusTransitions("test-user-token", "test-bank-account-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-accounts/test-bank-account-token/status-transitions", {});
        });

        /** @test {Hyperwallet#listBankAccountStatusTransitions} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listBankAccountStatusTransitions("test-user-token", "test-bank-account-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/bank-accounts/test-bank-account-token/status-transitions", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    //--------------------------------------
    // Balances
    //--------------------------------------

    /** @test {Hyperwallet#listBalancesForUser} */
    describe("listBalancesForUser()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listBalancesForUser} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listBalancesForUser(undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listBalancesForUser} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listBalancesForUser("test-user-token", { currency: "test-currency" }, callback);
            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/balances", { currency: "test-currency" });
        });

        /** @test {Hyperwallet#listBalancesForUser} */
        it("should throw error for invalid filter", () => {
            const callback = () => null;
            expect(() => client.listBalancesForUser("test-user-token", { test: "value" }, callback)).to.throw("Invalid Filter. Expected - currency");
        });

        /** @test {Hyperwallet#listBalancesForUser} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listBalancesForUser("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/balances", {});
        });

        /** @test {Hyperwallet#listBalancesForUser} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listBalancesForUser("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/balances", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    /** @test {Hyperwallet#listBalancesForPrepaidCard} */
    describe("listBalancesForPrepaidCard()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listBalancesForPrepaidCard} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listBalancesForPrepaidCard(undefined, undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listBalancesForPrepaidCard} */
        it("should throw error if prepaidCardToken is missing", () => {
            const callback = () => null;
            expect(() => client.listBalancesForPrepaidCard("test-user-token", undefined, {}, callback)).to.throw("prepaidCardToken is required");
        });

        /** @test {Hyperwallet#listBalancesForPrepaidCard} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listBalancesForPrepaidCard("test-user-token", "test-prepaid-card-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards/test-prepaid-card-token/balances", { test: "value" });
        });

        /** @test {Hyperwallet#listBalancesForPrepaidCard} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listBalancesForPrepaidCard("test-user-token", "test-prepaid-card-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards/test-prepaid-card-token/balances", {});
        });

        /** @test {Hyperwallet#listBalancesForPrepaidCard} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listBalancesForPrepaidCard("test-user-token", "test-prepaid-card-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards/test-prepaid-card-token/balances", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    /** @test {Hyperwallet#listBalancesForAccount} */
    describe("listBalancesForAccount()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listBalancesForAccount} */
        it("should throw error if programToken is missing", () => {
            const callback = () => null;
            expect(() => client.listBalancesForAccount(undefined, undefined, {}, callback)).to.throw("programToken is required");
        });

        /** @test {Hyperwallet#listBalancesForAccount} */
        it("should throw error if accountToken is missing", () => {
            const callback = () => null;
            expect(() => client.listBalancesForAccount("test-program-token", undefined, {}, callback)).to.throw("accountToken is required");
        });

        /** @test {Hyperwallet#listBalancesForAccount} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listBalancesForAccount("test-program-token", "test-account-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("programs/test-program-token/accounts/test-account-token/balances", { test: "value" });
        });

        /** @test {Hyperwallet#listBalancesForAccount} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listBalancesForAccount("test-program-token", "test-account-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("programs/test-program-token/accounts/test-account-token/balances", {});
        });

        /** @test {Hyperwallet#listBalancesForAccount} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listBalancesForAccount("test-program-token", "test-account-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("programs/test-program-token/accounts/test-account-token/balances", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    //--------------------------------------
    // Payments
    //--------------------------------------

    /** @test {Hyperwallet#createPayment} */
    describe("createPayment()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createPayment} */
        it("should do post call to payments endpoint without programToken added", () => {
            const callback = () => null;
            client.createPayment({
                test: "value",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("payments", {
                test: "value",
            }, {}, callback);
        });

        /** @test {Hyperwallet#createPayment} */
        it("should do post call to payments endpoint with programToken added", () => {
            client.programToken = "test-program-token";

            const callback = () => null;
            client.createPayment({
                test: "value",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("payments", {
                test: "value",
                programToken: "test-program-token",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#getPayment} */
    describe("getPayment()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getPayment} */
        it("should throw error if paymentToken is missing", () => {
            const callback = () => null;
            expect(() => client.getPayment(undefined, callback)).to.throw("paymentToken is required");
        });

        /** @test {Hyperwallet#getPayment} */
        it("should do get call if paymentToken is provided", () => {
            const callback = () => null;
            client.getPayment("test-payment-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("payments/test-payment-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#listPayments} */
    describe("listPayments()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listPayments} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listPayments({ clientPaymentId: "test-client-payment-id" }, callback);
            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("payments", { clientPaymentId: "test-client-payment-id" });
        });

        /** @test {Hyperwallet#listPayments} */
        it("should throw error for invalid filter", () => {
            const callback = () => null;
            expect(() => client.listPayments({ test: "value" }, callback)).to.throw("Invalid Filter. Expected - clientPaymentId");
        });

        /** @test {Hyperwallet#listPayments} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listPayments({}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("payments", {});
        });

        /** @test {Hyperwallet#listPayments} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listPayments({}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("payments", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    /** @test {Hyperwallet#createPaymentStatusTransition} */
    describe("createPaymentStatusTransition()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createPaymentStatusTransition} */
        it("should throw error if paymentToken is missing", () => {
            const callback = () => null;
            expect(() => client.createPaymentStatusTransition(undefined, { test: "value" }, callback)).to.throw("paymentToken is required");
        });

        /** @test {Hyperwallet#createPaymentStatusTransition} */
        it("should send post call to payment status transition endpoint", () => {
            const callback = () => null;
            client.createPaymentStatusTransition("test-payment-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("payments/test-payment-token/status-transitions", {
                test: "value",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#getPaymentStatusTransition} */
    describe("getPaymentStatusTransition()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getPaymentStatusTransition} */
        it("should throw error if paymentToken is missing", () => {
            const callback = () => null;
            expect(() => client.getPaymentStatusTransition(undefined, undefined, callback)).to.throw("paymentToken is required");
        });

        /** @test {Hyperwallet#getPaymentStatusTransition} */
        it("should throw error if statusTransitionToken is missing", () => {
            const callback = () => null;
            expect(() => client.getPaymentStatusTransition("test-payment-token", undefined, callback)).to.throw("statusTransitionToken is required");
        });

        /** @test {Hyperwallet#getPaymentStatusTransition} */
        it("should do get call if paymentToken and statusTransitionToken is provided", () => {
            const callback = () => null;
            client.getPaymentStatusTransition("test-payment-token", "status-transition-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("payments/test-payment-token/status-transitions/status-transition-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#listPaymentStatusTransitions} */
    describe("listPaymentStatusTransitions()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listPaymentStatusTransitions} */
        it("should throw error if paymentToken is missing", () => {
            const callback = () => null;
            expect(() => client.listPaymentStatusTransitions(undefined, {}, callback)).to.throw("paymentToken is required");
        });

        /** @test {Hyperwallet#listPaymentStatusTransitions} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listPaymentStatusTransitions("test-payment-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("payments/test-payment-token/status-transitions", { test: "value" });
        });

        /** @test {Hyperwallet#listPaymentStatusTransitions} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listPaymentStatusTransitions("test-payment-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("payments/test-payment-token/status-transitions", {});
        });

        /** @test {Hyperwallet#listPaymentStatusTransitions} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listPaymentStatusTransitions("test-payment-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("payments/test-payment-token/status-transitions", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    //--------------------------------------
    // Programs
    //--------------------------------------

    /** @test {Hyperwallet#getProgram} */
    describe("getProgram()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getProgram} */
        it("should throw error if programToken is missing", () => {
            const callback = () => null;
            expect(() => client.getProgram(undefined, callback)).to.throw("programToken is required");
        });

        /** @test {Hyperwallet#getProgram} */
        it("should do get call if programToken is provided", () => {
            const callback = () => null;
            client.getProgram("test-program-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("programs/test-program-token", {}, callback);
        });
    });

    //--------------------------------------
    // Program Accounts
    //--------------------------------------

    /** @test {Hyperwallet#getProgramAccount} */
    describe("getProgramAccount()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getProgramAccount} */
        it("should throw error if programToken is missing", () => {
            const callback = () => null;
            expect(() => client.getProgramAccount(undefined, undefined, callback)).to.throw("programToken is required");
        });

        /** @test {Hyperwallet#getProgramAccount} */
        it("should throw error if accountToken is missing", () => {
            const callback = () => null;
            expect(() => client.getProgramAccount("test-program-token", undefined, callback)).to.throw("accountToken is required");
        });

        /** @test {Hyperwallet#getProgramAccount} */
        it("should do get call if programToken is provided", () => {
            const callback = () => null;
            client.getProgramAccount("test-program-token", "test-account-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("programs/test-program-token/accounts/test-account-token", {}, callback);
        });
    });

    //--------------------------------------
    // Transfer Method Configurations
    //--------------------------------------

    /** @test {Hyperwallet#getTransferMethodConfiguration} */
    describe("getTransferMethodConfiguration()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getTransferMethodConfiguration} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.getTransferMethodConfiguration(undefined, undefined, undefined, undefined, undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#getTransferMethodConfiguration} */
        it("should throw error if country is missing", () => {
            const callback = () => null;
            expect(() => client.getTransferMethodConfiguration("test-user-token", undefined, undefined, undefined, undefined, callback)).to.throw("country is required");
        });

        /** @test {Hyperwallet#getTransferMethodConfiguration} */
        it("should throw error if currency is missing", () => {
            const callback = () => null;
            expect(() => client.getTransferMethodConfiguration("test-user-token", "test-country", undefined, undefined, undefined, callback)).to.throw("currency is required");
        });

        /** @test {Hyperwallet#getTransferMethodConfiguration} */
        it("should throw error if type is missing", () => {
            const callback = () => null;
            expect(() => client.getTransferMethodConfiguration("test-user-token", "test-country", "test-currency", undefined, undefined, callback)).to.throw("type is required");
        });

        /** @test {Hyperwallet#getTransferMethodConfiguration} */
        it("should throw error if profileType is missing", () => {
            const callback = () => null;
            expect(() => client.getTransferMethodConfiguration("test-user-token", "test-country", "test-currency", "test-type", undefined, callback)).to.throw("profileType is required");
        });

        /** @test {Hyperwallet#getTransferMethodConfiguration} */
        it("should do get call if userToken, country, currency, type and profileType is provided", () => {
            const callback = () => null;
            client.getTransferMethodConfiguration("test-user-token", "test-country", "test-currency", "test-type", "test-profile-type", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("transfer-method-configurations", {
                userToken: "test-user-token",
                country: "test-country",
                currency: "test-currency",
                type: "test-type",
                profileType: "test-profile-type",
            }, callback);
        });
    });

    /** @test {Hyperwallet#listTransferMethodConfigurations} */
    describe("listTransferMethodConfigurations()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listTransferMethodConfigurations} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listTransferMethodConfigurations(undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listTransferMethodConfigurations} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listTransferMethodConfigurations("test-user-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("transfer-method-configurations", {
                test: "value",
                userToken: "test-user-token",
            });
        });

        /** @test {Hyperwallet#listTransferMethodConfigurations} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listTransferMethodConfigurations("test-user-token", undefined, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("transfer-method-configurations", {
                userToken: "test-user-token",
            });
        });

        /** @test {Hyperwallet#listTransferMethodConfigurations} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listTransferMethodConfigurations("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("transfer-method-configurations", {
                userToken: "test-user-token",
            });

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    describe("createTransferMethod()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createTransferMethod} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            const userToken = null;
            const cacheToken = null;

            expect(() => client.createTransferMethod(userToken, cacheToken, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#createTransferMethod} */
        it("should throw error if cacheToken is missing", () => {
            const callback = () => null;
            const userToken = "test-user-token";
            const cacheToken = null;

            expect(() => client.createTransferMethod(userToken, cacheToken, callback)).to.throw("jsonCacheToken is required");
        });

        /** @test {Hyperwallet#createTransferMethod} */
        it("should do post call with userToken and cacheToken", () => {
            const callback = () => null;
            const userToken = "test-user-token";
            const cacheToken = "test-cache-token";
            client.createTransferMethod(userToken, cacheToken, { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/transfer-methods", { test: "value" }, { "Json-Cache-Token": "test-cache-token" });
        });
    });

    //--------------------------------------
    // Receipts
    //--------------------------------------

    /** @test {Hyperwallet#listReceiptsForProgramAccount} */
    describe("listReceiptsForProgramAccount()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listReceiptsForProgramAccount} */
        it("should throw error if programToken is missing", () => {
            const callback = () => null;
            expect(() => client.listReceiptsForProgramAccount(undefined, undefined, {}, callback)).to.throw("programToken is required");
        });

        /** @test {Hyperwallet#listReceiptsForProgramAccount} */
        it("should throw error if accountToken is missing", () => {
            const callback = () => null;
            expect(() => client.listReceiptsForProgramAccount("test-program-token", undefined, {}, callback)).to.throw("accountToken is required");
        });

        /** @test {Hyperwallet#listReceiptsForProgramAccount} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listReceiptsForProgramAccount("test-program-token", "test-account-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("programs/test-program-token/accounts/test-account-token/receipts", { test: "value" });
        });

        /** @test {Hyperwallet#listReceiptsForProgramAccount} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listReceiptsForProgramAccount("test-program-token", "test-account-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("programs/test-program-token/accounts/test-account-token/receipts", {});
        });

        /** @test {Hyperwallet#listReceiptsForProgramAccount} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listReceiptsForProgramAccount("test-program-token", "test-account-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("programs/test-program-token/accounts/test-account-token/receipts", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    /** @test {Hyperwallet#listReceiptsForUser} */
    describe("listReceiptsForUser()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listReceiptsForUser} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listReceiptsForUser(undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listReceiptsForUser} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listReceiptsForUser("test-user-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/receipts", { test: "value" });
        });

        /** @test {Hyperwallet#listReceiptsForUser} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listReceiptsForUser("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/receipts", {});
        });

        /** @test {Hyperwallet#listReceiptsForUser} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listReceiptsForUser("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/receipts", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    /** @test {Hyperwallet#listReceiptsForPrepaidCard} */
    describe("listReceiptsForPrepaidCard()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listReceiptsForPrepaidCard} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listReceiptsForPrepaidCard(undefined, undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listReceiptsForPrepaidCard} */
        it("should throw error if prepaidCardToken is missing", () => {
            const callback = () => null;
            expect(() => client.listReceiptsForPrepaidCard("test-user-token", undefined, {}, callback)).to.throw("prepaidCardToken is required");
        });

        /** @test {Hyperwallet#listReceiptsForPrepaidCard} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listReceiptsForPrepaidCard("test-user-token", "test-prepaid-card-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards/test-prepaid-card-token/receipts", { test: "value" });
        });

        /** @test {Hyperwallet#listReceiptsForPrepaidCard} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listReceiptsForPrepaidCard("test-user-token", "test-prepaid-card-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards/test-prepaid-card-token/receipts", {});
        });

        /** @test {Hyperwallet#listReceiptsForPrepaidCard} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listReceiptsForPrepaidCard("test-user-token", "test-prepaid-card-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards/test-prepaid-card-token/receipts", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    //--------------------------------------
    // Webhooks
    //--------------------------------------

    describe("listWebhookNotifications()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listWebhookNotifications} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listWebhookNotifications({ test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("webhook-notifications", { test: "value" });
        });

        /** @test {Hyperwallet#listWebhookNotifications} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listWebhookNotifications({}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("webhook-notifications", {});
        });

        /** @test {Hyperwallet#listWebhookNotifications} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listWebhookNotifications({}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("webhook-notifications", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    describe("getWebhookNotification", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getWebhookNotification} */
        it("should throw error if webhookToken is missing", () => {
            const callback = () => null;
            expect(() => client.getWebhookNotification(undefined, {}, callback)).to.throw("webhookToken is required");
        });

        /** @test {Hyperwallet#getWebhookNotification} */
        it("should do get call if webhookToken is provided", () => {
            const callback = () => null;
            client.getWebhookNotification("webhook-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("webhook-notifications/webhook-token", {}, callback);
        });
    });

    //--------------------------------------
    // Internal utils
    //--------------------------------------

    describe("addProgramToken()", () => {
        it("should do nothing if no data is provided", () => {
            const client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });

            expect(client.addProgramToken()).to.be.undefined();
        });

        it("should do nothing if no programToken is set", () => {
            const client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });

            client.addProgramToken({ test: "value" }).should.be.deep.equal({ test: "value" });
        });

        it("should do nothing if programToken is set in data", () => {
            const client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
                programToken: "test-program-token",
            });

            client.addProgramToken({ test: "value", programToken: "my-program-token" }).should.be.deep.equal({ test: "value", programToken: "my-program-token" });
        });

        it("should add programToken if no programToken is set in data", () => {
            const client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
                programToken: "test-program-token",
            });

            client.addProgramToken({ test: "value" }).should.be.deep.equal({ test: "value", programToken: "test-program-token" });
        });
    });

    describe("handle204Response()", () => {
        it("should return a 'function' with a argument", () => {
            Hyperwallet.handle204Response(() => null).should.be.a("function");
        });

        it("should do nothing for errors", (cb) => {
            const providedErr = new Error("Test");
            const providedData = {
                test: "value",
            };
            const providedRes = {
                status: 200,
            };

            const callback = Hyperwallet.handle204Response((err, data, res) => {
                err.should.be.deep.equal(providedErr);
                data.should.be.deep.equal(providedData);
                res.should.be.deep.equal(providedRes);

                cb();
            });
            callback(providedErr, providedData, providedRes);
        });

        it("should do nothing for non 204 responses", (cb) => {
            const providedData = {
                test: "value",
            };
            const providedRes = {
                status: 200,
            };

            const callback = Hyperwallet.handle204Response((err, data, res) => {
                expect(err).to.be.undefined();

                data.should.be.deep.equal(providedData);
                res.should.be.deep.equal(providedRes);

                cb();
            });
            callback(undefined, providedData, providedRes);
        });

        it("should return empty list for 204 responses", (cb) => {
            const providedData = {
                test: "value",
            };
            const providedRes = {
                status: 204,
            };

            const callback = Hyperwallet.handle204Response((err, data, res) => {
                expect(err).to.be.undefined();

                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });
                res.should.be.deep.equal(providedRes);

                cb();
            });
            callback(undefined, providedData, providedRes);
        });
    });

    //--------------------------------------
    // Venmo accounts
    //--------------------------------------

    /** @test {Hyperwallet#createVenmoAccount} */
    describe("createVenmoAccount()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createVenmoAccount} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.createVenmoAccount(undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#createVenmoAccount} */
        it("should throw error if transferMethodCountry is missing", () => {
            const callback = () => null;
            expect(() => client.createVenmoAccount("test-user-token", { test: "value" }, callback)).to.throw("transferMethodCountry is required");
        });

        /** @test {Hyperwallet#createVenmoAccount} */
        it("should throw error if transferMethodCurrency is missing", () => {
            const callback = () => null;
            expect(() => client.createVenmoAccount("test-user-token", {
                transferMethodCountry: "test-transferMethodCountry",
            }, callback)).to.throw("transferMethodCurrency is required");
        });

        /** @test {Hyperwallet#createVenmoAccount} */
        it("should throw error if accountId is missing", () => {
            const callback = () => null;
            expect(() => client.createVenmoAccount("test-user-token", {
                transferMethodCountry: "test-transferMethodCountry",
                transferMethodCurrency: "test-transferMethodCurrency",
            }, callback)).to.throw("Account is required");
        });

        /** @test {Hyperwallet#createVenmoAccount} */
        it("should do post call to venmo account endpoint", () => {
            const callback = () => null;
            client.createVenmoAccount("test-user-token", {
                transferMethodCountry: "test-transferMethodCountry",
                transferMethodCurrency: "test-transferMethodCurrency",
                accountId: "accountId",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/venmo-accounts", {
                transferMethodCountry: "test-transferMethodCountry",
                transferMethodCurrency: "test-transferMethodCurrency",
                accountId: "accountId",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#getVenmoAccount} */
    describe("getVenmoAccount()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getVenmoAccount} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.getVenmoAccount(undefined, undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#getVenmoAccount} */
        it("should throw error if venmoAccountToken is missing", () => {
            const callback = () => null;
            expect(() => client.getVenmoAccount("test-user-token", undefined, callback)).to.throw("venmoAccountToken is required");
        });

        /** @test {Hyperwallet#getVenmoAccount} */
        it("should do get call if userToken and venmoAccountToken is provided", () => {
            const callback = () => null;
            client.getVenmoAccount("test-user-token", "test-venmo-account-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/venmo-accounts/test-venmo-account-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#listVenmoAccounts} */
    describe("listVenmoAccounts()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listVenmoAccounts} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listVenmoAccounts(undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listVenmoAccounts} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listVenmoAccounts("test-user-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/venmo-accounts", { test: "value" });
        });

        /** @test {Hyperwallet#listVenmoAccounts} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listVenmoAccounts("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/venmo-accounts", {});
        });

        /** @test {Hyperwallet#listVenmoAccounts} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listVenmoAccounts("test-user-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/venmo-accounts", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });

    /** @test {Hyperwallet#updateVenmoAccount} */
    describe("updateVenmoAccount()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPut: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#updateVenmoAccount} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.updateVenmoAccount(undefined, undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#updateVenmoAccount} */
        it("should throw error if venmoAccountToken is missing", () => {
            const callback = () => null;
            expect(() => client.updateVenmoAccount("test-user-token", undefined, { test: "value" }, callback)).to.throw("venmoAccountToken is required");
        });

        /** @test {Hyperwallet#updateVenmoAccount} */
        it("should do put call to venmo accounts endpoint", () => {
            const callback = () => null;
            client.updateVenmoAccount("test-user-token", "test-venmo-account-token", {
                test: "value",
            }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/venmo-accounts/test-venmo-account-token", {
                test: "value",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#deactivateVenmoAccount} */
    describe("deactivateVenmoAccount()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#deactivateVenmoAccount} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.deactivateVenmoAccount(undefined, undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#deactivateVenmoAccount} */
        it("should throw error if venmoAccountToken is missing", () => {
            const callback = () => null;
            expect(() => client.deactivateVenmoAccount("test-user-token", undefined, callback)).to.throw("venmoAccountToken is required");
        });

        /** @test {Hyperwallet#deactivateVenmoAccount} */
        it("should send transition to 'DE-ACTIVATED'", () => {
            const callback = () => null;
            client.deactivateVenmoAccount("test-user-token", "test-venmo-account-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/venmo-accounts/test-venmo-account-token/status-transitions", {
                transition: "DE-ACTIVATED",
            }, {}, callback);
        });
    });

    /** @test {Hyperwallet#createVenmoAccountStatusTransition} */
    describe("createVenmoAccountStatusTransition()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doPost: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#createVenmoAccountStatusTransition} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.createVenmoAccountStatusTransition(undefined, undefined, { test: "value" }, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#createVenmoAccountStatusTransition} */
        it("should throw error if venmoAccountToken is missing", () => {
            const callback = () => null;
            expect(() => client.createVenmoAccountStatusTransition("test-user-token", undefined, { test: "value" }, callback)).to.throw("venmoAccountToken is required");
        });

        /** @test {Hyperwallet#createVenmoAccountStatusTransition} */
        it("should send post call to venmo account status transition endpoint", () => {
            const callback = () => null;
            client.createVenmoAccountStatusTransition("test-user-token", "test-venmo-account-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/venmo-accounts/test-venmo-account-token/status-transitions", {
                test: "value",
            }, {}, callback);
        });
    });


    /** @test {Hyperwallet#getVenmoAccountStatusTransition} */
    describe("getVenmoAccountStatusTransition()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#getVenmoAccountStatusTransition} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.getVenmoAccountStatusTransition(undefined, undefined, undefined, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#getVenmoAccountStatusTransition} */
        it("should throw error if venmoAccountToken is missing", () => {
            const callback = () => null;
            expect(() => client.getVenmoAccountStatusTransition("test-user-token", undefined, undefined, callback)).to.throw("venmoAccountToken is required");
        });

        /** @test {Hyperwallet#getVenmoAccountStatusTransition} */
        it("should throw error if statusTransitionToken is missing", () => {
            const callback = () => null;
            expect(() => client.getVenmoAccountStatusTransition("test-user-token", "test-venmo-account-token", undefined, callback)).to.throw("statusTransitionToken is required");
        });

        /** @test {Hyperwallet#getVenmoAccountStatusTransition} */
        it("should do get call if userToken, venmoAccountToken and statusTransitionToken is provided", () => {
            const callback = () => null;
            client.getVenmoAccountStatusTransition("test-user-token", "test-venmo-account-token", "status-transition-token", callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/venmo-accounts/test-venmo-account-token/status-transitions/status-transition-token", {}, callback);
        });
    });

    /** @test {Hyperwallet#listVenmoAccountStatusTransitions} */
    describe("listVenmoAccountStatusTransitions()", () => {
        let client;
        let apiClientSpy;

        beforeEach(() => {
            apiClientSpy = sinon.spy();
            client = new Hyperwallet({
                username: "test-username",
                password: "test-password",
            });
            client.client = {
                doGet: apiClientSpy,
            };
        });

        /** @test {Hyperwallet#listVenmoAccountStatusTransitions} */
        it("should throw error if userToken is missing", () => {
            const callback = () => null;
            expect(() => client.listVenmoAccountStatusTransitions(undefined, undefined, {}, callback)).to.throw("userToken is required");
        });

        /** @test {Hyperwallet#listVenmoAccountStatusTransitions} */
        it("should throw error if venmoAccountToken is missing", () => {
            const callback = () => null;
            expect(() => client.listVenmoAccountStatusTransitions("test-user-token", undefined, {}, callback)).to.throw("venmoAccountToken is required");
        });

        /** @test {Hyperwallet#listVenmoAccountStatusTransitions} */
        it("should do get call with options", () => {
            const callback = () => null;
            client.listVenmoAccountStatusTransitions("test-user-token", "test-venmo-account-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/venmo-accounts/test-venmo-account-token/status-transitions", { test: "value" });
        });

        /** @test {Hyperwallet#listVenmoAccountStatusTransitions} */
        it("should do get call without options", () => {
            const callback = () => null;
            client.listVenmoAccountStatusTransitions("test-user-token", "test-venmo-account-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/venmo-accounts/test-venmo-account-token/status-transitions", {});
        });

        /** @test {Hyperwallet#listVenmoAccountStatusTransitions} */
        it("should handle 204 return", (cb) => {
            const callback = (err, data) => {
                data.should.be.deep.equal({
                    count: 0,
                    data: [],
                });

                cb();
            };
            client.listVenmoAccountStatusTransitions("test-user-token", "test-venmo-account-token", {}, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/venmo-accounts/test-venmo-account-token/status-transitions", {});

            apiClientSpy.getCall(0).args[2](undefined, {}, {
                status: 204,
            });
        });
    });
});
