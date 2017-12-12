let express = require('express');
let router = express.Router();
let pool = require('../lib/db').pool;
let responseWrapper = require('../lib/response-wrapper');
let md5 = require('md5');

/* GET users listing. */
router.post('', (req, res, next) => {
  let username = req.body.username,
      password = req.body.password;

  if (!username || !password) {
    return res.send(responseWrapper({
      status: 1,
      msg: '用户名和密码都不能为空！',
      data: {
        success: false
      }
    }));
  }

  pool.getConnection((err, connection) => {
    if (err) {
      return next(err);
    }

    connection.query(
      'select * from user where name=?',
      [username],
      (err, results) => {
        if (err) {
          connection.release();
          return next(err);
        }

        if (results.length) {
          connection.release();
          return res.send(responseWrapper({
            status: 1,
            msg: '用户已存在',
            data: {
              success: false
            }
          }));
        }

        connection.query(
          'insert into user (name, password) values (?, ?)',
          [username, md5(password).slice(0, 20)],
          (err, results) => {
            connection.release();

            if (err) {
              return next(err);
            }

            res.send(responseWrapper({
              data: {
                success: true
              }
            }));
          }
        );
      }
    );
  });
});

module.exports = router;
