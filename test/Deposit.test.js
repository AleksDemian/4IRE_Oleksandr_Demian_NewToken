const { BN, expectRevert } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

const ERC20Mock = artifacts.require('ERC20Mock');
const Deposit = artifacts.require('Deposit');

contract('Deposit', function (accounts) {
  const [initialHolder, testAccount] = accounts;

  const name = 'My Token';
  const symbol = 'MTKN';

  const initialSupply = new BN(100);

  beforeEach(async function () {
    this.token = await ERC20Mock.new(name, symbol, initialHolder, initialSupply);
    this.deposit = await Deposit.new(this.token.address);
  });

  describe('depositToken', function () {
    it('when not allowed, can not deposit tokens', async function () {
      await expectRevert(this.deposit.depositToken(
        initialSupply, { from: initialHolder }), 'ERC20: transfer amount exceeds allowance',
      );
      expect(await this.deposit.tokenBalance({ from: initialHolder })).to.be.bignumber.equal('0');
      expect(await this.token.balanceOf(initialHolder, { from: initialHolder })).to.be.bignumber.equal(initialSupply);
    });

    it('when exceeds allowance. can not deposit tokens', async function () {
      await this.token.approve(this.deposit.address, initialSupply - 1, { from: initialHolder });
      await expectRevert(this.deposit.depositToken(
        initialSupply, { from: initialHolder }), 'ERC20: transfer amount exceeds allowance',
      );
      expect(await this.deposit.tokenBalance({ from: initialHolder })).to.be.bignumber.equal('0');
      expect(await this.token.balanceOf(initialHolder, { from: initialHolder })).to.be.bignumber.equal(initialSupply);
    });

    it('when not enough tokens, can not deposit tokens', async function () {
      await this.token.approve(this.deposit.address, initialSupply + 1, { from: initialHolder });
      await expectRevert(this.deposit.depositToken(
        initialSupply + 1, { from: initialHolder }), 'ERC20: transfer amount exceeds balance',
      );
      expect(await this.deposit.tokenBalance({ from: initialHolder })).to.be.bignumber.equal('0');
      expect(await this.token.balanceOf(initialHolder, { from: initialHolder })).to.be.bignumber.equal(initialSupply);
    });

    it('deposits correctly', async function () {
      await this.token.approve(this.deposit.address, initialSupply, { from: initialHolder });
      await this.deposit.depositToken(initialSupply, { from: initialHolder });
      expect(await this.deposit.tokenBalance({ from: initialHolder })).to.be.bignumber.equal(initialSupply);
      expect(await this.token.balanceOf(initialHolder, { from: initialHolder })).to.be.bignumber.equal('0');
    });
  });

  describe('tokenBalance', function () {
    it('when no tokens, returns zero', async function () {
      expect(await this.deposit.tokenBalance({ from: initialHolder })).to.be.bignumber.equal('0');
    });

    it('when has some tokens, returns sender balance', async function () {
      await this.token.approve(this.deposit.address, initialSupply, { from: initialHolder });
      await this.deposit.depositToken(initialSupply, { from: initialHolder });
      expect(await this.deposit.tokenBalance({ from: initialHolder })).to.be.bignumber.equal(initialSupply);
    });
  });


  describe('deposit', function () {
    it('when not enough ether, can not deposit', async function () {
      const balanceBeforeDeposit = await web3.eth.getBalance(testAccount);
      await expectRevert(
        this.deposit.deposit({
          from: testAccount,
          value: new BN(balanceBeforeDeposit).add(new BN(1)).toString(),
          gasPrice: 0
        }),
        'sender doesn\'t have enough funds');
      expect(await web3.eth.getBalance(testAccount)).to.be.bignumber.equal(balanceBeforeDeposit);
    });

    it('deposits correctly', async function () {
      const ethToSend = '777';
      const balanceBeforeDeposit = await web3.eth.getBalance(testAccount);

      await this.deposit.deposit({
        from: testAccount,
        value: ethToSend,
        gasPrice: 0
      });

      expect(await web3.eth.getBalance(testAccount)).to.be.bignumber.equal(new BN(balanceBeforeDeposit).sub(new BN(ethToSend)));
      expect(await this.deposit.ethBalance({ from: testAccount })).to.be.bignumber.equal(ethToSend);
    });
  });

  describe('ethBalance', function () {
    it('when no ether, returns zero', async function () {
      expect(await this.deposit.ethBalance({ from: testAccount })).to.be.bignumber.equal('0');
    });

    it('when has some ether, returns sender balance', async function () {
      const initEthBalance = '707';
      await this.deposit.deposit({
        from: testAccount,
        value: initEthBalance
      });
      expect(await this.deposit.ethBalance({ from: testAccount })).to.be.bignumber.equal(initEthBalance);
    });
  });
});