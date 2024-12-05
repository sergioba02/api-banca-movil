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
    const ids = req.query.id;
    console.log('ids: ',ids);
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

router.get('/user/lastTransactions', authVerify, async (req, res) => {
    const id = req.id
    let db;
    try {
        db = await connect();
        const query = 'SELECT * FROM transactions WHERE user_orig_id = ? or user_dest_id = ? ORDER BY date DESC LIMIT 4';
        const [rows] = await db.execute(query, [id, id]);
        console.log(rows);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'No se encontraron transacciones' });
        }
        res.status(200).json({
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

router.get('/user/allTransactions', authVerify, async (req, res) => {
    const id = req.id
    let db;
    try {
        db = await connect();
        const query = 'SELECT * FROM transactions WHERE user_orig_id = ? or user_dest_id = ? ORDER BY date DESC LIMIT 30';
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