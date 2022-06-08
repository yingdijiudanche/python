const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');

const Admin = new Schema({
  name: { type: String, required: true },
  account: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roleId: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  addTime: { type: Date, default: Date.now },
  deleteAt: { type: Date }, //已删除就会有删除时间
});

Admin.set('toJSON', { virtuals: true });

Admin.virtual('roleName', {
  ref: 'Role',
  localField: 'roleId',
  foreignField: '_id',
  justOne: true,
  get(v) {
    return v?.name;
  },
});

Admin.pre('find', function () {
  this._conditions.deleteAt = { $exists: false };
});
Admin.plugin(mongoosePaginate);
module.exports = mongoose.model('Admin', Admin);
