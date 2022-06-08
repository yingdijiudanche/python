const uploadImg = require('../../utils/uploadImg');

/**
 * @type {Object.<string,import('..').ApiHanlder>}
 */
module.exports = {
  'post /image': async function (req, res, next) {
    uploadImg(req, res);
  },
};
