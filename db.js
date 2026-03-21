const mysql = require('mysql2');

// create connection
const db = mysql.createConnection({
    host: 'localhost',      // database is on your computer
    user: 'root',           // mysql username
    password: 'thanuvenky318',           // your mysql password (if any)
    database: 'accident_system' // your database name
});

// connect to database
db.connect((err) => {
    if (err) {
        console.log("❌ Connection Failed");
    } else {
        console.log("✅ Connected to MySQL");
    }
});

module.exports = db;