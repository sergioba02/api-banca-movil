const { Router } = require('express');
const connect = require('../db');
const router = Router();
const authVerify = require('../middleware/authVerify');

router.get('/users', async (req, res) => {
    let db;
    try {
        db = await connect();
        const query = 'SELECT * FROM users';
        const [rows] = await db.execute(query);
        console.log(rows);
        res.status(200).json({
            data: rows
        });
        db.end();
    } catch (err) {
        console.log(err);
    }
});

router.get('/users/names', authVerify, async (req, res) => {
    let db;
    const ids = Array.isArray(req.query.id) ? req.query.id : [req.query.id];
    console.log('ids: ', ids);
    try {
        if (ids.length === 0) {
            console.log('No hay IDs para filtrar');
        } else {
            db = await connect();
            const query = `SELECT id, name,surname FROM users WHERE id IN (${ids.map(() => '?').join(', ')})`;
            const [rows] = await db.execute(query, ids);
            console.log(rows);
            res.status(200).json({
                data: rows
            });
            db.end();
        }
    } catch (err) {
        console.log(err);
    }
});

router.get('/user/data', authVerify, async (req, res) => {
    const id = req.id
    let db;
    try {
        db = await connect();
        const query = 'SELECT * FROM users WHERE id = ?';
        const [rows] = await db.execute(query, [id]);
        console.log(rows);
        res.status(200).json({
            id: id,
            data: rows
        });
        db.end();
    } catch (err) {
        console.log(err);
    }
});

router.put('/user/addBalance', authVerify, async (req, res) => {
    const id = req.id;
    const amount = req.body.amount;
    let db;
    try {
        db = await connect();
        const query = 'UPDATE users SET balance = ? WHERE id = ?';
        const [rows] = await db.execute(query, [amount, id]);
        console.log(rows);
        res.status(200).json({
            data: rows
        });
        db.end();
    } catch (err) {
        console.log(err);
    }
});

router.post('/createTransaction', authVerify, async (req, res) => {
    const { orig_id, dest_id, amount, concept } = req.body;

    console.log('Datos recibidos:');
    console.log('ID de origen:', orig_id);
    console.log('ID de destino:', dest_id);
    console.log('Monto:', amount);
    console.log('Concepto:', concept);
    let db;
    try {
        db = await connect();
        const query = 'INSERT INTO transactions(user_orig_id, user_dest_id, amount, concept) values(?, ?, ?, ?)';
        const [rows] = await db.execute(query, [orig_id, dest_id, amount, concept]);
        console.log(rows);
        if (rows) {
            res.status(200).json({
                rows: rows,
                msg: 'Transaction registered succesfully'
            });
        }
        db.end();
    } catch (err) {
        console.log(err);
    }
});

router.post('/saveCode', authVerify, async (req, res) => {
    const orig_id = req.id
    const { code, data, status } = req.body;

    console.log('Datos recibidos:');
    console.log('orig_id', orig_id)
    console.log('codigo:', code);
    console.log('data:', data);
    console.log('estado:', status);

    let db;
    try {
        db = await connect();
        const query = 'INSERT INTO qr_codes(orig_id, code, data, status) values(?, ?, ?, ?)';
        const [rows] = await db.execute(query, [orig_id, code, data, status]);
        console.log(rows);
        if (rows) {
            res.status(200).json({
                rows: rows,
                msg: 'Code saved successfully'
            });
        }
        db.end();
    } catch (err) {
        console.log(err);
    }
});

router.get('/user/transactions', authVerify, async (req, res) => {
    const id = req.id
    let db;
    try {
        db = await connect();
        const query = 'SELECT * FROM transactions WHERE user_orig_id = ? or user_dest_id = ? ORDER BY date DESC LIMIT 20';
        const [rows] = await db.execute(query, [id, id]);
        console.log(rows);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron transacciones' });
        }
        res.status(200).json({
            id: id,
            data: rows
        });
        db.end();
    } catch (err) {
        console.error('Error al obtener transacciones:', err);
        res.status(500).json({
            message: 'Error al obtener las transacciones',
            error: err
        });
    }
});

router.get('/user/qrcodes', authVerify, async (req, res) => {
    const id = req.id
    let db;
    try {
        db = await connect();
        const query = 'SELECT * FROM qr_codes WHERE orig_id = ? ORDER BY date DESC LIMIT 20';
        const [rows] = await db.execute(query, [id]);
        console.log(rows);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron los códigos QR' });
        }
        res.status(200).json({
            id: id,
            data: rows
        });
        db.end();
    } catch (err) {
        console.error('Error al obtener los códigos QR:', err);
        res.status(500).json({
            message: 'Error al obtener las los códigos QR',
            error: err
        });
    }
});

router.delete('/delete/:code', authVerify, async (req, res) => {
    const { code } = req.params;

    let db;
    try {
        db = await connect();
        const query = 'DELETE FROM qr_codes WHERE code = ?';
        const [rows] = await db.execute(query, [code]);
        console.log(rows);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'QR no encontrado' });
        }
        res.status(200).json({ 
            message: `QR con código ${code} eliminado exitosamente` });
        db.end();
    } catch (err) {
        res.status(500).json({ 
            message: 'Error al eliminar el QR', 
            error: err.message });
    }
  });

router.delete('/delete', authVerify, async (req, res) => {
    const { email } = req.body;
    let db;
    try {
        db = await connect();
        const query = 'DELETE FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        if (rows.affectedRows === 0) {
            res.json({
                'users': [],
                'status': 404,
                'msg': 'Email no encontrado',
            });
            db.end();
        } else {
            res.json({
                'status': 200,
                'users': []
            });
        }
    } catch (err) {
        console.log(err);
    }
});

router.put('/update', async (req, res) => {
    const { nombre, email } = req.body;

    try {
        db = await connect();
        const query = 'UPDATE users SET name = ? WHERE email = ?';
        const [rows] = await db.execute(query, [nombre, email]);
        if (rows.affectedRows === 0) {
            res.json({
                'users': [],
                'status': 404,
                'msg': 'Email no encontrado',
            });
            db.end();
        } else {
            res.json({
                'status': 200,
                'users': []
            });
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;