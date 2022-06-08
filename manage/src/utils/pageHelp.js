export const simplify = function (params = {}) {
  let { total, current, pageSize, ...rest } = params
  rest.page = current
  rest.limit = pageSize
  return rest
}
