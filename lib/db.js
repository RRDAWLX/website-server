let mysql = require('mysql');

let db = mysql.createConnection({
  host: '127.0.0.1',
  port: '3306',
  user: 'root',
  password: '123',
  database: 'website'
});

db.connect(err => {
  if (err) {
    console.log('Database connecting failed!');
  }
  console.log('Database connecting success!', `Thread Id: ${db.threadId}`);
});

module.exports = db;
