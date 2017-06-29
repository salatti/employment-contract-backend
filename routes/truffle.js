var express = require('express');
var router = express.Router();
var Web3 = require("web3");
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
var contract = require("truffle-contract");
var employmentcontract_artifacts = require("../truffle/build/contracts/EmploymentContract.json")
var moment = require("moment");
var Contract = require("../models/contract");

/* GET home page. */
router.get('/', function (req, res, next) {

    var provider = new Web3.providers.HttpProvider("http://localhost:8545");
    var EmploymentContract = contract(employmentcontract_artifacts);
    EmploymentContract.setProvider(provider);

    var defaultAccount = web3.eth.coinbase;

    var deployedAddress;
    var employmentContract;

    var first = Contract.findOne({}, {}, { sort: { 'created_at' : -1 } },function (err, result) {
        if (err) console.log(err);
        console.log(result); // Space Ghost is a talk show host.


        EmploymentContract.at(result.address).then(function (instance) {

            employmentContract = instance;
            deployedAddress = instance.address;

            Promise.all([
                employmentContract.employeeAddr.call(defaultAccount, { from: defaultAccount }),
                employmentContract.employeeName.call(defaultAccount, { from: defaultAccount }),
                employmentContract.creationTime.call(defaultAccount, { from: defaultAccount }),
                employmentContract.acceptTime.call(defaultAccount, { from: defaultAccount })

            ]).then(function ([owner, name2, creationTime, acceptTime]) {

                console.log(acceptTime.toNumber())
                var ownerOfEmploymentContract = owner;
                var name = web3.toAscii(name2);

                var currentBlocktime = moment.unix(creationTime).format("DD/MM/YYYY HH:mm:ss");
                var acceptTime = moment.unix(acceptTime).format("DD/MM/YYYY HH:mm:ss");

                res.render('truffle', {
                    title: 'EmploymentContract testing',
                    deployedAddress: deployedAddress,
                    defaultAccount: defaultAccount,
                    ownerOfEmploymentContract: ownerOfEmploymentContract,
                    employeeName: name,
                    time: currentBlocktime,
                    acceptTime: acceptTime
                });
            });

        }).catch(function (error) {

            res.render('error', {
                message: error
            });
        });
    });




});

module.exports = router;
