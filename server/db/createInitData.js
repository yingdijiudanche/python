const mongoose = require('mongoose');
const admin = require('../models/admin');
const route = require('../models/route');
const role = require('../models/role');
const { hashPassword } = require('../utils/login');

module.exports = async conn => {
  // route.deleteMany({})
  const [adminsLen, routesLen, rolesLen] = await Promise.all([
    admin.countDocuments(),
    route.countDocuments(),
    role.countDocuments(),
  ]);

  const initAdmin = async roleId => {
    let password = await hashPassword('123');
    const data = {
      name: 'admin',
      account: 'admin',
      password,
      roleId,
    };
    const superAdmin = new admin(data);
    superAdmin.save();
  };

  if (rolesLen === 0) {
    const roleEntity = new role({ name: 'Super Admin' });
    const superRole = await roleEntity.save();
    if (adminsLen === 0) {
      initAdmin(superRole.id);
    }
  }
  if (routesLen === 0) {
    const baseRoutes = [
      { sort: 1, path: '/dashboard', component: 'dashboard', name: '仪表盘', isMenu: true },
      {
        sort: 2,
        path: '/backstage',
        component: '',
        name: '后台管理',
        isMenu: true,
        children: [
          {
            _id: mongoose.Types.ObjectId(),
            sort: 1,
            path: '/admin/index',
            component: 'admin/index',
            name: '管理员列表',
            isMenu: true,
          },
          {
            _id: mongoose.Types.ObjectId(),
            sort: 2,
            path: '/admin/modify',
            component: 'admin/modify',
            name: '编辑管理员',
            isMenu: false,
          },
          {
            _id: mongoose.Types.ObjectId(),
            sort: 3,
            path: '/role/assign',
            component: 'role/assign',
            name: '分配权限',
            isMenu: false,
          },
          {
            _id: mongoose.Types.ObjectId(),
            sort: 4,
            path: '/route/index',
            component: 'route/index',
            name: '路由管理',
            isMenu: true,
          },
          {
            _id: mongoose.Types.ObjectId(),
            sort: 5,
            path: '/route/modify',
            component: 'route/modify',
            name: '编辑路由',
            isMenu: false,
          },
          {
            _id: mongoose.Types.ObjectId(),
            sort: 6,
            path: '/role/index',
            component: 'role/index',
            name: '角色列表',
            isMenu: true,
          },
          {
            _id: mongoose.Types.ObjectId(),
            sort: 7,
            path: '/role/modify',
            component: 'role/modify',
            name: '编辑角色',
            isMenu: false,
          },
        ],
      },
    ];
    route.insertMany(baseRoutes);
  }
};
