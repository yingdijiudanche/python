const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const child = new Schema({
  sort: { type: Number, required: true },
  path: { type: String, required: true },
  component: { type: String, default: '' },
  icon: { type: String, default: '' },
  name: { type: String, required: true },
  isMenu: { type: Boolean, required: true },
});

const Route = new Schema({
  // _id:{type:mongoose.Schema.Types.ObjectId},
  sort: { type: Number, required: true },
  path: { type: String, required: true },
  component: { type: String, default: '' },
  icon: { type: String, default: '' },
  name: { type: String, required: true },
  isMenu: { type: Boolean, required: true },
  children: [child],
  deleteAt: { type: Date }, //已删除就会有删除时间
});

Route.pre('find', function () {
  this._conditions.deleteAt = { $exists: false };
});
module.exports = mongoose.model('Route', Route);
