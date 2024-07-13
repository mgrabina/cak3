// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Company} from "./Company.sol";


/**
 * @title Cake
 * @dev Factory contract to create instances of the Company contract.
 */
contract Cak3 {
    // Array to keep track of created Company instances
    mapping( uint256 => address) public companies;
    uint256 public companyCount;

    /**
     * @notice Event emitted when a new Company is created.
     * @param company The address of the newly created Company contract.
     */
    event CompanyCreated(address indexed company);

    /**
     * @notice Creates a new Company instance.
     * @param _holdingsToken Address of the token to manage liquidity
     * @param _companyOwner Address in charge of administering holdings
     * @return company The address of the newly created Company contract.
     */
    function createCompany(address _holdingsToken, address _companyOwner ) external returns (address company) {
        Company newCompany = new Company(_holdingsToken, _companyOwner);
        companies[companyCount] = address(newCompany);
        emit CompanyCreated(address(newCompany));
        return address(newCompany);
    }

    /**
     * @notice Returns the total number of created Company instances.
     * @return count The total number of created Company contracts.
     */
    function getCompaniesCount() external view returns (uint256 count) {
        return companyCount;
    }

    /**
     * @notice Returns the address of the Company contract at a specific index.
     * @param index The index of the Company contract in the array.
     * @return company The address of the Company contract.
     */
    function getCompany(uint256 index) external view returns (address company) {
        return address(companies[index]);
    }
}

