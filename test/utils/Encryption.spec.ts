import path from 'path';
import nock from 'nock';
import fs from 'fs';
import { Encryption } from 'hyperwallet';

/** @test {Encryption} */
describe('utils/Encryption', () => {
  /** @test {Encryption#constructor} */
  describe('constructor()', () => {
    /** @test {Encryption#constructor} */
    it('should set default values for encryption properties', () => {
      const encryption = new Encryption(
        'clientPrivateKeySetLocation',
        'hyperwalletKeySetLocation'
      );

      encryption.clientPrivateKeySetLocation.should.be.equal(
        'clientPrivateKeySetLocation'
      );
      encryption.hyperwalletKeySetLocation.should.be.equal(
        'hyperwalletKeySetLocation'
      );
      encryption.encryptionAlgorithm.should.be.equal('RSA-OAEP-256');
      encryption.signAlgorithm.should.be.equal('RS256');
      encryption.encryptionMethod.should.be.equal('A256CBC-HS512');
      encryption.jwsExpirationMinutes.should.be.equal(5);
    });

    /** @test {Encryption#constructor} */
    it('should set encryption properties by constructor', () => {
      const encryption = new Encryption(
        'clientPrivateKeySetLocation',
        'hyperwalletKeySetLocation',
        'encryptionAlgorithm',
        'signAlgorithm',
        'encryptionMethod',
        12
      );

      encryption.clientPrivateKeySetLocation.should.be.equal(
        'clientPrivateKeySetLocation'
      );
      encryption.hyperwalletKeySetLocation.should.be.equal(
        'hyperwalletKeySetLocation'
      );
      encryption.encryptionAlgorithm.should.be.equal('encryptionAlgorithm');
      encryption.signAlgorithm.should.be.equal('signAlgorithm');
      encryption.encryptionMethod.should.be.equal('encryptionMethod');
      encryption.jwsExpirationMinutes.should.be.equal(12);
    });
  });

  /** @test {Encryption#encrypt} */
  describe('encrypt()', () => {
    let encryption: Encryption;
    let testMessage: { message: string };
    let clientPath: string;
    let hwPath: string;

    beforeEach(() => {
      clientPath = path.join(__dirname, '..', 'resources', 'private-jwkset1');
      hwPath = path.join(__dirname, '..', 'resources', 'public-jwkset1');
      encryption = new Encryption(clientPath, hwPath);
      testMessage = {
        message: 'Test message'
      };
    });

    /** @test {Encryption#encrypt} */
    it('should successfully encrypt and decrypt text message', async () => {
      return encryption.encrypt(testMessage).then(encryptedBody => {
        encryption.decrypt(encryptedBody).then(decryptedBody => {
          decryptedBody.payload
            .toString('utf8')
            .should.be.deep.equal(JSON.stringify(testMessage));
        });
      });
    });

    /** @test {Encryption#encrypt} */
    it('should successfully decode and encode encrypted text message', async () => {
      return encryption.encrypt(testMessage).then(encryptedBody => {
        const decodedMessage = encryption.base64Decode(encryptedBody);
        const encodedMessage = encryption.base64Encode(decodedMessage);
        encodedMessage.should.be.deep.equal(encryptedBody);
      });
    });

    /** @test {Encryption#encrypt} */
    it('should throw exception when wrong jwk key set location is given', async () => {
      encryption = new Encryption('wrong_keyset_path', hwPath);

      return encryption.encrypt(testMessage).catch(error => {
        error.message.should.be.equal(
          'Wrong JWK set location path = wrong_keyset_path'
        );
      });
    });

    /** @test {Encryption#encrypt} */
    it('should throw exception when wrong jwk key is set for encryption', async () => {
      encryption = new Encryption(clientPath, hwPath, 'RS256');

      return encryption.encrypt(testMessage).catch(error => {
        error.message.should.be.equal(
          'Failed to encrypt payload with key id = 2018_sig_rsa_RS256_2048'
        );
      });
    });

    /** @test {Encryption#encrypt} */
    it("should throw exception when signing body with key algorithm that doesn't present in jwkset", async () => {
      encryption = new Encryption(
        clientPath,
        hwPath,
        'RSA-OAEP-256',
        'RS256-not-present'
      );

      return encryption.encrypt(testMessage).catch(error => {
        error.message.should.be.equal(
          "JWK set doesn't contain key with algorithm = RS256-not-present"
        );
      });
    });

    /** @test {Encryption#encrypt} */
    it('should throw exception when signing body with wrong jwk key', async () => {
      encryption = new Encryption(
        clientPath,
        hwPath,
        'RSA-OAEP-256',
        'RSA-OAEP-256'
      );

      return encryption.encrypt(testMessage).catch(error => {
        error.message.should.be.equal(
          'Failed to sign with key id = 2018_enc_rsa_RSA-OAEP-256'
        );
      });
    });

    /** @test {Encryption#encrypt} */
    it('should throw exception when jwk keyset file is invalid', async () => {
      encryption = new Encryption(
        path.join(__dirname, '..', 'resources', 'jwkset-invalid'),
        hwPath
      );

      return encryption.encrypt(testMessage).catch(error => {
        error.message.should.be.equal(
          'Failed to create keyStore from given jwkSet'
        );
      });
    });

    /** @test {Encryption#encrypt} */
    it('should throw exception when jwk keyset file location is wrong', async () => {
      encryption = new Encryption(
        path.join(__dirname, '..', 'resources'),
        hwPath
      );

      return encryption.encrypt(testMessage).catch(error => {
        error.message.should.be.equal(
          'EISDIR: illegal operation on a directory, read'
        );
      });
    });

    /** @test {Encryption#encrypt} */
    it('should successfully encrypt and decrypt text message with url keyset path', async () => {
      fs.readFile(clientPath, { encoding: 'utf-8' }, (err, keySetData) => {
        nock('https://test-server')
          .get('/test')
          .reply(200, keySetData)
          .get('/test')
          .reply(200, keySetData);
        encryption = new Encryption('https://test-server/test', hwPath);
        const encryption2 = new Encryption(clientPath, hwPath);

        return encryption.encrypt(testMessage).then(encryptedBody => {
          encryption2.decrypt(encryptedBody).then(decryptedBody => {
            decryptedBody.payload
              .toString('utf8')
              .should.be.deep.equal(JSON.stringify(testMessage));
          });
        });
      });
    });

    /** @test {Encryption#encrypt} */
    it('should throw exception when not supported encryption algorithm is given', async () => {
      encryption = new Encryption(
        clientPath,
        hwPath,
        'unsupported_encryption_algorithm'
      );

      return encryption.encrypt(testMessage).catch(error => {
        error.message.should.be.equal(
          "JWK set doesn't contain key with algorithm = unsupported_encryption_algorithm"
        );
      });
    });
  });

  /** @test {Encryption#decrypt} */
  describe('decrypt()', () => {
    let encryption: Encryption;
    let testMessage: { message: string };
    let clientPath: string;
    let clientPath2: string;
    let hwPath: string;
    let hwPath2: string;

    beforeEach(() => {
      clientPath = path.join(__dirname, '..', 'resources', 'private-jwkset1');
      hwPath = path.join(__dirname, '..', 'resources', 'public-jwkset1');
      clientPath2 = path.join(__dirname, '..', 'resources', 'private-jwkset2');
      hwPath2 = path.join(__dirname, '..', 'resources', 'public-jwkset2');
      encryption = new Encryption(clientPath, hwPath);
      testMessage = {
        message: 'Test message'
      };
    });

    /** @test {Encryption#decrypt} */
    it('should fail decryption when wrong private key is used', async () => {
      const encryption2 = new Encryption(clientPath2, hwPath2);

      return encryption.encrypt(testMessage).then(encryptedBody => {
        encryption2.decrypt(encryptedBody).catch(error => {
          error.message.should.be.equal(
            'Failed to decrypt payload with key id = 2018_enc_rsa_RSA-OAEP-256'
          );
        });
      });
    });

    /** @test {Encryption#decrypt} */
    it('should fail decryption when sign algorithm is not found in keyset', async () => {
      const encryption2 = new Encryption(
        clientPath,
        hwPath,
        'RSA-OAEP-256',
        'RS256-OAEP-256'
      );

      return encryption.encrypt(testMessage).then(encryptedBody => {
        encryption2.decrypt(encryptedBody).catch(error => {
          error.message.should.be.equal(
            "JWK set doesn't contain key with algorithm = RS256-OAEP-256"
          );
        });
      });
    });

    /** @test {Encryption#decrypt} */
    it('should fail decryption when algorithm is not found in jwkset', async () => {
      const encryption2 = new Encryption(
        clientPath,
        hwPath,
        'RSA-OAEP-256-absent'
      );

      return encryption.encrypt(testMessage).then(encryptedBody => {
        encryption2.decrypt(encryptedBody).catch(error => {
          error.message.should.be.equal(
            "JWK set doesn't contain key with algorithm = RSA-OAEP-256-absent"
          );
        });
      });
    });

    /** @test {Encryption#decrypt} */
    it('should fail signature verification when wrong public key is used', async () => {
      const encryption2 = new Encryption(clientPath, hwPath2);

      return encryption.encrypt(testMessage).then(encryptedBody => {
        encryption2.decrypt(encryptedBody).catch(error => {
          error.message.should.be.equal(
            'Failed to verify signature with key id = 2018_sig_rsa_RS256_2048'
          );
        });
      });
    });

    /** @test {Encryption#decrypt} */
    it('should throw exception when jws signature has expired', async () => {
      const encryption2 = new Encryption(
        clientPath,
        hwPath2,
        'RSA-OAEP-256',
        'RS256',
        'A256CBC-HS512',
        -5
      );

      return encryption2.encrypt(testMessage).then(() => {
        encryption2.signBody(testMessage).then(signedBody => {
          encryption2.checkSignature(signedBody.toString()).catch(error => {
            error.message.should.be.equal('JWS signature has expired');
          });
        });
      });
    });
  });
});
