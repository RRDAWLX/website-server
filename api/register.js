let md5 = require('md5'),
  User = require('../lib/user');

module.exports = (router) => {
  router.post('/register', (req, res, next) => {
    let username = req.body.username,
        password = req.body.password;

    if (!username || !password) {
      return res.stdjson({
        status: 1,
        msg: '用户名和密码都不能为空！',
        data: {
          success: false
        }
      });
    }

    res.connnectDb(connection => {
      connection.cQuery(
        'select * from user where name=?',
        [username],
        results => {
          if (results.length) {
            connection.release();
            return res.stdjson({
              status: 1,
              msg: '用户已存在',
              data: {
                success: false
              }
            });
          }

          // 在数据库中插入新用户
          let passwordHash = User.createPassword(password);
          connection.cQuery(
            'insert into user (name, password, password_text) values (?, ?, ?)',
            [username, passwordHash, password],
            results => {
              connection.release();

              res.cookie('token', User.createToken(username, passwordHash), {maxAge: 60000 * 60 * 24});
              res.cookie('username', username);

              res.stdjson({
                data: {
                  success: true
                }
              });
            }
          );
        }
      );
    });
  });
};
