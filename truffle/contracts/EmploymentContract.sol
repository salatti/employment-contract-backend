pragma solidity ^0.4.11;

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
        if(msg.sender != employeeAddr) throw;
        _;
    }
    
    function acceptContract() onlyEmployee returns(bool) {
        if(block.timestamp <= acceptanceDeadline) {
            acceptTime = block.timestamp;
            return true;
        }
        return false;
    }

    function isContractAccepted() returns(bool) {
        if(acceptTime > 0) {
            return true;
        }
        return false;
    }

}