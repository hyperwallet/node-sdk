import path from "path";
import nock from "nock";
import fs from "fs";
import Encryption from "../../src/utils/Encryption";

/** @test {Encryption} */
describe("utils/Encryption", () => {
    /** @test {Encryption#constructor} */
    describe("constructor()", () => {
        /** @test {Encryption#constructor} */
        it("should set default values for encryption properties", () => {
            const encryption = new Encryption("clientPrivateKeySetLocation", "hyperwalletKeySetLocation");

            encryption.clientPrivateKeySetLocation.should.be.equal("clientPrivateKeySetLocation");
            encryption.hyperwalletKeySetLocation.should.be.equal("hyperwalletKeySetLocation");
            encryption.encryptionAlgorithm.should.be.equal("RSA-OAEP-256");
            encryption.signAlgorithm.should.be.equal("RS256");
            encryption.encryptionMethod.should.be.equal("A256CBC-HS512");
            encryption.jwsExpirationMinutes.should.be.equal(5);
        });

        /** @test {Encryption#constructor} */
        it("should set encryption properties by constructor", () => {
            const encryption = new Encryption("clientPrivateKeySetLocation", "hyperwalletKeySetLocation",
                "encryptionAlgorithm", "signAlgorithm", "encryptionMethod", 12);

            encryption.clientPrivateKeySetLocation.should.be.equal("clientPrivateKeySetLocation");
            encryption.hyperwalletKeySetLocation.should.be.equal("hyperwalletKeySetLocation");
            encryption.encryptionAlgorithm.should.be.equal("encryptionAlgorithm");
            encryption.signAlgorithm.should.be.equal("signAlgorithm");
            encryption.encryptionMethod.should.be.equal("encryptionMethod");
            encryption.jwsExpirationMinutes.should.be.equal(12);
        });
    });

    /** @test {Encryption#encrypt} */
    describe("encrypt()", () => {
        let encryption;
        let testMessage;
        let clientPath;
        let hwPath;

        beforeEach(() => {
            clientPath = path.join(__dirname, "..", "resources", "private-jwkset1");
            hwPath = path.join(__dirname, "..", "resources", "public-jwkset1");
            encryption = new Encryption(clientPath, hwPath);
            testMessage = {
                message: "Test message",
            };
        });

        /** @test {Encryption#encrypt} */
        it("should successfully encrypt and decrypt text message", (cb) => {
            encryption.encrypt(testMessage).then((encryptedBody) => {
                encryption.decrypt(encryptedBody).then((decryptedBody) => {
                    decryptedBody.payload.toString("utf8").should.be.deep.equal(JSON.stringify(testMessage));
                    cb();
                });
            });
        });

        /** @test {Encryption#encrypt} */
        it("should successfully decode and encode encrypted text message", (cb) => {
            encryption.encrypt(testMessage).then((encryptedBody) => {
                const decodedMessage = encryption.base64Decode(encryptedBody);
                const encodedMessage = encryption.base64Encode(decodedMessage);
                encodedMessage.should.be.deep.equal(encryptedBody);
                cb();
            });
        });

        /** @test {Encryption#encrypt} */
        it("should throw exception when wrong jwk key set location is given", (cb) => {
            encryption = new Encryption("wrong_keyset_path", hwPath);
            encryption.encrypt(testMessage)
            .catch((error) => {
                error.message.should.be.equal("Wrong JWK set location path = wrong_keyset_path");
                cb();
            });
        });

        /** @test {Encryption#encrypt} */
        it("should throw exception when wrong jwk key is set for encryption", (cb) => {
            encryption = new Encryption(clientPath, hwPath, "RS256");
            encryption.encrypt(testMessage)
            .catch((error) => {
                error.message.should.be.equal("Failed to encrypt payload with key id = 2018_sig_rsa_RS256_2048");
                cb();
            });
        });

        /** @test {Encryption#encrypt} */
        it("should throw exception when signing body with key algorithm that doesn't present in jwkset", (cb) => {
            encryption = new Encryption(clientPath, hwPath, "RSA-OAEP-256", "RS256-not-present");
            encryption.encrypt(testMessage)
            .catch((error) => {
                error.message.should.be.equal("JWK set doesn't contain key with algorithm = RS256-not-present");
                cb();
            });
        });

        /** @test {Encryption#encrypt} */
        it("should throw exception when signing body with wrong jwk key", (cb) => {
            encryption = new Encryption(clientPath, hwPath, "RSA-OAEP-256", "RSA-OAEP-256");
            encryption.encrypt(testMessage)
            .catch((error) => {
                error.message.should.be.equal("Failed to sign with key id = 2018_enc_rsa_RSA-OAEP-256");
                cb();
            });
        });

        /** @test {Encryption#encrypt} */
        it("should throw exception when jwk keyset file is invalid", (cb) => {
            encryption = new Encryption(path.join(__dirname, "..", "resources", "jwkset-invalid"), hwPath);
            encryption.encrypt(testMessage)
            .catch((error) => {
                error.message.should.be.equal("Failed to create keyStore from given jwkSet");
                cb();
            });
        });

        /** @test {Encryption#encrypt} */
        it("should throw exception when jwk keyset file location is wrong", (cb) => {
            encryption = new Encryption(path.join(__dirname, "..", "resources"), hwPath);
            encryption.encrypt(testMessage)
            .catch((error) => {
                error.message.should.be.equal("Error: EISDIR: illegal operation on a directory, read");
                cb();
            });
        });

		/** @test {Encryption#encrypt} */
        it("should successfully encrypt and decrypt text message with url keyset path", (cb) => {
            fs.readFile(clientPath, { encoding: "utf-8" }, (err, keySetData) => {
                nock("https://test-server")
                    .get("/test")
                    .reply(200, keySetData)
                    .get("/test")
                    .reply(200, keySetData);
                encryption = new Encryption("https://test-server/test", hwPath);
                const encryption2 = new Encryption(clientPath, hwPath);
                encryption.encrypt(testMessage).then((encryptedBody) => {
                    encryption2.decrypt(encryptedBody).then((decryptedBody) => {
                        decryptedBody.payload.toString("utf8").should.be.deep.equal(JSON.stringify(testMessage));
                        cb();
                    });
                });
            });
        });

        /** @test {Encryption#encrypt} */
        it("should throw exception when not supported encryption algorithm is given", (cb) => {
            encryption = new Encryption(clientPath, hwPath, "unsupported_encryption_algorithm");
            encryption.encrypt(testMessage)
            .catch((error) => {
                error.message.should.be.equal("JWK set doesn't contain key with algorithm = unsupported_encryption_algorithm");
                cb();
            });
        });
    });

    /** @test {Encryption#decrypt} */
    describe("decrypt()", () => {
        let encryption;
        let testMessage;
        let clientPath;
        let clientPath2;
        let hwPath;
        let hwPath2;

        beforeEach(() => {
            clientPath = path.join(__dirname, "..", "resources", "private-jwkset1");
            hwPath = path.join(__dirname, "..", "resources", "public-jwkset1");
            clientPath2 = path.join(__dirname, "..", "resources", "private-jwkset2");
            hwPath2 = path.join(__dirname, "..", "resources", "public-jwkset2");
            encryption = new Encryption(clientPath, hwPath);
            testMessage = {
                message: "Test message",
            };
        });

        /** @test {Encryption#decrypt} */
        it("should fail decryption when wrong private key is used", (cb) => {
            const encryption2 = new Encryption(clientPath2, hwPath2);
            encryption.encrypt(testMessage).then((encryptedBody) => {
                encryption2.decrypt(encryptedBody)
                .catch((error) => {
                    error.message.should.be.equal("Failed to decrypt payload with key id = 2018_enc_rsa_RSA-OAEP-256");
                    cb();
                });
            });
        });

        /** @test {Encryption#decrypt} */
        it("should fail decryption when sign algorithm is not found in keyset", (cb) => {
            const encryption2 = new Encryption(clientPath, hwPath, "RSA-OAEP-256", "RS256-OAEP-256");
            encryption.encrypt(testMessage).then((encryptedBody) => {
                encryption2.decrypt(encryptedBody)
                .catch((error) => {
                    error.message.should.be.equal("JWK set doesn't contain key with algorithm = RS256-OAEP-256");
                    cb();
                });
            });
        });

        /** @test {Encryption#decrypt} */
        it("should fail decryption when algorithm is not found in jwkset", (cb) => {
            const encryption2 = new Encryption(clientPath, hwPath, "RSA-OAEP-256-absent");
            encryption.encrypt(testMessage).then((encryptedBody) => {
                encryption2.decrypt(encryptedBody)
                .catch((error) => {
                    error.message.should.be.equal("JWK set doesn't contain key with algorithm = RSA-OAEP-256-absent");
                    cb();
                });
            });
        });

        /** @test {Encryption#decrypt} */
        it("should fail signature verification when wrong public key is used", (cb) => {
            const encryption2 = new Encryption(clientPath, hwPath2);
            encryption.encrypt(testMessage).then((encryptedBody) => {
                encryption2.decrypt(encryptedBody)
                .catch((error) => {
                    error.message.should.be.equal("Failed to verify signature with key id = 2018_sig_rsa_RS256_2048");
                    cb();
                });
            });
        });

        /** @test {Encryption#decrypt} */
        it("should throw exception when jws signature has expired", (cb) => {
            const encryption2 = new Encryption(clientPath, hwPath2, "RSA-OAEP-256", "RS256", "A256CBC-HS512", -5);
            encryption2.encrypt(testMessage).then(() => {
                encryption2.signBody(testMessage).then((signedBody) => {
                    encryption2.checkSignature(signedBody)
                    .catch((error) => {
                        error.message.should.be.equal("JWS signature has expired");
                        cb();
                    });
                });
            });
        });
    });
});
