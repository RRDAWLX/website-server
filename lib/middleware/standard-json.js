module.exports = (req, res, next) => {
  res.stdjson = ({status = 1, data = {}, error = 0, msg = ''}) => {
    res.json({status, data, error, msg});
  };
  next();
}