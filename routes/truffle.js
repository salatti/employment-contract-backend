const express = require('express');
const Web3 = require('web3');
const contract = require('truffle-contract');
const moment = require('moment');

const router = express.Router();
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const employmentContractArtifacts = require('../truffle/build/contracts/EmploymentContract.json');
const contractCreatorArtifacts = require('../truffle/build/contracts/ContractCreator.json');

router.get('/', (req, res) => {
  const provider = new Web3.providers.HttpProvider('http://localhost:8545');
  const EmploymentContract = contract(employmentContractArtifacts);
  EmploymentContract.setProvider(provider);

  const ContractCreator = contract(contractCreatorArtifacts);
  ContractCreator.setProvider(provider);

  const defaultAccount = web3.eth.coinbase;

  EmploymentContract.defaults({ from: defaultAccount });

  let deployedAddress;
  let employmentContractInstance;
  let contractCreatorInstance;

  ContractCreator.deployed().then((instance) => {
    contractCreatorInstance = instance;

    contractCreatorInstance.last.call()
      .then((address) => {
        EmploymentContract.at(address)
          .then((instance) => {
            employmentContractInstance = instance;
            deployedAddress = instance.address;

            Promise.all([
              employmentContractInstance.employeeAddr.call(),
              employmentContractInstance.employeeName.call(),
              employmentContractInstance.creationTime.call(),
              employmentContractInstance.acceptTime.call()
            ]).then(([owner, name2, creationTime, acceptTime]) => {
              console.log(acceptTime.toNumber());

              const ownerOfEmploymentContract = owner;
              const name = web3.toAscii(name2);

              const currentBlocktime = moment.unix(creationTime).format('DD/MM/YYYY HH:mm:ss');
              const acceptTimeFormatted = moment.unix(acceptTime).format('DD/MM/YYYY HH:mm:ss');

              res.render('truffle', {
                title: 'EmploymentContract testing',
                deployedAddress,
                defaultAccount,
                ownerOfEmploymentContract,
                employeeName: name,
                time: currentBlocktime,
                acceptTime: acceptTimeFormatted
              });
            });
          })
          .catch((error) => {
            res.render('error', { message: error });
          });
      });
  });
});

router.get('/test', (req, res, next) => {
  let provider = new Web3.providers.HttpProvider('http://localhost:8545');

  let ContractCreator = contract(contractCreatorArtifacts);
  ContractCreator.setProvider(provider);

  let defaultAccount = web3.eth.coinbase;

  let deployedAddress;
  let contractCreator;

  ContractCreator.deployed().then((instance) => {
    contractCreator = instance;
    deployedAddress = instance.address;

    Promise.all([
      employmentContract.employeeAddr.call(defaultAccount, { from: defaultAccount }),

    ]).then(([owner, name2, creationTime, acceptTime]) => {
      console.log(acceptTime.toNumber());
      let ownerOfEmploymentContract = owner;
      let name = web3.toAscii(name2);

      let currentBlocktime = moment.unix(creationTime).format('DD/MM/YYYY HH:mm:ss');
      var acceptTime = moment.unix(acceptTime).format('DD/MM/YYYY HH:mm:ss');

      res.render('truffle', {
        title: 'EmploymentContract testing',
        deployedAddress,
        defaultAccount,
        ownerOfEmploymentContract,
        employeeName: name,
        time: currentBlocktime,
        acceptTime
      });
    });
  }).catch((error) => {
    res.render('error', {
      message: error
    });
  });
});

module.exports = router;
