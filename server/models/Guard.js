const mongoose = require('mongoose');
const Schema = mongoose.Schema;
/**下载前，将参数存在这个表，返回id，
 * 前端通过这个id下载
 * 下载完成后会删掉这条记录
 * 实现一次性无需权限下载文件
 *  */
const Guard = new Schema({
  params: { type: Object },
  query: { type: Object },
});

module.exports = mongoose.model('Guard', Guard);
