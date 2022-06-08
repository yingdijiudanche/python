/**
 * 将数组按照 给定函数返回的true false 分组
 * @param {(v)=>boolean} predicate
 * @param {[[],[]]} list
 * @returns [trueArr,falseArr]
 */
function groupByCondition(predicate, list) {
  let t = [],
    f = [];
  for (let i = 0; i < list.length; i++) {
    const v = list[i];
    if (predicate(v)) {
      t.push(v);
    } else {
      f.push(v);
    }
  }
  return [t, f];
}

/**
 * 将数组按照给定的key 分组
 * @param {(v)=>any} keyTaker
 * @param {any[]} list
 */
function groupByKey(keyTaker, list) {
  let map = new Map();
  for (let i = 0; i < list.length; i++) {
    const v = list[i];
    const k = keyTaker(v);
    if (map.has(k)) {
      map.get(k).push(v);
    } else {
      map.set(k, [v]);
    }
  }
  return Array.from(map.values());
}

module.exports = { groupByCondition, groupByKey };
