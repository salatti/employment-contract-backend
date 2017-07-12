pragma solidity ^0.4.11;

import "./EmploymentContract.sol";

contract ContractCreator {

    address public owner;

    struct DeployedEmplyomentContract {
        address contractAddr;
        address employeeAddr;
    }

    mapping (uint => DeployedEmplyomentContract) public employmentContracts;
    address public last;
    uint numContracts; 

    function ContractCreator() {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if(msg.sender != owner) throw;
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
        returns(bool)
    {
        EmploymentContract newCont =
            new EmploymentContract(addrOfEmployee, employee, lastAccTime);

        last = newCont;
        uint id = numContracts++;
        employmentContracts[id] =
            DeployedEmplyomentContract(newCont, addrOfEmployee);
        
        NewContract(addrOfEmployee, newCont);

        return true;
    }


    // Everyone can call this creating a dos attack
    function findByEmployeeAddr(address addrOfEmployee) returns (address) {
        
        if(numContracts == 0) return;

        for (var index = numContracts - 1; index >= 0; index--) {
            if(employmentContracts[index].employeeAddr == addrOfEmployee) 
                return employmentContracts[index].contractAddr;

            if(index == 0) return;
        }

    }

}

