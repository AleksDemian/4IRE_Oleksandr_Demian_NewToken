const NewToken = artifacts.require("NewToken");

const Deposit = artifacts.require("Deposit");

const DepositProxy = artifacts.require('DepositProxy');

const { admin } = require('../secrets.json');

module.exports = async function (deployer) {
  await deployer.deploy(NewToken);
  const ERC20 = await NewToken.deployed();
  await deployer.deploy(Deposit, ERC20.address);
  const instanceProxy = await Deposit.deployed();
  await deployer.deploy(DepositProxy, instanceProxy.address, admin)
};
