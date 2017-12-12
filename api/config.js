module.exports = [
  {
    path: '/api/user',
    handler: require('./user')
  },

  {
    path: '/api/register',
    handler: require('./register')
  },
];