// SPDX-License-Identifier: MIT
pragma solidity >=0.4.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NewToken is ERC20 {
    constructor() ERC20("Gold", "GLD") {
        _mint(msg.sender, 10000000000000000000000);
    }
}
