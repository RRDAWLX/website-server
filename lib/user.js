let pool = require('./db').pool,
  md5 = require('md5');

module.exports = {
  getByName(name) {

  },

  getById(id) {

  },

  authenticate(name, password, cb) {

  },

  createPassword(password) {
    return md5(password).slice(0, 20);
  },

  createToken(name, password) {
    return md5(name + password).slice(0, 20);
  },

  setToken({res, user, options = {}}) {
    res.cookie('token', this.createToken(user.name, user.password), Object.assign({maxAge: 60000 * 60 * 24}, options));
  }
};