const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Log = new Schema({
  msg: { type: String },
  addTime: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Log', Log);
