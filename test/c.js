let a = require('./a');

module.exports = function () {
  console.log(`${a()} -> c`);
  console.log(`a.flag: ${a.flag}`);
};