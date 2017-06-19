const express = require('express');
const router = express.Router();
const Web3 = require('web3');
const contract = require('truffle-contract');
const employmentcontract_artifacts = require('../truffle/build/contracts/EmploymentContract.json');

/* GET home page. */
router.get('/', (req, res, next) => {
    const provider = new Web3.providers.HttpProvider('http://localhost:8545');
    const EmploymentContract = contract(employmentcontract_artifacts);
    EmploymentContract.setProvider(provider);

    const titlePromise = Promise.resolve('EmploymentContract testing');
    const instancePromise = EmploymentContract.deployed();

    return Promise.all([titlePromise, instancePromise])
        .then(([title, instance]) => res.render('truffle', {
            title,
            deployedAddress: instance.address,
        }));
});

module.exports = router;
