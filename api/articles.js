module.exports = (router, pool) => {
  router.get('/articles', (req, res, next) => {
    let perPage = req.query.perPage || 10,
      pageNum = req.query.pageNum || 1;

    pool.getConnection((err, connection) => {
      if (err) {
        return res.stdjson({
          status: 0,
          error: 1,
          msg: 'database connect error'
        });
      }

      connection.query(
        'select * from article where status="issue" order by create_time desc, id desc limit ?, ?',
        [perPage * (pageNum - 1), +perPage],
        (err, results) => {
          connection.release();

          if (err) {
            return res.stdjson({
              status: 0,
              error: 1,
              msg: 'database query error'
            });
          }

          res.stdjson({
            data: results
          });
        }
      );
    });
  });
};