let routes = require('./routes');
let router = require('express').Router();

routes.forEach(route => {
  route(router);
});

module.exports = router;