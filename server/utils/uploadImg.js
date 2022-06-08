const imageThumbnail = require('image-thumbnail');
const fs = require('fs');
const path = require('path');
const imageFunction = require('image-thumbnail');
const formdataParse = require('express-form-data');
const Threshold = 1024 * 500; //大于500k都要生成缩略图
/**@type {imageFunction.Options} */
const thumbOptions = { width: 300 };

const saveThumb = function (buffer, originalPath) {
  const pushIn = pathName => err => {
    if (err) {
      //todo log err
      pathName = pathName.replace(/thumbnail/, 'original');
    }
  };

  let pathName = originalPath.replace(/original/, 'thumbnail');
  fs.writeFile(pathName, buffer, pushIn(pathName));
  return pathName;
};

const fileHandler = formdataParse.parse({ uploadDir: 'uploads/images/original/' });
/**
 *
 * @param {import('express').Request} req
 * @param {*} res
 */
module.exports = function (req, res) {
  fileHandler(req, res, async function (err) {
    let { image } = req.files;
    if (!/image\/*/.test(image.type)) {
      fs.unlink(image.path, function (err) {
        console.log(err);
      });
      res.json({ code: 1, msg: 'Not acceptable file' });
      return;
    }
    let { fileSuffix } = req.body;
    let originalPath = image.path;
    if (fileSuffix) {
      originalPath = `${image.path}.${fileSuffix}`;
      fs.renameSync(image.path, originalPath);
    }
    let thumbPath = originalPath;
    if (image.size > Threshold) {
      let p = path.resolve(__dirname, '..', originalPath);
      const buffer = await imageThumbnail(p, thumbOptions);
      thumbPath = saveThumb(buffer, originalPath);
    }
    res.json({ code: 0, data: `http://${req.get('host')}/${thumbPath.replace(/\\/g, '/')}` });
  });
};
