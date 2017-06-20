var express = require('express');
var router = express.Router();
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var contract = require("truffle-contract");
var employmentcontract_artifacts = require("../truffle/build/contracts/EmploymentContract.json")

/* GET home page. */
router.get('/', function (req, res, next) {

    var provider = new Web3.providers.HttpProvider("http://localhost:8545");
    var EmploymentContract = contract(employmentcontract_artifacts);
    EmploymentContract.setProvider(provider);

    var defaultAccount = web3.eth.coinbase;
    
    var deployedAddress;
    var employmentContract;
    
    EmploymentContract.deployed().then(function (instance) {

        employmentContract = instance;
        deployedAddress = instance.address;

        Promise.all([
            employmentContract.owner.call(defaultAccount, {from: defaultAccount})
        ]).then(function (result) {

            var ownerOfEmploymentContract= result[0];

            res.render('truffle', {
                title: 'EmploymentContract testing',
                deployedAddress: deployedAddress,
                defaultAccount: defaultAccount,
                ownerOfEmploymentContract: ownerOfEmploymentContract
            });
        });

    }).catch(function (error) {

        res.render('error', {
            message: error
        });
    });





});

module.exports = router;
