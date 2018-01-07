module.exports = function(){
  var mysql = require('mysql');
  var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'akzb!@#',
    database: 'o2'
  });

  conn.connect();
  return conn;
}
