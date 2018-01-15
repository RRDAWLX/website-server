module.exports = (router) => {
  router.get('/articles', (req, res, next) => {
    let perPage = req.query.perPage || 10,
      pageNum = req.query.pageNum || 1;

    res.connectDb(connection => {
      connection.cQuery(
        'select * from article where status="issue" order by create_time desc, id desc limit ?, ?',
        [perPage * (pageNum - 1), +perPage],
        results => {
          connection.release();

          res.stdjson({
            data: results
          });
        }
      );
    });
  });
};