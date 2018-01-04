module.exports = (router, responseWrapper, pool) => {
  
  /* GET users listing. */
  router.get('/user/info', (req, res, next) => {
    pool.getConnection((err, connection) => {

      if (err) {
        return next(err);
      }

      connection.query(
        'select * from user',
        (err, results) => {
          connection.release();
          if (err) {
            return next(err);
          }
          // console.log(JSON.stringify(rows));
          res.send(responseWrapper({
            status: 1,
            data: results
          }));
        }
      );
    });
  });

};
