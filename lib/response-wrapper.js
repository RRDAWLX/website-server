module.exports = function (data, status = 1, err = '', msg = '') {
  return {status, data, err, msg};
};