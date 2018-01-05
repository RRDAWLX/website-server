let pool = require('../db').pool,
  responseWrapper = require('../response-wrapper'),
  User = require('../user');

module.exports = (req, res, next) => {
  let user = req.user = {
    authenticated: false
  };
  user.name = req.cookies.username;
  user.token = req.cookies.token;

  if (!user.name || !user.token) {
    return res.json(responseWrapper({
      status: 0,
      msg: '未登录用户'
    }));
  }

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json(responseWrapper({
        status: 0,
        msg: '服务器内部错误'
      }));
    }

    connection.query(
      'select * from user where name=?',
      [user.name],
      (err, results) => {
        connection.release();

        if (err) {
          return res.status(500).json(responseWrapper({
            status: 0,
            msg: '服务器内部错误'
          }));
        }

        if (results.length === 0) {
          return res.json(responseWrapper({
            status: 0,
            msg: '未登录用户'
          }));
        }

        if (User.createToken(results[0].name, results[0].password) === user.token) {  // 验证通过
          next();
        } else {
          return res.json(responseWrapper({
            status: 0,
            msg: '未登录用户'
          }));
        }
      }
    );
  });
};