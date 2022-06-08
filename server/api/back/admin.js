const bcrypt = require('bcryptjs');
const Admin = require('../../models/admin');
const jwt = require('jsonwebtoken');
const config = require('../../config');
const { hashPassword } = require('../../utils/login');
const getOptions = require('../../utils/getOptions');
const getPageData = require('../../utils/getPageData');
const decodeDsl = require('../../utils/decodeDsl');
const msgRemake = require('../../utils/msgRemake');

const ignoreKeys = '-__v -password';
/**@type {import('..').NormalApi} */
module.exports = {
  'post /login': async function (req, res, next) {
    const { account, password } = req.body;

    const admin = await Admin.findOne({ account }).populate('roleName');
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
    admin.password = undefined;
    res.json({ code: 0, data: { admin, token } });
  },

  'get /list': async function (req, res, next) {
    await getPageData(
      Admin,
      decodeDsl(req.query),
      { populate: 'roleName', select: ignoreKeys },
      res
    );
  },

  get: async function (req, res, next) {
    const token = req.get('Authorization');
    const auth = jwt.decode(token);

    const data = await Admin.findOne({ _id: auth.userId }).populate('roleName').select(ignoreKeys);

    res.status(200).json({ code: 0, data });
  },

  'get /options': async function (req, res, next) {
    let data = await getOptions(Admin, { qualifyCount: { $gt: 0 } });
    res.json({ code: 0, data });
  },

  'patch /:id/password': async function (req, res, next) {
    let { oldPassword, password } = req.body;
    const { id } = req.params;
    let err = null;

    const admin = await Admin.findById(id).catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });

    const isSame = await bcrypt.compare(oldPassword, admin.password);
    if (!isSame) {
      res.json({ code: 402, msg: 'The password is incorrect' });
      return;
    }

    password = await hashPassword(password);
    await Admin.findByIdAndUpdate(id, { password }).catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });

    res.json({ code: 0, msg: 'Modification succeeded' });
  },

  'put /:id': async function (req, res, next) {
    let err = null;
    await Admin.findByIdAndUpdate(req.params.id, req.body).catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: msgRemake(err) });
    res.json({ code: 0, msg: 'Modification succeeded' });
  },

  post: async function (req, res, next) {
    let { password } = req.body;
    req.body.password = await hashPassword(password);
    const admin = new Admin(req.body);
    let err = null;
    await admin.save().catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: msgRemake(err) });
    res.json({ code: 0, msg: 'Addition succeeded' });
  },

  'delete /:id': async function (req, res, next) {
    let err = null;
    await Admin.findByIdAndUpdate(req.params.id, { deleteAt: Date.now() }).catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });
    res.json({ code: 0, msg: 'Deletion succeeded' });
  },
  // 'get /temp': async function (req, res, next) {
  //   let data = await Admin.find().populate('roleName');
  //   res.json({ code: 0, data });
  // },
};
