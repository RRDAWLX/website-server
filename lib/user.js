let pool = require('./db').pool,
  md5 = require('md5');

module.exports = {
  getByName(name) {

  },

  getById(id) {

  },

  authenticate(name, password, cb) {

  },

  createToken(name, password) {
    return md5(name + password).slice(0, 20);
  }
};