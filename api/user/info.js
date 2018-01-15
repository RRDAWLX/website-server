let authenticate = require('../../lib/middleware/authenticate');

module.exports = (router) => {

  router.get('/user/info', authenticate, (req, res, next) => {
    res.connectDb(connection => {
      connection.cQuery(
        'select * from user where name=?',
        [req.cookies.username],
        results => {
          connection.release();

          res.stdjson({
            status: 1,
            data: results[0]
          });
        }
      );
    });
  });

};
