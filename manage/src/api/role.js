import req from '../utils/request'

export default {
  getAll: () => req.get('role/all'),
  edit: (id, data) => req.put(`role/${id}`, data),
  dele: id => req.delete(`role/${id}`),
  add: data => req.post('role', data),
  assignRoutes: data => req.post('role/assign', data),
}
