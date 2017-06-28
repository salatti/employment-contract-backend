var express = require('express');
var router = express.Router();
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var contract = require("truffle-contract");
var employmentcontract_artifacts = require("../truffle/build/contracts/EmploymentContract.json")
var moment = require("moment");

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Placeholder for vue.js view' });
});

router.post('/new', function (req, res) {

    var provider = new Web3.providers.HttpProvider("http://localhost:8545");
    var EmploymentContract = contract(employmentcontract_artifacts);
    EmploymentContract.setProvider(provider);

    var defaultAccount = web3.eth.coinbase;

    var deployedAddress;
    var employmentContract;

    EmploymentContract.defaults({
        from: defaultAccount,
        gas: 4712388    
    });

    // req params for new contract

    var employeeName = web3.fromAscii(req.body.employeeName);
    var employeeAddr = req.body.employeeAddr;
    var lastAccTime = moment(req.body.lastAccTime).unix();

    console.log(employeeName)
    console.log(employeeAddr)
    console.log(lastAccTime)

    //res.send("asd");

    console.log("Creating new");
    EmploymentContract.new(
        employeeAddr,
        employeeName,
        web3.toBigNumber(lastAccTime)
    ).then(function (instance) {
        console.log("Created");

        employmentContract = instance;
        res.send(instance.address);
    }).catch(function (err) {
        console.log(err);

        // There was an error! Handle it.
    });




    // EmploymentContract.deployed().then(function (instance) {

    //     employmentContract = instance;
    //     deployedAddress = instance.address;
    //     var nameToSend = web3.fromAscii(req.body.employeeName);
    //     console.log(nameToSend)
    //     Promise.all([
    //         employmentContract.setData(web3.fromAscii(req.body.employeeName, 32), { from: defaultAccount })

    //     ]).then(function ([result]) {
    //         console.log(result)
    //         res.send(req.body)
    //     });

    // }).catch(function (error) {

    //     res.render('error', {
    //         message: error
    //     });
    // });

})



module.exports = router;
