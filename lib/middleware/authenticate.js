let User = require('../user');

module.exports = (req, res, next) => {
  let user = req.user = {
    authenticated: false
  };
  user.name = req.cookies.username;
  user.token = req.cookies.token;

  // 请求中未找到必要的 cookie
  if (!user.name || !user.token) {
    return res.stdjson({
      status: 1,
      error: 1,
      msg: '未登录用户'
    });
  }

  res.connectDb(connection => {
    connection.cQuery(
      'select * from user where name=?',
      [user.name],
      results => {
        connection.release();

        // 未查到用户信息
        if (results.length === 0) {
          return res.stdjson({
            status: 1,
            error: 1,
            msg: '未登录用户'
          });
        }

        if (User.createToken(results[0].name, results[0].password) === user.token) {  // 验证通过
          if (!req.user) {
            req.user = {};
          }

          for (let prop in results[0]) {
            req.user[prop] = results[0][prop];
          }

          next();
        } else {  // token无效
          return res.stdjson({
            status: 1,
            error: 1,
            msg: '未登录用户'
          });
        }
      }
    );
  });
};