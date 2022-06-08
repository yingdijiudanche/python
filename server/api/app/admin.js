const bcrypt = require('bcryptjs');
const Admin = require('../../models/admin');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const getOptions = require('../../utils/getOptions');

/**@type {import('..').NormalApi} */
module.exports = {
  'post /login': async function (req, res, next) {
    const { account, password } = req.body;
    const admin = await Admin.findOne({ account });
    if (!admin) {
      res.json({ code: 402, msg: 'Account not found' });
      return;
    }

    const isSame = await bcrypt.compare(password, admin.password);
    if (!isSame) {
      res.json({ code: 402, msg: 'The password is incorrect' });
      return;
    }

    let payload = {
      userId: admin.id,
      expiry: new Date() * 1 + 3600000,
      // expiry : new Date()*1 + 1000
    };
    const token = await jwt.sign(payload, config.jwtSecret, {});
    admin.password = undefined; //相当于 select('-password')

    res.json({ code: 0, data: { admin, token } });
  },
  'get /options': async function (req, res, next) {
    let data = await getOptions(Admin, { qualifyCount: { $gt: 0 } });
    return res.json({ code: 0, data });
  },
  'post /updateToken': async function (req, res, next) {
    var { notifyToken } = req.body;
    let err = null;
    var after = await Admin.findByIdAndUpdate(res.locals.userId, { notifyToken }).catch(
      e => (err = e)
    );
    if (err) return res.json({ code: 1, msg: err.message });

    return res.json({ code: 0 });
  },
};
