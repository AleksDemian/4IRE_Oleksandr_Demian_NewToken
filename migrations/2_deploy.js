var NewToken = artifacts.require("./NewToken.sol");
const Deposit = artifacts.require("Deposit");


module.exports = async function (deployer) {
  await deployer.deploy(NewToken);
  const ERC20 = await NewToken.deployed();
  await deployer.deploy(Deposit, ERC20.address);
};