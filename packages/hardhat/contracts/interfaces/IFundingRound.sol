// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/**
 * @title IFundingRound
 * @dev Interface for the FundingRound contract.
 */
interface IFundingRound {

    /**
     * @notice Emitted when an investor makes a contribution.
     * @param investor The address of the investor.
     * @param amount The amount of USDC contributed.
     */
    event Contribution(address indexed investor, uint256 amount);

    /**
     * @notice Allows an investor to contribute USDC to the funding round.
     * @param amount The amount of USDC to contribute.
     */
    function contribute(uint256 amount) external;

    /**
     * @notice Allows the owner to add addresses to the whitelist.
     * @param _addresses List of addresses to be added to the whitelist.
     */
    function addToWhitelist(address[] calldata _addresses) external;

    /**
     * @notice Allows the owner to remove addresses from the whitelist.
     * @param _addresses List of addresses to be removed from the whitelist.
     */
    function removeFromWhitelist(address[] calldata _addresses) external;

    /**
     * @notice Allows the owner to withdraw investments.
     * @return lbalance The balance withdrawn by the owner.
     */
    function withdrawInvestment() external returns (uint256 lbalance);

    /**
     * @notice Allows investors to check their contribution amount.
     * @param investor The address of the investor.
     * @return The amount of USDC contributed by the investor.
     */
    function getContribution(address investor) external view returns (uint256);
}

