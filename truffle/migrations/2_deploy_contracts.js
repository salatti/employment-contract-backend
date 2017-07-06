var ConvertLib = artifacts.require("./ConvertLib.sol");
var MetaCoin = artifacts.require("./MetaCoin.sol");
var ContractCreator = artifacts.require("./ContractCreator.sol");
var EmploymentContract = artifacts.require("./EmploymentContract.sol");

module.exports = function(deployer) {
  deployer.deploy(ConvertLib);
  deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(MetaCoin);
  deployer.deploy(ContractCreator);
  //deployer.deploy(EmploymentContract);
};
