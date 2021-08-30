const { expect } = require('chai');

const DepositProxy = artifacts.require('DepositProxy');

// TODO: Add tests for DepositProxy
contract('DepositProxy', function (accounts) {
  const [initialImplementation, owner] = accounts;

  beforeEach(async function () {
    this.token = await DepositProxy.new(initialImplementation, owner);
  });

  describe('TODO: Add tests', function () {
    it('TODO: Add tests', async function () {
      expect(true).to.be.equal(true);
    });
  });
});