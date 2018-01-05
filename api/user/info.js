let authenticate = require('../../lib/middleware/authenticate');

module.exports = (router, responseWrapper, pool) => {

  /* GET users listing. */
  router.get('/user/info', authenticate, (req, res, next) => {
    // return res.json(req.cookies);

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
          res.send(responseWrapper({
            status: 1,
            data: results[0]
          }));
        }
      );
    });
  });

};
