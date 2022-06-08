const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OwnRoutes = new Schema(
  {
    routeId: { type: Schema.Types.ObjectId },
    childrenIds: {
      type: [Schema.Types.ObjectId],
      default: [],
    },
  },
  { _id: false }
);

const Role = new Schema({
  name: { type: String, required: true, unique: true },
  addTime: { type: Date, default: Date.now },
  notifyDay: { type: Number, default: 0 },
  priority: { type: Number }, //The smaller the number,The greater the power
  appScope: { type: [Number] }, //对应version.scope
  ownRoutes: {
    type: [OwnRoutes],
    ref: 'routesIds',
    default: [],
  },
  deleteAt: { type: Date }, //已删除就会有删除时间
});
Role.set('toJSON', { virtuals: true });

Role.virtual('routes', {
  ref: 'Route',
  localField: 'ownRoutes.routeId',
  foreignField: '_id',
  sort: { sort: 1 },
  get(routes, option, all) {
    if (routes && all.ownRoutes.length) {
      //没有调用populate的获取 routes是undefined
      routes.forEach((m, i) => {
        //已分配的children id
        let myChildrenIds = all.ownRoutes[i].childrenIds.map(c => c.toString());
        //过滤没权限的children
        m.children = m.children.filter(c => myChildrenIds.includes(c._id.toString()));
      });
    }
    return routes;
  },
});

Role.pre('find', function () {
  this._conditions.deleteAt = { $exists: false };
});

mongoose.model('OwnRoutes', OwnRoutes);
module.exports = mongoose.model('Role', Role);
