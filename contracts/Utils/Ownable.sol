//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "./StorageSlot.sol";

abstract contract Ownable {
    bytes32 internal constant _OWNER_SLOT =
        0x8a721d7331971cd5eefcd6a2b20c226462fc25662d105424a4f69c8d550cca50;

    event OwnershipTransferred(
        address indexed previousOwner,
        address indexed newOwner
    );

    constructor(address initialOwner) {
        _setOwner(initialOwner);
    }

    function owner() public view virtual returns (address) {
        return StorageSlot.getAddressSlot(_OWNER_SLOT).value;
    }

    modifier onlyOwner() {
        require(owner() == _msgSender(), "Ownable: caller is not the owner");
        _;
    }

    function _msgSender() internal view virtual returns (address) {
        return msg.sender;
    }

    function renounceOwnership() public virtual onlyOwner {
        _setOwner(address(0));
    }

    function transferOwnership(address newOwner) public virtual onlyOwner {
        require(
            newOwner != address(0),
            "Ownable: new owner is the zero address"
        );
        _setOwner(newOwner);
    }

    function _setOwner(address newOwner) private {
        address oldOwner = owner();
        StorageSlot.getAddressSlot(_OWNER_SLOT).value = newOwner;
        emit OwnershipTransferred(oldOwner, newOwner);
    }
}
