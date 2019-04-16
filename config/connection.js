const mysql = require("mysql");

// Set up our connection information
let connection;

if(process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
    connection = mysql.createConnection({
        host: "db5000052005.hosting-data.io",
        port: 3306,
        user: "dbu133426",
        password: "3135Park!",
        database: "dbs46915",
        socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
        multipleStatements: true
    });
}

// Connect to the database
connection.connect();

//export the connection
module.exports = connection;