const customLabels = {
  docs: 'data',
  totalDocs: 'total',
  page: 'current',
  limit: 'pageSize',
  totalPages: false,
  nextPage: false,
  prevPage: false,
  hasPrevPage: false,
  hasNextPage: false,
  pagingCounter: false,
};

/**
 * 分页取数据
 * @param {import('mongoose').Model} model
 * @param {Object} query
 * @param {import('mongoose').PaginateOptions} options
 * @param {import('express').Response} res
 *
 */
module.exports = async function (model, { page, limit, sort, ...rest }, options, res) {
  options.customLabels = customLabels;
  options.page = page;
  options.limit = limit;
  options.sort = sort;
  rest = rest ?? {};
  rest.deleteAt = { $exists: false };
  let pageData = await model.paginate(rest, options);
  pageData.code = 0;
  // console.log(pageData.data);
  res.json(pageData);
};

/** @see {@link[https://www.npmjs.com/package/mongoose-paginate-v2]} */
