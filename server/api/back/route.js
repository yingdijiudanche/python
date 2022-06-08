const Route = require('../../models/route');
const Role = require('../../models/role');

/**
 * @type {import('..').NormalApi}
 */
module.exports = {
  'get /:roleId/all': async function (req, res, next) {
    let err = null;
    let data = await Role.findById(req.params.roleId)
      .populate('routes')
      .catch(e => (err = e));

    if (err) return res.json({ code: 1, msg: err.message });
    if (data.ownRoutes.length > 0) {
      return res.json({ code: 0, data: data.routes });
    }
    data.routes = await Route.find().sort({ sort: 1 }).lean();
    res.json({ code: 0, data: data.routes });
  },

  'delete /:id/:pid?': async function (req, res, next) {
    const { id, pid } = req.params;
    let err = null;
    if (pid) {
      await Route.findByIdAndUpdate(pid, { $pull: { children: { _id: id } } }).catch(
        e => (err = e)
      );
      if (err) return res.json({ code: 1, msg: err.message });
      res.json({ code: 0, msg: 'Deletion succeeded' });
      return;
    }
    await Route.findByIdAndDelete(id).catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });
    res.json({ code: 0, msg: 'Deletion succeeded' });
  },

  'put /:id/:pid?': async function (req, res, next) {
    const { id, pid } = req.params;
    let err = null;
    const { previosParentId, isBecomeChild } = req.body;
    let isEffectParent = pid && (previosParentId || isBecomeChild);
    if (isEffectParent) {
      let actions = [];
      //父级有变化的编辑
      if (previosParentId) {
        actions.push(
          Route.findByIdAndUpdate(previosParentId, { $pull: { children: { _id: id } } })
        );
      }
      actions.push(Route.findByIdAndUpdate(pid, { $push: { children: req.body } }));

      if (isBecomeChild) {
        actions.push(Route.findByIdAndDelete(id));
      }
      await Promise.all(actions).catch(e => (err = e));
      if (err) return res.json({ code: 1, msg: err.message });
      return res.json({ code: 0, msg: 'Modification succeeded' });
    }
    if (pid) {
      //编辑二级路由
      await Route.findOneAndUpdate(
        { _id: pid, 'children._id': id },
        {
          $set: {
            'children.$': req.body,
          },
        }
      ).catch(e => (err = e));
      if (err) return res.json({ code: 1, msg: err.message });
      return res.json({ code: 0, msg: 'Modification succeeded' });
    }
    //编辑一级路由
    await Route.findByIdAndUpdate(id, req.body).catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });
    res.json({ code: 0, msg: 'Modification succeeded' });
  },

  'post /:pid?': async function (req, res, next) {
    const { pid } = req.params;
    const route = new Route(req.body);
    let err = null;
    if (pid) {
      await Route.findByIdAndUpdate(pid, { $push: { children: route } }).catch(e => (err = e));
      if (err) return res.json({ code: 1, msg: err.message });
      res.json({ code: 0, msg: 'Addition succeeded' });
      return;
    }
    await route.save().catch(e => (err = e));
    if (err) return res.json({ code: 1, msg: err.message });
    res.json({ code: 0, msg: 'Addition succeeded' });
  },
};
