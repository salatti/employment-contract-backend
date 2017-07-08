const express = require('express');
const Web3 = require('web3');
const contract = require('truffle-contract');
const moment = require('moment');

const router = express.Router();
const web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
const employmentContractArtifacts = require('../truffle/build/contracts/EmploymentContract.json');
const contractCreatorArtifacts = require('../truffle/build/contracts/ContractCreator.json');

const provider = new Web3.providers.HttpProvider('http://localhost:8545');
const ContractCreator = contract(contractCreatorArtifacts);
const defaultAccount = web3.eth.coinbase;
ContractCreator.setProvider(provider);
ContractCreator.defaults({ from: defaultAccount, gas: 4712388 });


router.get('/', (req, res) => {
  let contractCreatorInstance;

  ContractCreator.deployed()
    .then((instance) => {
      contractCreatorInstance = instance;
      console.log(`addr of contract creator: ${contractCreatorInstance.address}`);

      const NewContractEvent = contractCreatorInstance.NewContract({}, { fromBlock: 0, toBlock: 'latest' });
      console.log(NewContractEvent);
      NewContractEvent.get((error, logs) => {
        console.log(logs.length);

        const allEventContracts = [];

        for (let i = 0; i < logs.length; i += 1) {
          const log = logs[i];
          allEventContracts.push({
            employee: log.args.addrOfEmployee,
            contract: log.args.addrOfContract
          });
        }

        res.json(allEventContracts);
      });
    }).catch((err) => {
      console.log(err);
    });
});

router.get('/:id', (req, res) => {
  console.log('Request Id:', req.params.id);

  let deployedAddress;
  let contractCreatorInstance;

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

router.post('/', (req, res) => {
  let contractCreatorInstance;

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
          // console.log(result);
          // result is an object with the following values:
          //
          // result.tx      => transaction hash, string
          // result.logs    => array of decoded events that were triggered within this transaction
          // result.receipt => transaction receipt object, which includes gas used

          let addrOfNewContract;

          for (let i = 0; i < result.logs.length; i += 1) {
            const log = result.logs[i];

            if (log.event === 'NewContract') {
              console.log('Event log:');
              console.log(log);
              addrOfNewContract = log.args.addrOfContract;
              // console.log(log.event);
              break;
            }
          }
          res.json({ address: addrOfNewContract });
        });
    }).catch((err) => {
      console.log(err);
    });
});

module.exports = router;
