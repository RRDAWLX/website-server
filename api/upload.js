let formidable = require('formidable'),
  globalConfig = require('../configuration'),
  authenticate = require('../lib/middleware/authenticate'),
  fs = require('fs'),
  path = require('path'),
  md5 = require('md5');

module.exports = (router, pool) => {

  /* GET users listing. */
  router.post('/upload', authenticate, (req, res, next) => {

    let form = new formidable.IncomingForm();
    form.uploadDir = globalConfig.tmpPath;  // 暂存目录
    // form.keepExtensions = true;   // 保留文件扩展名
    let files = [];

    form.parse(req);

    form.on('file', (name, file) => {
      file.name = `${md5(file)}_${file.name}`;  // 根据文件内容修改文件名，防止具有相同文件名的不同文件互相覆盖。
      files.push(file);
    });

    form.on('end', () => {
      if (files[0]) {
        // 将文件夹移至目标文件夹，并修改为正确的文件名。
        fs.rename(files[0].path, path.join(globalConfig.imagesPath, files[0].name), err => {
          if (err) {
            console.log(err);
            return res.stdjson({
              status: 0,
              error: 1,
              msg: '500'
            });
          }

          res.stdjson({
            data: {
              imageUrl: `/images/${files[0].name}`
            }
          });
        });
      } else {
        res.stdjson({
          status: 1,
          error: 1,
          msg: 'no file'
        });
      }
    });
  });

};
