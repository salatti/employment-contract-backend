/* global artifacts:true contract:true assert:true */
const ContractCreator = artifacts.require('./ContractCreatorTestable.sol');

contract('ContractCreator', (accounts) => {
  it('should set owner correctly', () => ContractCreator.deployed()
    .then(instance => instance.owner.call(accounts[0]))
    .then((result) => {
      assert.equal(result, accounts[0], 'contract owner was not the first account');
    }));

  it('should have 0 created contracts', () => ContractCreator.deployed()
    .then(instance => instance.getNumContracts.call(accounts[1]))
    .then((result) => {
      assert.equal(result, 0, 'there was created contracts');
    }));
});
