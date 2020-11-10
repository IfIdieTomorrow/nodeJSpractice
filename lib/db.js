const mysql = require("mysql");
const db = mysql.createConnection({
    host : "localhost",
    user : "root",
    password : "sqladmin",
    database : "node_tutorial"
});
db.connect();

module.exports = db;