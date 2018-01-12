let authenticate = require('../../lib/middleware/authenticate'),
  fs = require('fs'),
  path = require('path'),
  md5 = require('md5'),
  globalConfig = require('../../configuration');

module.exports = (router, pool) => {

  router.post('/article', authenticate, (req, res, next) => {

    // 确定文件名和文件保存路径
    let fileName = md5(req.user.id + req.body.title + Date.now()).slice(0, 10) + '.txt',
      filePath = path.join(globalConfig.articlesPath, fileName);

    // 将文章内容写入文件
    fs.writeFile(filePath, req.body.content, err => {
      if (err) {
        return res.stdjson({
          status: 0,
          error: 1,
          msg: 'error 1'
        });
      }

      pool.getConnection((err, connection) => {

        if (err) {
          return res.stdjson({
            status: 0,
            error: 1,
            msg: 'error 2'
          });
        }

        // 在数据库中新增相关文章记录
        connection.query(
          'insert into article (author_id, title, filename, status) values (?, ?, ?, ?)',
          [req.user.id, req.body.title, fileName, req.body.type],
          (err, result) => {

            connection.release();

            if (err) {
              console.log(err);
              return res.stdjson({
                status: 0,
                error: 1,
                msg: 'error 3'
              });
            }

            res.stdjson({
              status: 1,
              data: {
                success: 1,
                id: result.insertId
              }
            });
          }
        );
      });

    });

  });

};
