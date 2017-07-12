pragma solidity ^0.4.11;

import "./ContractCreator.sol";

contract ContractCreatorTestable is ContractCreator {

    function getNumContracts() constant returns(uint) {
        return numContracts;
    }

}