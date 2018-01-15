let authenticate = require('../../lib/middleware/authenticate'),
  md5 = require('md5'),
  User = require('../../lib/user');

module.exports = (router) => {

  router.put('/user/password', authenticate, (req, res, next) => {

    // 先检查用户输入的老密码是否正确
    if (User.createPassword(req.body.oldPassword) !== req.user.password) {
      return res.stdjson({
        error: 1,
        msg: 'old password is wrong.'
      });
    }

    res.connnectDb(connection => {

      // 保存新密码，并刷新 Token。
      let newPassword = User.createPassword(req.body.newPassword);
      connection.cQuery(
        'update user set password=?, password_text=? where id=?',
        [newPassword, req.body.newPassword, req.user.id],
        () => {
          User.setToken({
            res,
            user: {
              name: req.user.name,
              password: newPassword
            }
          });

          res.stdjson({
            data: {
              success: 1
            }
          });
        }
      );

    });
  });

};
