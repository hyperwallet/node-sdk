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
