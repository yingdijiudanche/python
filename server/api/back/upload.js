const uploadImg = require('../../utils/uploadImg');

/**
 * @type {import('..').NormalApi}>}
 */
module.exports = {
  'post /image': async function (req, res, next) {
    uploadImg(req, res);
  },
};
