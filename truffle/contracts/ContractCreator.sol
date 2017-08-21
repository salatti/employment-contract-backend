pragma solidity ^0.4.15;

import "./EmploymentContract.sol";

contract ContractCreator {

    address public owner;
    address public latest;
    uint numContracts; 

    function ContractCreator() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    event NewContract(
        address indexed addrOfEmployee,
        address indexed addrOfContract
    );

    function createEmplyoymentContract(
        address addrOfEmployee,
        bytes32 employee,
        uint lastAccTime
    )
        onlyOwner
    {
        EmploymentContract newCont =
            new EmploymentContract(addrOfEmployee, employee, lastAccTime);

        latest = newCont;
        numContracts++;
        NewContract(addrOfEmployee, newCont);

    }
    
}

