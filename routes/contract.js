var express = require('express');
var router = express.Router();
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var contract = require("truffle-contract");
var employmentcontract_artifacts = require("../truffle/build/contracts/EmploymentContract.json")

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('contract', { title: 'New Contract' });
});

router.post('/', function (req, res) {
    console.log(req.body.employeeName)
    

    var provider = new Web3.providers.HttpProvider("http://localhost:8545");
    var EmploymentContract = contract(employmentcontract_artifacts);
    EmploymentContract.setProvider(provider);

    var defaultAccount = web3.eth.coinbase;

    var deployedAddress;
    var employmentContract;

    EmploymentContract.deployed().then(function (instance) {

        employmentContract = instance;
        deployedAddress = instance.address;
        var nameToSend = web3.fromAscii(req.body.employeeName);
        console.log(nameToSend)
        Promise.all([
            employmentContract.setData(web3.fromAscii(req.body.employeeName, 32), { from: defaultAccount })

        ]).then(function ([result]) {
            console.log(result)
            res.send(req.body)
        });

    }).catch(function (error) {

        res.render('error', {
            message: error
        });
    });

})



module.exports = router;
