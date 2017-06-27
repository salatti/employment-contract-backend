pragma solidity ^0.4.11;

contract EmploymentContract {

    address public owner;
    bytes32 public employeeName;

    function EmploymentContract() {
        owner = msg.sender;
        
    }

    function setData(bytes32 asd) {
        employeeName = asd;
    }


}