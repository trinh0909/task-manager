var mysql = require('mysql');
var db = mysql.createConnection({
   host: 'localhost', user: 'root', password: '', 
   database: 'task_manager'
}); 
module.exports = db; 
