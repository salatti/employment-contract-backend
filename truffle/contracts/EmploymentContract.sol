pragma solidity ^0.4.11;

contract EmploymentContract {

    address public owner;

    function EmploymentContract() {
        owner = msg.sender;
    }


}