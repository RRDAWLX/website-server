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
    console.log('error connecting: ' + err.stack);
    return;
  }

  db.query(
    'select * from user where user=?',
    ['rrdawlx'],
    (err, rows) => {
      if (err) {
        throw err;
      }
      console.log(JSON.stringify(rows));
    }
  );

  db.end();
});
