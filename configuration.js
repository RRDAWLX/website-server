let path = require('path');

module.exports = {
  database: {
    connectionLimit: 10,
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '123',
    database: 'website'
  },

  staticResourcePath: path.join(__dirname, '/front-end'),

  htmlPath: path.join(__dirname, '/front-end'),

  tmpPath: path.join(__dirname, '/tmp'),

  imagesPath: path.join(__dirname, '/images'),

  articlesPath: path.join(__dirname, '/articles'),

  caCertPath: path.join(__dirname, '/ca/server.crt'),

  caKeyPath: path.join(__dirname, '/ca/server.key')
};