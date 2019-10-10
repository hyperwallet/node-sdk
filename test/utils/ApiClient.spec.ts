import chai, { expect } from 'chai';
import dirtyChai from 'dirty-chai';
import nock from 'nock';
import path from 'path';

import { ApiClient, Encryption } from '@truebill/hyperwallet-sdk';
import { fail } from 'assert';

const packageJson = require('../../package.json');

chai.should();
chai.use(dirtyChai);

/** @test {ApiClient} */
describe('utils/ApiClient', () => {
  /** @test {ApiClient#constructor} */
  describe('constructor()', () => {
    /** @test {ApiClient#constructor} */
    it('should set provided values as private members', () => {
      const client = new ApiClient(
        'test-username',
        'test-password',
        'test-server'
      );

      client.username.should.be.equal('test-username');
      client.password.should.be.equal('test-password');
      client.server.should.be.equal('test-server');
    });

    /** @test {ApiClient#constructor} */
    it('should set the version to package.json version', () => {
      const client = new ApiClient(
        'test-username',
        'test-password',
        'test-server'
      );
      client.version.should.be.equal(packageJson.version);
    });
  });

  /** @test {ApiClient#doPost} */
  describe('doPost()', () => {
    let client: ApiClient;
    let authHeader;

    before(() => {
      nock.disableNetConnect();
    });
    after(() => {
      nock.enableNetConnect();
    });

    beforeEach(() => {
      client = new ApiClient(
        'test-username',
        'test-password',
        'https://test-server'
      );

      authHeader = 'Basic dGVzdC11c2VybmFtZTp0ZXN0LXBhc3N3b3Jk';
    });
    afterEach(() => {
      nock.cleanAll();
    });

    /** @test {ApiClient#doPost} */
    it('should return response if call was successful (with query parameters)', cb => {
      nock('https://test-server')
        .matchHeader('Authorization', authHeader)
        .matchHeader(
          'User-Agent',
          `Hyperwallet Node SDK v${packageJson.version}`
        )
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .post('/rest/v3/test', {
          test: 'value'
        })
        .query({ sort: 'test' })
        .reply(
          201,
          { response: 'value' },
          { 'Content-Type': 'application/json' }
        );

      client.doPost(
        'test',
        { test: 'value' },
        { sort: 'test' },
        (err, body, res) => {
          expect(err).to.be.undefined();

          expect(body).to.be.deep.equal({
            response: 'value'
          });

          res.status.should.be.equal(201);

          cb();
        }
      );
    });

    /** @test {ApiClient#doPost} */
    it('should return response if call was successful (with query parameters) when content type contains charset', cb => {
      nock('https://test-server')
        .matchHeader('Authorization', authHeader)
        .matchHeader(
          'User-Agent',
          `Hyperwallet Node SDK v${packageJson.version}`
        )
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .post('/rest/v3/test', {
          test: 'value'
        })
        .query({ sort: 'test' })
        .reply(
          201,
          { response: 'value' },
          {
            'Content-Type': 'application/json;charset=utf-8'
          }
        );

      client.doPost(
        'test',
        { test: 'value' },
        { sort: 'test' },
        (err, body, res) => {
          expect(err).to.be.undefined();

          expect(body).to.be.deep.equal({
            response: 'value'
          });

          res.status.should.be.equal(201);

          cb();
        }
      );
    });

    /** @test {ApiClient#doPost} */
    it('should return response if call was successful (with query parameters) when content type contains charset ahead', cb => {
      nock('https://test-server')
        .matchHeader('Authorization', authHeader)
        .matchHeader(
          'User-Agent',
          `Hyperwallet Node SDK v${packageJson.version}`
        )
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .post('/rest/v3/test', {
          test: 'value'
        })
        .query({ sort: 'test' })
        .reply(
          201,
          { response: 'value' },
          {
            'Content-Type': 'charset=utf-8;application/json'
          }
        );

      client.doPost(
        'test',
        { test: 'value' },
        { sort: 'test' },
        (err, body, res) => {
          expect(err).to.be.undefined();

          JSON.parse(body.toString('utf8')).should.be.deep.equal({
            response: 'value'
          });

          res.status.should.be.equal(201);

          cb();
        }
      );
    });

    /** @test {ApiClient#doPost} */
    it('should return response if call was successful (without query parameters)', cb => {
      nock('https://test-server')
        .matchHeader('Authorization', authHeader)
        .matchHeader(
          'User-Agent',
          `Hyperwallet Node SDK v${packageJson.version}`
        )
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .post('/rest/v3/test', {
          test: 'value'
        })
        .reply(
          201,
          { response: 'value' },
          { 'Content-Type': 'application/json' }
        );

      client.doPost('test', { test: 'value' }, {}, (err, body, res) => {
        expect(err).to.be.undefined();

        expect(body).to.be.deep.equal({
          response: 'value'
        });

        res.status.should.be.equal(201);

        cb();
      });
    });

    /** @test {ApiClient#doPost} */
    it('should return generic network error if no response was send by server', cb => {
      client.doPost('test', { test: 'value' }, {}, (err, body, res) => {
        expect(err).to.be.deep.equal([
          {
            message: 'Could not communicate with https://test-server',
            code: 'COMMUNICATION_ERROR'
          }
        ]);

        expect(body).to.be.undefined();
        expect(res).to.be.undefined();

        cb();
      });
    });

    /** @test {ApiClient#doPost} */
    it('should return error message if responses contains error', cb => {
      nock('https://test-server')
        .matchHeader('Authorization', authHeader)
        .matchHeader(
          'User-Agent',
          `Hyperwallet Node SDK v${packageJson.version}`
        )
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .post('/rest/v3/test', {
          test: 'value'
        })
        .reply(
          404,
          {
            errors: [
              {
                message: 'message',
                code: 'FORBIDDEN',
                relatedResources: [
                  'trm-f3d38df1-adb7-4127-9858-e72ebe682a79',
                  'trm-601b1401-4464-4f3f-97b3-09079ee7723b'
                ]
              }
            ]
          },
          { 'Content-Type': 'application/json' }
        );

      client.doPost('test', { test: 'value' }, {}, (err, body, res) => {
        expect(err).to.be.deep.equal([
          {
            message: 'message',
            code: 'FORBIDDEN',
            relatedResources: [
              'trm-f3d38df1-adb7-4127-9858-e72ebe682a79',
              'trm-601b1401-4464-4f3f-97b3-09079ee7723b'
            ]
          }
        ]);

        expect(body).to.be.deep.equal({
          errors: [
            {
              message: 'message',
              code: 'FORBIDDEN',
              relatedResources: [
                'trm-f3d38df1-adb7-4127-9858-e72ebe682a79',
                'trm-601b1401-4464-4f3f-97b3-09079ee7723b'
              ]
            }
          ]
        });

        res.status.should.be.equal(404);

        cb();
      });
    });

    /** @test {ApiClient#doPost} */
    it('should return encrypted response if encrypted POST call was successful (without query parameters)', cb => {
      const clientPath = path.join(
        __dirname,
        '..',
        'resources',
        'private-jwkset1'
      );
      const hwPath = path.join(__dirname, '..', 'resources', 'public-jwkset1');
      const clientWithEncryption = new ApiClient(
        'test-username',
        'test-password',
        'https://test-server',
        {
          clientPrivateKeySetPath: clientPath,
          hyperwalletKeySetPath: hwPath
        }
      );
      const encryption = new Encryption(clientPath, hwPath);
      const testMessage = {
        message: 'Test message'
      };

      encryption
        .encrypt(testMessage)
        .then(encryptedBody => {
          nock('https://test-server')
            .filteringPath(() => '/')
            .matchHeader('Authorization', authHeader)
            .matchHeader(
              'User-Agent',
              `Hyperwallet Node SDK v${packageJson.version}`
            )
            .matchHeader('Accept', 'application/jose+json')
            .matchHeader('Content-Type', 'application/jose+json')
            .post('/', /.+/)
            .reply(200, encryptedBody, {
              'Content-Type': 'application/jose+json'
            });

          clientWithEncryption.doPost(
            'test',
            { message: 'Test message' },
            {},
            (err, body, res) => {
              expect(err).to.be.undefined();

              expect(res).to.not.be.undefined();

              expect(body).to.be.deep.equal({
                message: 'Test message'
              });

              cb();
            }
          );
        })
        .catch(fail);
    });

    /** @test {ApiClient#doPost} */
    it('should return encrypted response if encrypted POST call was successful when content type contains charset', cb => {
      const clientPath = path.join(
        __dirname,
        '..',
        'resources',
        'private-jwkset1'
      );
      const hwPath = path.join(__dirname, '..', 'resources', 'public-jwkset1');
      const clientWithEncryption = new ApiClient(
        'test-username',
        'test-password',
        'https://test-server',
        {
          clientPrivateKeySetPath: clientPath,
          hyperwalletKeySetPath: hwPath
        }
      );
      const encryption = new Encryption(clientPath, hwPath);
      const testMessage = {
        message: 'Test message'
      };

      encryption
        .encrypt(testMessage)
        .then(encryptedBody => {
          nock('https://test-server')
            .filteringPath(() => '/')
            .matchHeader('Authorization', authHeader)
            .matchHeader(
              'User-Agent',
              `Hyperwallet Node SDK v${packageJson.version}`
            )
            .matchHeader('Accept', 'application/jose+json')
            .matchHeader('Content-Type', 'application/jose+json')
            .post('/', /.+/)
            .reply(200, encryptedBody, {
              'Content-Type': 'application/jose+json;charset=utf-8'
            });

          clientWithEncryption.doPost(
            'test',
            { message: 'Test message' },
            {},
            (err, body, res) => {
              expect(err).to.be.undefined();

              expect(res).to.not.be.undefined();

              expect(body).to.be.deep.equal({
                message: 'Test message'
              });

              cb();
            }
          );
        })
        .catch(fail);
    });

    /** @test {ApiClient#doPost} */
    it('should return error when encrypted response body is empty', async () => {
      const clientPath = path.join(
        __dirname,
        '..',
        'resources',
        'private-jwkset1'
      );
      const hwPath = path.join(__dirname, '..', 'resources', 'public-jwkset1');
      const clientWithEncryption = new ApiClient(
        'test-username',
        'test-password',
        'https://test-server',
        {
          clientPrivateKeySetPath: clientPath,
          hyperwalletKeySetPath: hwPath
        }
      );
      const encryption = new Encryption(clientPath, hwPath);
      const testMessage = {
        message: 'Test message'
      };

      return encryption
        .encrypt(testMessage)
        .then(async () => {
          nock('https://test-server')
            .filteringPath(() => '/')
            .matchHeader('Authorization', authHeader)
            .matchHeader(
              'User-Agent',
              `Hyperwallet Node SDK v${packageJson.version}`
            )
            .matchHeader('Accept', 'application/jose+json')
            .matchHeader('Content-Type', 'application/jose+json')
            .post('/', /.+/)
            .reply(200, null, {
              'Content-Type': 'application/jose+json'
            });

          return new Promise((resolve, reject) => {
            clientWithEncryption.doPost(
              'test',
              { message: 'Test message' },
              {},
              (err, body, res) => {
                try {
                  expect(body).to.be.undefined();

                  expect(res).to.be.undefined();

                  expect(err).to.be.deep.equal([
                    { message: 'Tried to decrypt empty response body' }
                  ]);

                  resolve();
                } catch (e) {
                  reject(e);
                }
              }
            );
          });
        })
        .catch(fail);
    });

    /** @test {ApiClient#doPost} */
    it('should return error when fail to encrypt POST request body', cb => {
      const clientPath = path.join(
        __dirname,
        '..',
        'resources',
        'private-jwkset1'
      );
      const hwPath = path.join(__dirname, '..', 'resources', 'public-jwkset1');
      const clientWithEncryption = new ApiClient(
        'test-username',
        'test-password',
        'https://test-server',
        {
          clientPrivateKeySetPath: 'wrongPath',
          hyperwalletKeySetPath: hwPath
        }
      );
      const encryption = new Encryption(clientPath, hwPath);
      const testMessage = {
        message: 'Test message'
      };

      encryption.encrypt(testMessage).then(encryptedBody => {
        nock('https://test-server')
          .filteringPath(() => '/')
          .matchHeader('Authorization', authHeader)
          .matchHeader(
            'User-Agent',
            `Hyperwallet Node SDK v${packageJson.version}`
          )
          .matchHeader('Accept', 'application/json')
          .matchHeader('Content-Type', 'application/jose+json')
          .post('/', /.+/)
          .reply(201, encryptedBody);

        clientWithEncryption.doPost(
          'test',
          { message: 'Test message' },
          {},
          (err, body, res) => {
            expect(body).to.be.undefined();

            expect(res).to.be.undefined();

            expect(err).to.be.deep.equal(
              'Failed to encrypt body for POST request'
            );

            cb();
          }
        );
      });
    });
  });

  /** @test {ApiClient#doPut} */
  describe('doPut()', () => {
    let client;
    let authHeader;

    before(() => {
      nock.disableNetConnect();
    });
    after(() => {
      nock.enableNetConnect();
    });

    beforeEach(() => {
      client = new ApiClient(
        'test-username',
        'test-password',
        'https://test-server'
      );

      authHeader = 'Basic dGVzdC11c2VybmFtZTp0ZXN0LXBhc3N3b3Jk';
    });
    afterEach(() => {
      nock.cleanAll();
    });

    /** @test {ApiClient#doPut} */
    it('should return response if call was successful (with query parameters)', cb => {
      nock('https://test-server')
        .matchHeader('Authorization', authHeader)
        .matchHeader(
          'User-Agent',
          `Hyperwallet Node SDK v${packageJson.version}`
        )
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .put('/rest/v3/test', {
          test: 'value'
        })
        .query({ sort: 'test' })
        .reply(
          200,
          { response: 'value' },
          { 'Content-Type': 'application/json' }
        );

      client.doPut(
        'test',
        { test: 'value' },
        { sort: 'test' },
        (err, body, res) => {
          expect(err).to.be.undefined();

          expect(body).to.be.deep.equal({
            response: 'value'
          });

          res.status.should.be.equal(200);

          cb();
        }
      );
    });

    /** @test {ApiClient#doPut} */
    it('should return response if call was successful (with query parameters) when content type contains charset', cb => {
      nock('https://test-server')
        .matchHeader('Authorization', authHeader)
        .matchHeader(
          'User-Agent',
          `Hyperwallet Node SDK v${packageJson.version}`
        )
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .put('/rest/v3/test', {
          test: 'value'
        })
        .query({ sort: 'test' })
        .reply(
          200,
          { response: 'value' },
          {
            'Content-Type': 'application/json;charset=utf-8'
          }
        );

      client.doPut(
        'test',
        { test: 'value' },
        { sort: 'test' },
        (err, body, res) => {
          expect(err).to.be.undefined();

          expect(body).to.be.deep.equal({
            response: 'value'
          });

          res.status.should.be.equal(200);

          cb();
        }
      );
    });

    /** @test {ApiClient#doPut} */
    it('should return response if call was successful (with query parameters) when content type contains charset ahead', cb => {
      nock('https://test-server')
        .matchHeader('Authorization', authHeader)
        .matchHeader(
          'User-Agent',
          `Hyperwallet Node SDK v${packageJson.version}`
        )
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .put('/rest/v3/test', {
          test: 'value'
        })
        .query({ sort: 'test' })
        .reply(
          200,
          { response: 'value' },
          {
            'Content-Type': 'charset=utf-8;application/json'
          }
        );

      client.doPut(
        'test',
        { test: 'value' },
        { sort: 'test' },
        (err, body, res) => {
          expect(err).to.be.undefined();

          JSON.parse(body.toString('utf8')).should.be.deep.equal({
            response: 'value'
          });

          res.status.should.be.equal(200);

          cb();
        }
      );
    });

    /** @test {ApiClient#doPut} */
    it('should return response if call was successful (without query parameters)', cb => {
      nock('https://test-server')
        .matchHeader('Authorization', authHeader)
        .matchHeader(
          'User-Agent',
          `Hyperwallet Node SDK v${packageJson.version}`
        )
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .put('/rest/v3/test', {
          test: 'value'
        })
        .reply(
          200,
          { response: 'value' },
          { 'Content-Type': 'application/json' }
        );

      client.doPut('test', { test: 'value' }, {}, (err, body, res) => {
        expect(err).to.be.undefined();

        expect(body).to.be.deep.equal({
          response: 'value'
        });

        res.status.should.be.equal(200);

        cb();
      });
    });

    /** @test {ApiClient#doPut} */
    it('should return generic network error if no response was send by server', cb => {
      client.doPut('test', { test: 'value' }, {}, (err, body, res) => {
        expect(err).to.be.deep.equal([
          {
            message: 'Could not communicate with https://test-server',
            code: 'COMMUNICATION_ERROR'
          }
        ]);

        expect(body).to.be.undefined();
        expect(res).to.be.undefined();

        cb();
      });
    });

    /** @test {ApiClient#doPut} */
    it('should return error message if responses contains error', cb => {
      nock('https://test-server')
        .matchHeader('Authorization', authHeader)
        .matchHeader(
          'User-Agent',
          `Hyperwallet Node SDK v${packageJson.version}`
        )
        .matchHeader('Accept', 'application/json')
        .matchHeader('Content-Type', 'application/json')
        .put('/rest/v3/test', {
          test: 'value'
        })
        .reply(
          404,
          {
            errors: [
              {
                message: 'message',
                code: 'FORBIDDEN',
                relatedResources: [
                  'trm-f3d38df1-adb7-4127-9858-e72ebe682a79',
                  'trm-601b1401-4464-4f3f-97b3-09079ee7723b'
                ]
              }
            ]
          },
          { 'Content-Type': 'application/json' }
        );

      client.doPut('test', { test: 'value' }, {}, (err, body, res) => {
        expect(err).to.be.deep.equal([
          {
            message: 'message',
            code: 'FORBIDDEN',
            relatedResources: [
              'trm-f3d38df1-adb7-4127-9858-e72ebe682a79',
              'trm-601b1401-4464-4f3f-97b3-09079ee7723b'
            ]
          }
        ]);

        expect(body).to.be.deep.equal({
          errors: [
            {
              message: 'message',
              code: 'FORBIDDEN',
              relatedResources: [
                'trm-f3d38df1-adb7-4127-9858-e72ebe682a79',
                'trm-601b1401-4464-4f3f-97b3-09079ee7723b'
              ]
            }
          ]
        });

        res.status.should.be.equal(404);

        cb();
      });
    });

    /** @test {ApiClient#doPut} */
    it('should return encrypted response if encrypted PUT call was successful (without query parameters)', cb => {
      const clientPath = path.join(
        __dirname,
        '..',
        'resources',
        'private-jwkset1'
      );
      const hwPath = path.join(__dirname, '..', 'resources', 'public-jwkset1');
      const clientWithEncryption = new ApiClient(
        'test-username',
        'test-password',
        'https://test-server',
        {
          clientPrivateKeySetPath: clientPath,
          hyperwalletKeySetPath: hwPath
        }
      );
      const encryption = new Encryption(clientPath, hwPath);
      const testMessage = {
        message: 'Test message'
      };

      encryption.encrypt(testMessage).then(encryptedBody => {
        nock('https://test-server')
          .filteringPath(() => '/')
          .matchHeader('Authorization', authHeader)
          .matchHeader(
            'User-Agent',
            `Hyperwallet Node SDK v${packageJson.version}`
          )
          .matchHeader('Accept', 'application/jose+json')
          .matchHeader('Content-Type', 'application/jose+json')
          .put('/', /.+/)
          .reply(201, encryptedBody, {
            'Content-Type': 'application/jose+json'
          });

        clientWithEncryption.doPut(
          'test',
          { message: 'Test message' },
          {},
          (err, body, res) => {
            expect(err).to.be.undefined();

            expect(res).to.not.be.undefined();

            expect(body).to.be.deep.equal({
              message: 'Test message'
            });

            cb();
          }
        );
      });
    });

    /** @test {ApiClient#doPut} */
    it('should return encrypted response if encrypted PUT call was successful when content type contains charset', cb => {
      const clientPath = path.join(
        __dirname,
        '..',
        'resources',
        'private-jwkset1'
      );
      const hwPath = path.join(__dirname, '..', 'resources', 'public-jwkset1');
      const clientWithEncryption = new ApiClient(
        'test-username',
        'test-password',
        'https://test-server',
        {
          clientPrivateKeySetPath: clientPath,
          hyperwalletKeySetPath: hwPath
        }
      );
      const encryption = new Encryption(clientPath, hwPath);
      const testMessage = {
        message: 'Test message'
      };

      encryption.encrypt(testMessage).then(encryptedBody => {
        nock('https://test-server')
          .filteringPath(() => '/')
          .matchHeader('Authorization', authHeader)
          .matchHeader(
            'User-Agent',
            `Hyperwallet Node SDK v${packageJson.version}`
          )
          .matchHeader('Accept', 'application/jose+json')
          .matchHeader('Content-Type', 'application/jose+json')
          .put('/', /.+/)
          .reply(201, encryptedBody, {
            'Content-Type': 'application/jose+json;charset=utf-8'
          });

        clientWithEncryption.doPut(
          'test',
          { message: 'Test message' },
          {},
          (err, body, res) => {
            expect(err).to.be.undefined();

            expect(res).to.not.be.undefined();

            expect(body).to.be.deep.equal({
              message: 'Test message'
            });

            cb();
          }
        );
      });
    });

    /** @test {ApiClient#doPut} */
    it('should return error when fail to encrypt PUT request body', cb => {
      const clientPath = path.join(
        __dirname,
        '..',
        'resources',
        'private-jwkset1'
      );
      const hwPath = path.join(__dirname, '..', 'resources', 'public-jwkset1');
      const clientWithEncryption = new ApiClient(
        'test-username',
        'test-password',
        'https://test-server',
        {
          clientPrivateKeySetPath: 'wrongPath',
          hyperwalletKeySetPath: hwPath
        }
      );
      const encryption = new Encryption(clientPath, hwPath);
      const testMessage = {
        message: 'Test message'
      };

      encryption.encrypt(testMessage).then(encryptedBody => {
        nock('https://test-server')
          .filteringPath(() => '/')
          .matchHeader('Authorization', authHeader)
          .matchHeader(
            'User-Agent',
            `Hyperwallet Node SDK v${packageJson.version}`
          )
          .matchHeader('Accept', 'application/json')
          .matchHeader('Content-Type', 'application/jose+json')
          .put('/', /.+/)
          .reply(201, encryptedBody);

        clientWithEncryption.doPut(
          'test',
          { message: 'Test message' },
          {},
          (err, body, res) => {
            expect(body).to.be.undefined();

            expect(res).to.be.undefined();

            expect(err).to.be.deep.equal(
              'Failed to encrypt body for PUT request'
            );

            cb();
          }
        );
      });
    });

    /** @test {ApiClient#doPut} */
    it('should return error when fail to decrypt PUT response body', async () => {
      const clientPath = path.join(
        __dirname,
        '..',
        'resources',
        'private-jwkset1-wrong-jwe'
      );
      const hwPath = path.join(__dirname, '..', 'resources', 'public-jwkset1');
      const clientWithEncryption: ApiClient = new ApiClient(
        'test-username',
        'test-password',
        'https://test-server',
        {
          clientPrivateKeySetPath: clientPath,
          hyperwalletKeySetPath: hwPath
        }
      );
      const encryption = new Encryption(clientPath, hwPath);
      const testMessage = {
        message: 'Test message'
      };

      return encryption.encrypt(testMessage).then(encryptedBody => {
        nock('https://test-server')
          .filteringPath(() => '/')
          .matchHeader('Authorization', authHeader)
          .matchHeader(
            'User-Agent',
            `Hyperwallet Node SDK v${packageJson.version}`
          )
          .matchHeader('Accept', 'application/jose+json')
          .matchHeader('Content-Type', 'application/jose+json')
          .put('/', /.+/)
          .reply(201, encryptedBody, {
            'Content-Type': 'application/jose+json'
          });

        return clientWithEncryption.doPut(
          'test',
          { message: 'Test message' },
          {},
          (err, body, res) => {
            expect(err).to.be.deep.equal([
              { message: 'Tried to decrypt empty response body' }
            ]);

            expect(body).to.not.be.undefined();

            expect(res).to.not.be.undefined();
          }
        );
      });
    });

    /** @test {ApiClient#doPut} */
    it('should return error when server responses with error on encrypted PUT request', async () => {
      const clientPath = path.join(
        __dirname,
        '..',
        'resources',
        'private-jwkset1'
      );
      const hwPath = path.join(__dirname, '..', 'resources', 'public-jwkset1');
      const clientWithEncryption: ApiClient = new ApiClient(
        'test-username',
        'test-password',
        'https://test-server',
        {
          clientPrivateKeySetPath: clientPath,
          hyperwalletKeySetPath: hwPath
        }
      );
      const encryption = new Encryption(clientPath, hwPath);
      const errorMessage = {
        errors: ['test1', 'test2']
      };

      return encryption
        .encrypt(errorMessage)
        .then(encryptedBody => {
          nock('https://test-server')
            .filteringPath(() => '/')
            .matchHeader('Authorization', authHeader)
            .matchHeader(
              'User-Agent',
              `Hyperwallet Node SDK v${packageJson.version}`
            )
            .matchHeader('Accept', 'application/jose+json')
            .matchHeader('Content-Type', 'application/jose+json')
            .put('/', /.+/)
            .reply(404, encryptedBody, {
              'Content-Type': 'application/jose+json'
            });

          return new Promise(function(resolve, reject) {
            clientWithEncryption.doPut(
              'test',
              { message: 'Test message' },
              {},
              (err, body, res) => {
                try {
                  expect(err).to.be.deep.equal(['test1', 'test2']);

                  expect(body).to.be.deep.equal({
                    errors: ['test1', 'test2']
                  });

                  res.should.be.deep.equal({
                    body: {
                      errors: ['test1', 'test2']
                    }
                  });

                  resolve();
                } catch (e) {
                  fail(e);
                }
              }
            );
          });
        })
        .catch(e => fail(e));
    });
  });

  /** @test {ApiClient#doGet} */
  describe.only('doGet()', () => {
    before(() => {
      nock.disableNetConnect();
    });
    after(() => {
      nock.enableNetConnect();
    });

    const beforeEach = () => ({
      client: new ApiClient(
        'test-username',
        'test-password',
        'https://test-server'
      ),

      authHeader: 'Basic dGVzdC11c2VybmFtZTp0ZXN0LXBhc3N3b3Jk'
    });

    afterEach(() => {
      nock.cleanAll();
    });

    /** @test {ApiClient#doGet} */
    it('should return response if call was successful (with query parameters)', cb => {
      const { client, authHeader } = beforeEach();

      const scope = nock('https://test-server')
        .matchHeader('Authorization', authHeader)
        .matchHeader(
          'User-Agent',
          `Hyperwallet Node SDK v${packageJson.version}`
        )
        .matchHeader('Accept', 'application/json')
        .get('/rest/v3/test')
        .query({ sort: 'test' })
        .reply(
          200,
          { response: 'value' },
          { 'Content-Type': 'application/json' }
        );

      client.doGet('test', { sort: 'test' }, (err, body, res) => {
        expect(err).to.be.undefined();

        expect(body).to.be.deep.equal({
          response: 'value'
        });

        res.status.should.be.equal(200);

        scope.done();
        cb();
      });
    });

    /** @test {ApiClient#doGet} */
    it('should return response if call was successful (with query parameters) when content type contains charset', cb => {
      const { client, authHeader } = beforeEach();

      const scope = nock('https://test-server')
        .matchHeader('Authorization', authHeader)
        .matchHeader(
          'User-Agent',
          `Hyperwallet Node SDK v${packageJson.version}`
        )
        .matchHeader('Accept', 'application/json')
        .get('/rest/v3/test')
        .query({ sort: 'test' })
        .reply(
          200,
          { response: 'value' },
          {
            'Content-Type': 'application/json;charset=utf-8'
          }
        );

      client.doGet('test', { sort: 'test' }, (err, body, res) => {
        expect(err).to.be.undefined();

        expect(body).to.be.deep.equal({
          response: 'value'
        });

        res.status.should.be.equal(200);

        scope.done();
        cb();
      });
    });

    /** @test {ApiClient#doGet} */
    it('should return response if call was successful (with query parameters) when content type contains charset ahead', cb => {
      const { client, authHeader } = beforeEach();

      const scope = nock('https://test-server')
        .matchHeader('Authorization', authHeader)
        .matchHeader(
          'User-Agent',
          `Hyperwallet Node SDK v${packageJson.version}`
        )
        .matchHeader('Accept', 'application/json')
        .get('/rest/v3/test')
        .query({ sort: 'test' })
        .reply(
          200,
          { response: 'value' },
          {
            'Content-Type': 'charset=utf-8;application/json'
          }
        );

      client.doGet('test', { sort: 'test' }, (err, body, res) => {
        expect(err).to.be.undefined();

        JSON.parse(body.toString('utf8')).should.be.deep.equal({
          response: 'value'
        });

        res.status.should.be.equal(200);

        scope.done();
        cb();
      });
    });

    /** @test {ApiClient#doGet} */
    it('should return response if call was successful (without query parameters)', cb => {
      const { client, authHeader } = beforeEach();

      const scope = nock('https://test-server')
        .matchHeader('Authorization', authHeader)
        .matchHeader(
          'User-Agent',
          `Hyperwallet Node SDK v${packageJson.version}`
        )
        .matchHeader('Accept', 'application/json')
        .get('/rest/v3/test')
        .reply(
          200,
          { response: 'value' },
          { 'Content-Type': 'application/json' }
        );

      client.doGet('test', {}, (err, body, res) => {
        expect(err).to.be.undefined();

        expect(body).to.be.deep.equal({
          response: 'value'
        });

        res.status.should.be.equal(200);

        scope.done();
        cb();
      });
    });

    /** @test {ApiClient#doGet} */
    it('should return generic network error if no response was send by server', cb => {
      const { client } = beforeEach();

      client.doGet('test', {}, (err, body, res) => {
        expect(err).to.be.deep.equal([
          {
            message: 'Could not communicate with https://test-server',
            code: 'COMMUNICATION_ERROR'
          }
        ]);

        expect(body).to.be.undefined();
        expect(res).to.be.undefined();

        cb();
      });
    });

    /** @test {ApiClient#doGet} */
    it('should return error message if responses contains error', cb => {
      const { client, authHeader } = beforeEach();

      nock('https://test-server')
        .matchHeader('Authorization', authHeader)
        .matchHeader(
          'User-Agent',
          `Hyperwallet Node SDK v${packageJson.version}`
        )
        .matchHeader('Accept', 'application/json')
        .get('/rest/v3/test')
        .reply(
          404,
          {
            errors: [
              {
                message: 'message',
                code: 'FORBIDDEN',
                relatedResources: [
                  'trm-f3d38df1-adb7-4127-9858-e72ebe682a79',
                  'trm-601b1401-4464-4f3f-97b3-09079ee7723b'
                ]
              }
            ]
          },
          { 'Content-Type': 'application/json' }
        );

      client.doGet('test', {}, (err, body, res) => {
        expect(err).to.be.deep.equal([
          {
            message: 'message',
            code: 'FORBIDDEN',
            relatedResources: [
              'trm-f3d38df1-adb7-4127-9858-e72ebe682a79',
              'trm-601b1401-4464-4f3f-97b3-09079ee7723b'
            ]
          }
        ]);

        expect(body).to.be.deep.equal({
          errors: [
            {
              message: 'message',
              code: 'FORBIDDEN',
              relatedResources: [
                'trm-f3d38df1-adb7-4127-9858-e72ebe682a79',
                'trm-601b1401-4464-4f3f-97b3-09079ee7723b'
              ]
            }
          ]
        });

        res.status.should.be.equal(404);

        cb();
      });
    });

    /** @test {ApiClient#doGet} */
    it('should return encrypted response if encrypted GET call was successful (without query parameters)', cb => {
      const { authHeader } = beforeEach();

      const clientPath = path.join(
        __dirname,
        '..',
        'resources',
        'private-jwkset1'
      );
      const hwPath = path.join(__dirname, '..', 'resources', 'public-jwkset1');
      const clientWithEncryption = new ApiClient(
        'test-username',
        'test-password',
        'https://test-server',
        {
          clientPrivateKeySetPath: clientPath,
          hyperwalletKeySetPath: hwPath
        }
      );
      const encryption = new Encryption(clientPath, hwPath);
      const testMessage = {
        message: 'Test message'
      };

      encryption.encrypt(testMessage).then(encryptedBody => {
        nock('https://test-server')
          .filteringPath(() => '/')
          .matchHeader('Authorization', authHeader)
          .matchHeader(
            'User-Agent',
            `Hyperwallet Node SDK v${packageJson.version}`
          )
          .matchHeader('Accept', 'application/jose+json')
          .get('/')
          .reply(200, encryptedBody, {
            'Content-Type': 'application/jose+json'
          });

        clientWithEncryption.doGet('test', {}, (err, body, res) => {
          expect(err).to.be.undefined();

          expect(res).to.not.be.undefined();

          expect(body).to.be.deep.equal({
            message: 'Test message'
          });

          cb();
        });
      });
    });

    /** @test {ApiClient#doGet} */
    it('should return encrypted response if encrypted GET call was successful when content type contains charset', cb => {
      const { authHeader } = beforeEach();

      const clientPath = path.join(
        __dirname,
        '..',
        'resources',
        'private-jwkset1'
      );
      const hwPath = path.join(__dirname, '..', 'resources', 'public-jwkset1');
      const clientWithEncryption = new ApiClient(
        'test-username',
        'test-password',
        'https://test-server',
        {
          clientPrivateKeySetPath: clientPath,
          hyperwalletKeySetPath: hwPath
        }
      );
      const encryption = new Encryption(clientPath, hwPath);
      const testMessage = {
        message: 'Test message'
      };

      encryption.encrypt(testMessage).then(encryptedBody => {
        nock('https://test-server')
          .filteringPath(() => '/')
          .matchHeader('Authorization', authHeader)
          .matchHeader(
            'User-Agent',
            `Hyperwallet Node SDK v${packageJson.version}`
          )
          .matchHeader('Accept', 'application/jose+json')
          .get('/')
          .reply(200, encryptedBody, {
            'Content-Type': 'application/jose+json;charset=utf-8'
          });

        clientWithEncryption.doGet('test', {}, (err, body, res) => {
          expect(err).to.be.undefined();

          expect(res).to.not.be.undefined();

          expect(body).to.be.deep.equal({
            message: 'Test message'
          });

          cb();
        });
      });
    });
  });

  describe('wrapCallback()', () => {
    it("should return a 'function' without a argument", () => {
      const client = new ApiClient(
        'test-username',
        'test-password',
        'test-server'
      );

      client.wrapCallback(undefined as any).should.be.a('function');
    });

    it("should return a 'function' with a argument", () => {
      const client = new ApiClient(
        'test-username',
        'test-password',
        'test-server'
      );

      client.wrapCallback(undefined as any).should.be.a('function');
    });

    it('should be able to run without any arguments', () => {
      const client = new ApiClient(
        'test-username',
        'test-password',
        'test-server'
      );
      client.wrapCallback(undefined as any)(new Error());
    });

    it("should call callback with 'body' and 'res' if no error happened", cb => {
      const client = new ApiClient(
        'test-username',
        'test-password',
        'test-server'
      );

      const rawRes = {
        body: 'test',
        status: 200,
        type: 'application/json'
      };

      const callback = client.wrapCallback('POST', (err, body, res) => {
        expect(err).to.be.undefined();

        expect(body).to.be.equal('test');
        rawRes.should.be.deep.equal(res);

        cb();
      });
      callback(undefined, rawRes);
    });

    it("should call callback with 'errors', 'body' and 'res' if 'body' contains errors", cb => {
      const client = new ApiClient(
        'test-username',
        'test-password',
        'test-server'
      );

      const rawRes = {
        body: {
          errors: [
            {
              message: 'message',
              code: 'FORBIDDEN',
              relatedResources: [
                'trm-f3d38df1-adb7-4127-9858-e72ebe682a79',
                'trm-601b1401-4464-4f3f-97b3-09079ee7723b'
              ]
            }
          ]
        },
        status: 404,
        type: 'application/json'
      };

      const callback = client.wrapCallback('POST', (err, body, res) => {
        expect(err).to.be.deep.equal([
          {
            message: 'message',
            code: 'FORBIDDEN',
            relatedResources: [
              'trm-f3d38df1-adb7-4127-9858-e72ebe682a79',
              'trm-601b1401-4464-4f3f-97b3-09079ee7723b'
            ]
          }
        ]);
        expect(body).to.be.deep.equal({
          errors: [
            {
              message: 'message',
              code: 'FORBIDDEN',
              relatedResources: [
                'trm-f3d38df1-adb7-4127-9858-e72ebe682a79',
                'trm-601b1401-4464-4f3f-97b3-09079ee7723b'
              ]
            }
          ]
        });
        rawRes.should.be.deep.equal(res);

        cb();
      });
      callback(new Error(), rawRes);
    });

    it("should call callback with static error message as 'errors', 'body' and 'res' if 'body' contains no errors", cb => {
      const client = new ApiClient(
        'test-username',
        'test-password',
        'test-server'
      );

      const rawRes = {
        body: 'test',
        status: 404,
        type: 'application/json'
      };

      const callback = client.wrapCallback('POST', (err, body, res) => {
        expect(err).to.be.deep.equal([
          {
            message: 'Could not communicate with test-server',
            code: 'COMMUNICATION_ERROR'
          }
        ]);
        expect(body).to.be.equal('test');
        rawRes.should.be.deep.equal(res);

        cb();
      });
      callback(new Error(), rawRes);
    });

    it("should call callback with 'body' and 'res' and application/jose+json Content-Type", cb => {
      const clientPath = path.join(
        __dirname,
        '..',
        'resources',
        'private-jwkset1'
      );
      const hwPath = path.join(__dirname, '..', 'resources', 'public-jwkset1');
      const clientWithEncryption = new ApiClient(
        'test-username',
        'test-password',
        'https://test-server',
        {
          clientPrivateKeySetPath: clientPath,
          hyperwalletKeySetPath: hwPath
        }
      );

      const encryption = new Encryption(clientPath, hwPath);
      const testMessage = {
        message: 'Test message'
      };

      encryption.encrypt(testMessage).then(encryptedBody => {
        const callback = clientWithEncryption.wrapCallback(
          'POST',
          (err, body, res) => {
            expect(err).to.be.undefined();
            expect(res).not.to.be.undefined();
            expect(body).to.be.deep.equal(testMessage);

            cb();
          }
        );
        const rawRes = {
          body: encryptedBody,
          status: 200,
          type: 'application/jose+json'
        };
        callback(undefined, rawRes);
      });
    });

    it("should call callback with static error message as 'errors', when Content-Type is wrong", cb => {
      const client = new ApiClient(
        'test-username',
        'test-password',
        'test-server'
      );

      const rawRes = {
        body: 'test',
        status: 200,
        header: {
          'content-type': 'wrongContentType'
        }
      };

      const callback = client.wrapCallback('POST', (err, body, res) => {
        expect(err).to.be.deep.equal([
          {
            message: 'Invalid Content-Type specified in Response Header'
          }
        ]);
        expect(body).to.be.equal('test');
        rawRes.should.be.deep.equal(res);

        cb();
      });
      callback(new Error(), rawRes);
    });

    it('should call callback with no errors if Content-type is missing and response is noContent', cb => {
      const client = new ApiClient(
        'test-username',
        'test-password',
        'test-server'
      );

      const rawRes = {
        body: 'test',
        status: 204,
        header: {}
      };

      const callback = client.wrapCallback('POST', (err, body, res) => {
        expect(err).to.be.undefined();

        expect(body).to.be.equal('test');
        rawRes.should.be.deep.equal(res);

        cb();
      });
      callback(undefined, rawRes);
    });
  });
});
