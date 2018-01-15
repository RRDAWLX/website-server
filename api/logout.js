module.exports = (router) => {

  /* 用户登出 */
  router.post('/logout', (req, res, next) => {
    res.clearCookie('token');
    res.stdjson({
      data: {
        login: false
      }
    });
  });

};
