const defoSelector = '_id name';
const defoLimit = 0;

/**
 * 获取用于下拉选择的数据
 * @param {import('mongoose').Model} Model
 * @param {import('mongoose').FilterQuery<T>} [byCondition]
 * @param {QueryConfig} [queryConfig]
 * @return {Option[]} 用于前端下拉的选项数组
 * @typedef {Object} Option
 * @property {String} label
 * @property {String} value
 * @template T
 */
async function getOptions(Model, byCondition, queryConfig = {}) {
  const { populate, selector = defoSelector } = queryConfig;
  const { limit = defoLimit, ...rest } = byCondition ?? {};

  let data = await Model.find(rest)
    .populate(populate)
    .limit(limit ? limit * 1 : undefined);

  let [valueKey, labelKey] = selector.split(' ');
  data = data.map(v => ({ label: v[labelKey], value: v[valueKey] }));
  // console.log(selector, data);
  return data;
}
module.exports = getOptions;

/**
 * @typedef {Object} QueryConfig
 * @property {string} [selector] _id name 注意顺序很重要
 * @property {number} [limit] 0
 * @property {string} populate
 */
