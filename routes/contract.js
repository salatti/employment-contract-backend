const express = require('express');
const Web3 = require('web3');
const contract = require('truffle-contract');
const moment = require('moment');

const router = express.Router();
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const employmentContractArtifacts = require('../truffle/build/contracts/EmploymentContract.json');
const contractCreatorArtifacts = require('../truffle/build/contracts/ContractCreator.json');

router.get('/', (req, res) => {
  res.render('index', { title: 'Placeholder for vue.js view' });
});

router.get('/:id', (req, res) => {
  console.log('Request Id:', req.params.id);

  const provider = new Web3.providers.HttpProvider('http://localhost:8545');
  const ContractCreator = contract(contractCreatorArtifacts);

  ContractCreator.setProvider(provider);

  const defaultAccount = web3.eth.coinbase;

  let deployedAddress;
  let contractCreatorInstance;

  ContractCreator.defaults({ from: defaultAccount, gas: 4712388 });

  const employeeAddr = req.params.id;

  console.log('Finding');

  ContractCreator.deployed().then((instance) => {
    console.log('ContractCreator found');

    contractCreatorInstance = instance;
    deployedAddress = instance.address;
    console.log(`addr of contract creator: ${deployedAddress}`);

    Promise.all([
      contractCreatorInstance.findByEmployeeAddr.call(employeeAddr)
    ])
      .then(([result]) => {
        console.log(result);
        return res.send(result);
      }).catch((error) => {
        console.log('Unexpected error.');
        return res.send(error);
      });
  })
    .catch((error) => {
      console.log(error);
      return res.send(error);
    });
});

router.post('/new', (req, res) => {
  const provider = new Web3.providers.HttpProvider('http://localhost:8545');
  const ContractCreator = contract(contractCreatorArtifacts);
  ContractCreator.setProvider(provider);

  const defaultAccount = web3.eth.coinbase;

  let contractCreatorInstance;

  ContractCreator.defaults({ from: defaultAccount, gas: 4712388 });

  // req params for new contract

  const employeeName = web3.fromAscii(req.body.employeeName);
  const employeeAddr = req.body.employeeAddr;
  const lastAccTime = moment(req.body.lastAccTime).unix();

  console.log('Creating new');

  ContractCreator.deployed()
    .then((instance) => {
      console.log('ContractCreator found');

      contractCreatorInstance = instance;
      const deployedAddress = instance.address;
      console.log(`addr of contract creator: ${deployedAddress}`);

      Promise.all([
        contractCreatorInstance
          .createEmplyoymentContract(employeeAddr, employeeName, web3.toBigNumber(lastAccTime))
      ])
        .then(([result]) => {
          console.log(result);
          res.send(result);
        });
    }).catch((err) => {
      console.log(err);
    });
});

module.exports = router;
