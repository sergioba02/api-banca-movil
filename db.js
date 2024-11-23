const sql = require('mysql2/promise');

async function connect() {
    try {
        const HOST = 'localhost';
        const PORT = 3306;
        const user = 'root';
        const password = '';
        const  DATABASE = 'BANCA_MOVIL';

        const connection = await sql.createConnection({
            'host': HOST,
            'port': PORT,
            'user': user,
            'password': password,
            'database': DATABASE,
        });
        console.log('Conexión creada');
        return connection;
    } catch (err) {
        console.log('Ocurrió un error al intentar realizar la conexión: ' + err);
        throw err;
    }
}

module.exports = connect;