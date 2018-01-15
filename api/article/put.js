let authenticate = require('../../lib/middleware/authenticate'),
  fs = require('fs'),
  path = require('path'),
  md5 = require('md5'),
  globalConfig = require('../../configuration');

module.exports = (router) => {
  router.put('/article/:articleId', authenticate, (req, res, next) => {

    res.connnectDb(connection => {

      // 查询文章信息
      connection.cQuery(
        'select * from article where id=?',
        [req.params.articleId],
        results => {

          // 检验当前用户是否是该文章的作者
          if (!results[0] || (results[0].author_id !== req.user.id)) {
            connection.release();

            return res.stdjson({
              status: 1,
              error: 1,
              msg: 'not the author of this article'
            });
          }

          // 更新文档
          let filePath = path.join(globalConfig.articlesPath, results[0].filename);
          fs.writeFile(filePath, req.body.content, err => {
            if (err) {
              connection.release();
              return res.stdjson({
                status: 0,
                error: 1,
                msg: 'writing content error'
              });
            }

            // 检查是否要更新标题和状态
            if (req.body.type !== 'issue') {
              req.body.type = 'draft';
            }
            if (req.body.title === results[0].title && req.body.type === results[0].status) {
              connection.release();
              return res.stdjson({
                success: 1
              });
            }

            // 更新标题和状态
            connection.cQuery(
              'update article set title=?, status=? where id=?',
              [req.body.title, req.body.type, req.params.articleId],
              () => {
                connection.release();

                return res.stdjson({
                  success: 1
                });
              }
            );
          });
        }
      );

    });

  });
};
