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
    
    // arvo tulee alla promisen kautta, mutta se ei kerkee
    // res.renderiin mukaan?
    var deployedAddress; 

    EmploymentContract.deployed().then(function (instance) {
        console.log(instance.address) // lokittuu res.renderin jälkeen
        deployedAddress = instance.address;
    });

    res.render('truffle', {
        title: 'EmploymentContract testing',
        deployedAddress: deployedAddress
    });

});

module.exports = router;
