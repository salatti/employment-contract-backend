pragma solidity ^0.4.15;

contract EmploymentContract {

    address public employerAddr;
    address public employeeAddr;
    bytes32 public employeeName;
    uint public creationTime;
    uint public acceptanceDeadline;
    uint public acceptTime;

    function EmploymentContract(
        address addrOfEmployee,
        bytes32 employee,
        uint deadline
     ) {
        employerAddr = msg.sender;
        employeeAddr = addrOfEmployee;
        creationTime = block.timestamp;
        acceptanceDeadline = deadline;
        employeeName = employee;
    }

    modifier onlyEmployee() {
        require(msg.sender == employeeAddr);
        _;
    }
    
    function acceptContract() onlyEmployee {
        if(block.timestamp <= acceptanceDeadline) {
            acceptTime = block.timestamp;
        }
    }

    function isContractAccepted() constant returns(bool) {
        if(acceptTime > 0) {
            return true;
        }
        return false;
    }

}