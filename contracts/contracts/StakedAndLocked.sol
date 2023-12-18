// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;


import {ERC4626, ERC20} from "solmate/src/mixins/ERC4626.sol";
import {SafeTransferLib} from "solmate/src/utils/SafeTransferLib.sol";

contract Staking is ERC4626 {

    uint256 public constant cooldownPeriod = 10 days;
    uint256 public constant unstakePeriod = 2 days;
    mapping(address => uint256) public userCooldown;

    constructor(ERC20 _token, string memory _name, string memory _symbol) ERC4626(_token, _name, _symbol) {}

    function activateCooldown() external {
        userCooldown[msg.sender] = block.timestamp + cooldownPeriod;
    }

    function totalAssets() public view override returns (uint256) {
        return asset.balanceOf(address(this));
    }

    function beforeWithdraw(uint256 assets, uint256 shares) internal override {
        super.beforeWithdraw(assets, shares);
        require(canWithdraw(msg.sender), "Cooldown is not activated");
    }

    function canWithdraw(address account) public view returns (bool) {
        return userCooldown[account] >= block.timestamp && userCooldown[account] + cooldownPeriod <= block.timestamp;
    }

    function afterDeposit(uint256 assets, uint256 shares) internal override {
        super.afterDeposit(assets, shares);
    }
}