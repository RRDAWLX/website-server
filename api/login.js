let md5 = require('md5');

module.exports = (router, responseWrapper, pool) => {

  /* 用户登录 */
  router.post('/login', (req, res, next) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return next(err);
      }

      connection.query(
        'select * from user where name=?',
        [req.body.username],
        (err, results) => {
          connection.release();

          if (err) {
            return next(err);
          }

          if (Array.isArray(results) && results[0] && results[0].password === md5(req.body.password).slice(0, 20)) {
            res.cookie('token', `${req.body.username} ${req.body.password}`, {maxAge: 60000});
            res.cookie('username', req.body.username);
            res.send(responseWrapper({
              data: {
                user: req.username,
                login: true
              }
            }));
          } else {
            res.send(responseWrapper({
              data: {
                user: req.username,
                login: false
              }
            }));
          }
        }
      );
    });
  });

};
