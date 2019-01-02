const mysql = require("mysql");

// Set up our connection information
let connection;

if(process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
    connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "root",
        database: "sidewerk_dev",
        socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
        multipleStatements: true
    });
}

// Connect to the database
connection.connect();

//export the connection
module.exports = connection;