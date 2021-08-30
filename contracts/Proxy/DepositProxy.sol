//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "./Proxy.sol";
import "../Utils/Ownable.sol";

contract DepositProxy is Ownable, Proxy {
    constructor(address initialImplementation, address owner) Ownable(owner) {
        _setImplementation(initialImplementation);
        _setVersion(1);
    }

    event Upgraded(address indexed implementation);

    function changeImplementation(address newImplementation)
        external
        onlyOwner
    {
        uint256 newVersion = _version() + 1;
        _setImplementation(newImplementation);
        _setVersion(newVersion);
        emit Upgraded(newImplementation);
    }

    function currentVersion() external view returns (uint256) {
        return _version();
    }

    function currentImplementation() external view returns (address) {
        return _implementation();
    }
}
