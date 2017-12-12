module.exports = function ({status = 1, data = {}, error = '', msg = ''}) {
  return {status, data, error, msg};
};