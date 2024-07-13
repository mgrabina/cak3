// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SafeERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "hardhat/console.sol";
/**
 * @title Company
 * @dev This contract allows companies to create funding rounds, and execute payrole payment
 */
contract Company is Ownable {
    using SafeERC20 for IERC20;

    /// @notice token holding all the capital
    IERC20 public immutable token;

    /// @notice numeric identifier of an employee
    mapping( address => uint256) public employeeId;
    /// @notice relationship holder between address and their current salaires;
    mapping( address => uint256) public salaries;

    /// @notice iterable list of employees
    address[1000] public employees;
    /// @notice count of registered employees
    uint256 public employeeCount;

    address[100] public fundingRounds;
    uint256 public fundingCount;

    constructor(address _holdingsToken) Ownable() {
        token = IERC20(_holdingsToken);

    }

    function addEmployees(address[] calldata _employees, uint256[] calldata _salaries) external onlyOwner {
        require( _employees.length == _salaries.length, "Employee - Salary, lenght missmatch");

        for(uint256 i = 0; i < _employees.length; i++) {

            address employeeAddress = _employees[i];
            uint256 salary = _salaries[i];

            require(salaries[employeeAddress] == 0, "Duplicated employee Record");

            employeeId[employeeAddress] = employeeCount;
            employees[employeeCount] = employeeAddress;
            salaries[employeeAddress] = salary;

            employeeCount++;

        }

    }

    function addFoundingRound() external onlyOwner {

    }

    function liquidBalance() public view returns(uint256){
        return token.balanceOf(address(this));
    }

    function executePeriodPayroll() onlyOwner external {
        uint256 _liquidBalance =  liquidBalance();

        for(uint256 i = 0; i < employeeCount; i++) {

            address employee = employees[i];
            uint256 salary = salaries[employee];

            if(employee == address(0) || salaries[employee] == 0){ break; }

            require(salary <= _liquidBalance, "Not enought balance to cover payrole");

            token.transfer(employee, salary);
            _liquidBalance -= salary;

        }
    }

}
