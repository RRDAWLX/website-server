let authenticate = require('../../lib/middleware/authenticate');

module.exports = (router, pool) => {

  /* GET users listing. */
  router.get('/user/info', authenticate, (req, res, next) => {
    pool.getConnection((err, connection) => {

      if (err) {
        return next(err);
      }

      connection.query(
        'select * from user where name=?',
        [req.cookies.username],
        (err, results) => {
          connection.release();
          if (err) {
            return next(err);
          }
          // console.log(JSON.stringify(rows));
          res.stdjson({
            status: 1,
            data: results[0]
          });
        }
      );
    });
  });

};
