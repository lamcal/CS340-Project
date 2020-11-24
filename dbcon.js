var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_lamcal',
  password        : '5142',
  database        : 'cs340_lamcal'
});
module.exports.pool = pool;
