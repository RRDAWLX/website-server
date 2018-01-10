let md5 = require('md5'),
  User = require('../lib/user');

module.exports = (router, responseWrapper, pool) => {
  router.post('/register', (req, res, next) => {
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

          // 在数据库中插入新用户
          let passwordHash = User.createPassword(password);
          connection.query(
            'insert into user (name, password, password_text) values (?, ?, ?)',
            [username, passwordHash, password],
            (err, results) => {
              connection.release();

              if (err) {
                return next(err);
              }

              res.cookie('token', User.createToken(username, passwordHash), {maxAge: 60000 * 60 * 24});
              res.cookie('username', username);

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
};
