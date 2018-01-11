let fs = require('fs'),
  path = require('path'),
  globalConfig = require('../../configuration');

module.exports = (router, responseWrapper, pool) => {
  router.get('/article/:articleId', (req, res, next) => {

    pool.getConnection((err, connection) => {
      if (err) {
        return res.json(responseWrapper({
          status: 0,
          error: 1,
          msg: 'database connect error'
        }));
      }

      // 查找文章信息
      connection.query(
        'select * from article where id=?',
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

          // 检查是否找到目标文章
          if (!results[0]) {
            connection.release();

            return res.json(responseWrapper({
              status: 1,
              error: 1,
              msg: 'no such an article'
            }));
          }

          // 查找作者信息
          let article = results[0];
          connection.query(
            'select name from user where id=?',
            [article.author_id],
            (err, results) => {
              connection.release();

              if (err || !results[0]) {
                article.author = '';
              } else {
                article.author = results[0].name;
              }

              // 读取文章内容
              let filePath = path.join(globalConfig.articlesPath, article.filename);
              fs.stat(filePath, (err, stats) => {
                if (err) {
                  console.log(err);
                  return res.json(responseWrapper({
                    status: 0,
                    error: 1,
                    msg: 'article loss'
                  }));
                }

                if (stats.isFile()) {
                  fs.readFile(filePath, 'utf8', (err, data) => {
                    if (err) {
                      return res.json(responseWrapper({
                        status: 0,
                        error: 1,
                        msg: 'article read failed.'
                      }));
                    }

                    article.content = data;

                    res.json(responseWrapper({
                      data: article
                    }));
                  });
                } else {
                  return res.json(responseWrapper({
                    status: 0,
                    error: 1,
                    msg: 'article loss'
                  }));
                }
              });
            }
          );

        }
      );

    });

  });
};
