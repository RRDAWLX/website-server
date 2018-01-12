let authenticate = require('../../lib/middleware/authenticate'),
  fs = require('fs'),
  path = require('path'),
  md5 = require('md5'),
  globalConfig = require('../../configuration');

module.exports = (router, pool) => {
  router.delete('/article/:articleId', authenticate, (req, res, next) => {

    pool.getConnection((err, connection) => {
      if (err) {
        return res.stdjson({
          status: 0,
          error: 1,
          msg: 'database connect error'
        });
      }

      // 查询待删除的文章信息
      connection.query(
        'select * from article where id=?',
        [req.params.articleId],
        (err, results) => {
          if (err) {
            connection.release();

            return res.stdjson({
              status: 0,
              error: 1,
              msg: 'read error'
            });
          }

          // 检验当前用户是否是该文章的作者
          if (!results[0] || (results[0].author_id !== req.user.id)) {
            connection.release();

            return res.stdjson({
              status: 1,
              error: 1,
              msg: 'not the author of this article'
            });
          }

          // 删除数据库中相应文章信息
          connection.query(
            'delete from article where id=?',
            [req.params.articleId],
            (err, result) => {
              connection.release();

              if (err) {
                return res.stdjson({
                  status: 0,
                  error: 1,
                  msg: 'delete error'
                });
              }

              res.stdjson({
                data: {
                  success: 1
                }
              });
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
