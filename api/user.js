let express = require('express');
let router = express.Router();
let pool = require('../lib/db').pool;
let responseWrapper = require('../lib/response-wrapper');
let md5 = require('md5');

/* GET users listing. */
router.get('/info', (req, res, next) => {
  pool.getConnection((err, connection) => {

    if (err) {
      return next(err);
    }

    connection.query(
      'select * from user',
      (err, results) => {
        connection.release();
        if (err) {
          return next(err);
        }
        // console.log(JSON.stringify(rows));
        res.send(responseWrapper({
          status: 1,
          data: results
        }));
      }
    );
  });
});

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

/* 用户登出 */
router.get('/logout', (req, res, next) => {
  res.clearCookie('token');
  res.send(responseWrapper({
    data: {
      login: false
    }
  }));
});

module.exports = router;
