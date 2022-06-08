import req from '../utils/request'

export default {
  getAllByRoleId: roleId => req.get(`route/${roleId}/all`),
  edit: (id, data, pid) => req.put(`route/${id}${pid ? `/${pid}` : ''}`, data),
  dele: (id, pid) => req.delete(`route/${id}${pid ? `/${pid}` : ''}`),
  add: (data, pid) => req.post(`route${pid ? `/${pid}` : ''}`, data),
}
