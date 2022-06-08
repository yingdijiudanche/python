const baseExtra = str => str.split(',').map(v => v.split(':'));
const genSort = function (type) {
  switch (type) {
    case 'ascend':
      return 1;
    case 'descend':
      return -1;
    default:
      return 0;
  }
};
const genNumCompares = function ([min = '', max = '']) {
  let exp = {};
  if (min != '') {
    exp.$gte = min;
  }
  if (max != '') {
    exp.$lte = max;
  }
  return exp;
};
const genDateCompares = function ([min = '', max = '']) {
  let exp = {};
  if (min != '') {
    exp.$gte = new Date(min * 1);
  }
  if (max != '') {
    exp.$lte = new Date(max * 1);
  }
  return exp;
};
/**@type {ParserByName} */
const parserByName = {
  search: {
    extra: baseExtra,
    transform: ([k, str]) => [k, new RegExp(str, 'i')],
  },
  numRange: {
    extra: str => baseExtra(str).map(([k, v]) => [k, v.split('|')]),
    transform: ([k, range]) => [k, genNumCompares(range)],
  },
  timeRange: {
    extra: str => baseExtra(str).map(([k, v]) => [k, v.split('|')]),
    transform: ([k, range]) => [k, genDateCompares(range)],
  },
  equal: {
    extra: baseExtra,
    transform: ([k, v]) => [k, v],
  },
  sort: {
    extra: baseExtra,
    transform: ([k, str]) => ['sort', { [k]: genSort(str) }],
  },
  includes: {
    extra: baseExtra,
    transform: ([k, arr]) => [k, { $in: arr.split('|') }],
  },
};

/**
 *
 * @param {DSL} dsl
 * @typedef {object} DSL
 * @property {number} [page] 1
 * @property {number} [limit] 10
 * @property {string} [search] 'name:hh'
 * @property {string} [numRange] 'age:5|10,score:99|123'
 * @property {string} [timeRange] 'addTime:2020-01-23|2020-02-23'
 * @property {string} [includes] 'level:3|8|9'
 * @property {string} [equal] 'page:1,limit:10'
 * @property {string} [sort] 'begin:descend'
 *@returns {DecodedParams}
 */
const decodeDsl = function ({ page, limit, ...dsl }) {
  let kvs = Array.from(Object.entries(dsl));
  let nkvs = kvs.map(([k, v]) => {
    let p = parserByName[k];
    let values = p.extra(v);
    let nkv = values.map(p.transform);
    return nkv;
  });
  let kvArr = nkvs.flat();
  let condition = Object.fromEntries(kvArr);
  return { page, limit, ...condition };
};

module.exports = decodeDsl;

/**
 * @typedef {Object} ParserByName
 * @property {Search} search
 *
 *
 * @typedef {object} Search
 * @property {(v:string)=>[string,string]} extra
 * @property {(v:[string,string])=>[string,RegExp]} transform
 *
 * @typedef {object} SortParam
 * @property {Object.<string,1|-1|0>}[sort]
 *
 * @typedef {{page:number,limit:number} & SortParam & Object.<string,string>} DecodedParams
 */
