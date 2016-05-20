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
            client.client.server.should.be.equal("https://sandbox.hyperwallet.com");
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
            client.listUsers({ test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users", { test: "value" });
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
            client.listPrepaidCards("test-user-token", { test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("users/test-user-token/prepaid-cards", { test: "value" });
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
            client.listPayments({ test: "value" }, callback);

            apiClientSpy.should.have.been.calledOnce();
            apiClientSpy.should.have.been.calledWith("payments", { test: "value" });
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
});
