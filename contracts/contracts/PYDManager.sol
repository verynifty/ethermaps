// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./PYDProxy.sol";

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

interface IAAVE {
    struct ReserveConfigurationMap {
        //bit 0-15: LTV
        //bit 16-31: Liq. threshold
        //bit 32-47: Liq. bonus
        //bit 48-55: Decimals
        //bit 56: reserve is active
        //bit 57: reserve is frozen
        //bit 58: borrowing is enabled
        //bit 59: stable rate borrowing enabled
        //bit 60: asset is paused
        //bit 61: borrowing in isolation mode is enabled
        //bit 62: siloed borrowing enabled
        //bit 63: flashloaning enabled
        //bit 64-79: reserve factor
        //bit 80-115 borrow cap in whole tokens, borrowCap == 0 => no cap
        //bit 116-151 supply cap in whole tokens, supplyCap == 0 => no cap
        //bit 152-167 liquidation protocol fee
        //bit 168-175 eMode category
        //bit 176-211 unbacked mint cap in whole tokens, unbackedMintCap == 0 => minting disabled
        //bit 212-251 debt ceiling for isolation mode with (ReserveConfiguration::DEBT_CEILING_DECIMALS) decimals
        //bit 252-255 unused
        uint256 data;
    }

    struct ReserveData {
        //stores the reserve configuration
        ReserveConfigurationMap configuration;
        //the liquidity index. Expressed in ray
        uint128 liquidityIndex;
        //the current supply rate. Expressed in ray
        uint128 currentLiquidityRate;
        //variable borrow index. Expressed in ray
        uint128 variableBorrowIndex;
        //the current variable borrow rate. Expressed in ray
        uint128 currentVariableBorrowRate;
        //the current stable borrow rate. Expressed in ray
        uint128 currentStableBorrowRate;
        //timestamp of last update
        uint40 lastUpdateTimestamp;
        //the id of the reserve. Represents the position in the list of the active reserves
        uint16 id;
        //aToken address
        address aTokenAddress;
        //stableDebtToken address
        address stableDebtTokenAddress;
        //variableDebtToken address
        address variableDebtTokenAddress;
        //address of the interest rate strategy
        address interestRateStrategyAddress;
        //the current treasury balance, scaled
        uint128 accruedToTreasury;
        //the outstanding unbacked aTokens minted through the bridging feature
        uint128 unbacked;
        //the outstanding debt borrowed against this asset in isolation mode
        uint128 isolationModeTotalDebt;
    }

    /**
     * @notice Supplies an `amount` of underlying asset into the reserve, receiving in return overlying aTokens.
     * - E.g. User supplies 100 USDC and gets in return 100 aUSDC
     * @param asset The address of the underlying asset to supply
     * @param amount The amount to be supplied
     * @param onBehalfOf The address that will receive the aTokens, same as msg.sender if the user
     *   wants to receive them on his own wallet, or a different address if the beneficiary of aTokens
     *   is a different wallet
     * @param referralCode Code used to register the integrator originating the operation, for potential rewards.
     *   0 if the action is executed directly by the user, without any middle-man
     */
    function supply(
        address asset,
        uint256 amount,
        address onBehalfOf,
        uint16 referralCode
    ) external;

    /**
     * @notice Returns the state and configuration of the reserve
     * @param asset The address of the underlying asset of the reserve
     * @return The state and configuration data of the reserve
     */
    function getReserveData(
        address asset
    ) external view returns (ReserveData memory);
}

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract PYDManager {

    IAAVE public aave = IAAVE(0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2);

    PYDProxy public proxyImplementation;

    constructor() {
        // we deploy the proxy implementation contract once
        proxyImplementation = new PYDProxy();
    }

    function create(address _owner) public {
        require(vaults[_owner] == PYDProxy(address(0)), "Already created");
        vaults[_owner] = PYDProxy(Clones.clone(address(proxyImplementation)));
        vaults[_owner].init(_owner);
    }

    // This is just a helper that enable user to deposit ERC20 that are available on Aave to supply
    function depositERC20WithAAVE(PYDProxy _vault, IERC20 _asset, uint256 _amount) public {
        require(_amount > 0, "Deposit must be greater than 0");
        IERC20 aToken = IERC20(aave.getReserveData(address(_asset)).aTokenAddress);
        _asset.transferFrom(msg.sender, address(this), _amount);
        _asset.approve(address(aave), _amount);
        aave.supply(address(_asset), _amount, address(this), 0);
        aToken.approve(address(_vault), aToken.balanceOf(address(this)));
        _vault.delegateDeposit(msg.sender, aToken, aToken.balanceOf(address(this)));
    }

}