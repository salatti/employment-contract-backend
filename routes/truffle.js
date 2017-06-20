var express = require('express');
var router = express.Router();
var Web3 = require("web3");
var contract = require("truffle-contract");
var employmentcontract_artifacts = require("../truffle/build/contracts/EmploymentContract.json")

/* GET home page. */
router.get('/', function (req, res, next) {

    var provider = new Web3.providers.HttpProvider("http://localhost:8545");
    var EmploymentContract = contract(employmentcontract_artifacts);
    EmploymentContract.setProvider(provider);

    var deployedAddress;

    Promise.all([
        EmploymentContract.deployed()
    ]).then(function (result) {

        var instance = result[0];
        
        console.log(instance.address);
        deployedAddress = instance.address;

        res.render('truffle', {
            title: 'EmploymentContract testing',
            deployedAddress: deployedAddress
        });

    }).catch(function (error) {
      
        res.render('error', {
            message: error
        });
    });

});

module.exports = router;
