import req from '../utils/request'
export default {
  login: params => req.post('admin/login', params),

  getByToken: () => req.get('admin'),
  getList: (params, cancelToken) =>
    req.get('admin/list', { params, cancelToken }),
  getOptions: params => req.get('admin/options', { params }),
  add: data => req.post('admin', data),
  edit: (id, data) => req.put(`admin/${id}`, data),
  editPassword: (id, data) => req.patch(`admin/${id}/password`, data),
  dele: id => req.delete(`admin/${id}`),
}
