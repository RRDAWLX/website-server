let a = require('./a');

module.exports = function () {
  a.flag = 1;
  console.log(`${a()} -> b`);
};