var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ContractSchema = new Schema({
    address: String,
    created_at: Date
});

module.exports = mongoose.model('Bear', ContractSchema);
