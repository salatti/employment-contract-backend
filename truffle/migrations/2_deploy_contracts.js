/* global artifacts:true */

const ConvertLib = artifacts.require('./ConvertLib.sol');
const MetaCoin = artifacts.require('./MetaCoin.sol');
const ContractCreator = artifacts.require('./ContractCreator.sol');
const ContractCreatorTestable = artifacts.require('./ContractCreatorTestable.sol');
const EmploymentContract = artifacts.require('./EmploymentContract.sol');
// const EmploymentContractTestable = artifacts.require('./EmploymentContractTestable.sol');

module.exports = function (deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(ContractCreator);
  deployer.deploy(ContractCreatorTestable);
  deployer.deploy(EmploymentContract);
  // deployer.deploy(EmploymentContractTestable);
};
