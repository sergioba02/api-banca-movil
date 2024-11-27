const sql = require('mysql2/promise');
require('dotenv').config()


async function connect() {
    try {

        const connection = await sql.createConnection({
            'host': process.env.MYSQLHOST,
            'port': process.env.MYSQLPORT,
            'user': process.env.MYSQLUSER,
            'password': process.env.MYSQLPASSWORD,
            'database': process.env.MYSQLDATABASE,
        });
        console.log('Connection created');
        return connection;
    } catch (err) {
        console.log('Error trying to connect to database: ' + err);
        throw err;
    }
}

module.exports = connect;