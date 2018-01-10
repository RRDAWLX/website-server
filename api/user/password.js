let authenticate = require('../../lib/middleware/authenticate'),
  md5 = require('md5'),
  User = require('../../lib/user');

module.exports = (router, responseWrapper, pool) => {

  router.put('/user/password', authenticate, (req, res, next) => {

    // 先检查用户输入的老密码是否正确
    if (User.createPassword(req.body.oldPassword) !== req.user.password) {
      return res.json(responseWrapper({
        error: 1,
        msg: 'old password is wrong.'
      }));
    }

    pool.getConnection((err, connection) => {

      if (err) {
        return res.json(responseWrapper({
          status: 0,
          error: 1,
          msg: '500'
        }));
      }

      // 保存新密码，并刷新 Token。
      let newPassword = User.createPassword(req.body.newPassword);
      connection.query(
        'update user set password=?, password_text=? where id=?',
        [newPassword, req.body.newPassword, req.user.id],
        (err, results) => {
          if (err) {
            return res.json(responseWrapper({
              status: 0,
              error: 1,
              msg: 'database update error'
            }));
          }

          User.setToken({
            res,
            user: {
              name: req.user.name,
              password: newPassword
            }
          });

          res.json(responseWrapper({
            data: {
              success: 1
            }
          }));
        }
      );

    });
  });

};
