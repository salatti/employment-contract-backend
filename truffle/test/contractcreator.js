/* global artifacts:true contract:true assert:true */
const ContractCreator = artifacts.require('./ContractCreator.sol');

contract('ContractCreator', (accounts) => {
  it('should set owner correctly', () => ContractCreator.deployed()
    .then(instance => instance.owner.call(accounts[0]))
    .then((result) => {
      assert.equal(result, accounts[0], 'Contract owner was not the first account');
    }));
});
