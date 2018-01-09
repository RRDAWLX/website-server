module.exports = function ({status = 1, data = {}, error = 0, msg = ''}) {
  return {status, data, error, msg};
};