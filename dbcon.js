var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_rasha',
  password        : '6199',
  database        : 'cs340_rasha'
});
module.exports.pool = pool;
