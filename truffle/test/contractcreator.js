/* global artifacts:true contract:true assert:true */
const Web3 = require('web3');
const moment = require('moment');

const web3 = new Web3();
const ContractCreator = artifacts.require('./ContractCreatorTestable.sol');
const employeeName = web3.fromAscii('Test User');
let employeeAddr;
const lastAccTime = moment(new Date()).unix();

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

  it('should not allow contract creation from other than owner', () => {
    let ContractCreatorInstance;

    return ContractCreator.deployed()
      .then((instance) => {
        ContractCreatorInstance = instance;
        return ContractCreatorInstance.createEmplyoymentContract(accounts[2],
          employeeName, web3.toBigNumber(lastAccTime), { from: accounts[1] });
      })
      .then(assert.fail)
      .catch((error) => {
        assert(
          error.message.indexOf('invalid opcode') >= 0,
          'should throw invalid opcode exception.'
        );
      });
  });
});
