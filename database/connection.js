const mysql = require('mysql');
const databaseConnection = require('../config/database.json')

const mysqlConnection = mysql.createConnection(databaseConnection);

mysqlConnection.connect();


module.exports = mysqlConnection;