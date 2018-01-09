let pool = require('../db').pool,
  responseWrapper = require('../response-wrapper'),
  User = require('../user');

module.exports = (req, res, next) => {
  let user = req.user = {
    authenticated: false
  };
  user.name = req.cookies.username;
  user.token = req.cookies.token;

  // 请求中未找到必要的 cookie
  if (!user.name || !user.token) {
    return res.json(responseWrapper({
      status: 1,
      error: 1,
      msg: '未登录用户'
    }));
  }

  pool.getConnection((err, connection) => {
    // 请求数据库连接出错
    if (err) {
      return res.status(500).json(responseWrapper({
        status: 0,
        error: 1,
        msg: '服务器内部错误'
      }));
    }

    connection.query(
      'select * from user where name=?',
      [user.name],
      (err, results) => {
        connection.release();

        // 数据库查找出错
        if (err) {
          return res.status(500).json(responseWrapper({
            status: 0,
            error: 1,
            msg: '服务器内部错误'
          }));
        }

        // 未查到用户信息
        if (results.length === 0) {
          return res.json(responseWrapper({
            status: 1,
            error: 1,
            msg: '未登录用户'
          }));
        }

        if (User.createToken(results[0].name, results[0].password) === user.token) {  // 验证通过
          // console.log(req.get('Cookie'));
          next();
        } else {  // token无效
          return res.json(responseWrapper({
            status: 1,
            error: 1,
            msg: '未登录用户'
          }));
        }
      }
    );
  });
};