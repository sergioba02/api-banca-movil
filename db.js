const sql = require('mysql2/promise');

async function connect() {
    try {
        const HOST = 'localhost';
        const PORT = 3306;
        const USER = 'root';
        const PASSWORD = '';
        const  DATABASE = 'banca-movil';

        const connection = await sql.createConnection({
            'host': HOST,
            'port': PORT,
            'user': USER,
            'password': PASSWORD,
            'database': DATABASE,
        });
        console.log('Connection created');
        return connection;
    } catch (err) {
        console.log('Error trying to connect to database: ' + err);
        throw err;
    }
}

module.exports = connect;