var mysql      = require('mysql');
const databaseConnection = require('./config/database.json')
var connection = mysql.createConnection(databaseConnection); 
connection.connect();
connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
    if (error) throw error;
    console.log('The solution is: ', results[0].solution);
  });
connection.end();