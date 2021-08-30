//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Deposit {
    address public token;
    address private owner;

    mapping(address => uint256) public tokensDeposits;
    mapping(address => uint256) public ethDeposits;

    constructor(address token_) {
        token = token_;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You don`t own this account.");
        _;
    }

    event Deposited(address payer, uint256 weiAmount);
    event Withdrawn(address payer, uint256 weiAmount);

    function deposit() public payable returns (bool) {
        ethDeposits[msg.sender] += msg.value;
        emit Deposited(msg.sender, msg.value);
        return true;
    }

    function withdraw(uint256 amount, address to) public returns (bool) {
        require(ethDeposits[msg.sender] >= amount, "Not enought eth balance");
        ethDeposits[msg.sender] -= amount;
        (bool success, ) = to.call{value: amount}("");
        require(success, "Withdraw failure");
        emit Withdrawn(msg.sender, amount);
        return true;
    }

    function ethBalance() public view returns (uint256) {
        return ethDeposits[msg.sender];
    }

    function depositToken(uint256 amount) public returns (bool) {
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        tokensDeposits[msg.sender] += amount;
        return true;
    }

    function withdrawToken(uint256 amount) public returns (bool) {
        require(
            tokensDeposits[msg.sender] >= amount,
            "Not enought token balance"
        );
        tokensDeposits[msg.sender] -= amount;
        IERC20(token).transfer(msg.sender, amount);
        return true;
    }

    function tokenBalance() public view returns (uint256) {
        return tokensDeposits[msg.sender];
    }
}
