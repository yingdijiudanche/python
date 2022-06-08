const Role = require('../../models/role');
const decodeDsl = require('../../utils/decodeDsl');
const getOptions = require('../../utils/getOptions');
const msgRemake = require('../../utils/msgRemake');

/**
 * @type {import('..').NormalApi}
 */
module.exports = {
  'get /all': async function (req, res, next) {
    const data = await Role.find(decodeDsl(req.query), '-__v').lean();
    res.json({ code: 0, data });
  },
  'get /options': async function (req, res, next) {
    let data = await getOptions(Role);
    return res.json({ code: 0, data });
  },

  'delete /:id': async function (req, res, next) {
    let err = null;
    await Role.findByIdAndUpdate(req.params.id, { deleteAt: Date.now() }).catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });
    res.json({ code: 0, msg: 'Deletion succeeded' });
  },

  'put /:id': async function (req, res, next) {
    let err = null;
    await Role.findByIdAndUpdate(req.params.id, req.body).catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });
    res.json({ code: 0, msg: 'Modification succeeded' });
  },

  post: async function (req, res, next) {
    const role = new Role(req.body);
    let err = null;
    await role.save().catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: msgRemake(err) });
    res.json({ code: 0, msg: 'Addition succeeded' });
  },

  'post /assign': async function (req, res, next) {
    const { roleId, ownRoutes } = req.body;
    let err = null;
    await Role.findByIdAndUpdate(roleId, { $set: { ownRoutes } }).catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });
    res.json({ code: 0, msg: 'Assign succeeded' });
  },
};
