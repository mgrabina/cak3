// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {FundingRound} from "./FundingRound.sol";

contract FundingRoundFactory {

	event LaunchedFundingRound(address indexed roundAddress, address indexed owner);
	
	function createFundingRound(
	address _owner,
	address _usdc,
	uint256 _goal,
	bool _whitelistEnabled,
	address[] memory _whitelist
	) external returns (address) {
		require(_owner != address(0), "Owner address cannot be zero.");
		require(_goal > 0, "Goal amount must be greater than zero.");
		
		FundingRound fundingRound = new FundingRound(
			_owner, _usdc, _goal, _whitelistEnabled, _whitelist
		);


		address fundingRoundAddress = address(fundingRound);

		emit LaunchedFundingRound(fundingRoundAddress, _owner);

		return fundingRoundAddress;
	}
}
