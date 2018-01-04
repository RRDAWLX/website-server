module.exports = (router, responseWrapper, pool) => {

  /* 用户登出 */
  router.post('/logout', (req, res, next) => {
    res.clearCookie('token');
    res.send(responseWrapper({
      data: {
        login: false
      }
    }));
  });

};
