let authenticate = require('../../lib/middleware/authenticate'),
  fs = require('fs'),
  path = require('path'),
  md5 = require('md5'),
  globalConfig = require('../../configuration');

module.exports = (router, responseWrapper, pool) => {
  router.delete('/article/:articleId', authenticate, (req, res, next) => {

    pool.getConnection((err, connection) => {
      if (err) {
        return res.json(responseWrapper({
          status: 0,
          error: 1,
          msg: 'database connect error'
        }));
      }

      // 查询待删除的文章信息
      connection.query(
        'select filename from article where id=?',
        [req.params.articleId],
        (err, results) => {
          if (err) {
            connection.release();

            return res.json(responseWrapper({
              status: 0,
              error: 1,
              msg: 'read error'
            }));
          }

          // 删除数据库中相应文章信息
          connection.query(
            'delete from article where id=?',
            [req.params.articleId],
            (err, result) => {
              connection.release();

              if (err) {
                return res.json(responseWrapper({
                  status: 0,
                  error: 1,
                  msg: 'delete error'
                }));
              }

              res.json(responseWrapper({
                data: result
              }));
            }
          );

          // 删除对应文档
          let filePath = path.join(globalConfig.articlesPath, results[0].filename);
          fs.stat(filePath, (err, stats) => {
            if (err) {
              console.log(err);
              return;
            }

            if (stats.isFile()) {
              fs.unlink(filePath, err => {
                if (err) {
                  console.log(err);
                } else {
                  console.log(`${filePath} deleted`);
                }
              });
            }
          });

        }
      );


    });

  });
};
