const Log = require('../../models/log');
const msgRemake = require('../../utils/msgRemake');

/**
 * @type {import('..').NormalApi}
 */
module.exports = {
  post: async function (req, res, next) {
    const log = new Log(req.body);
    let err = null;
    await log.save().catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: msgRemake(err) });
    res.json({ code: 0, msg: 'Addition succeeded' });
  },
  get: async function (req, res, next) {
    let data = await Log.find();
    res.json({ code: 0, data });
  },
};
