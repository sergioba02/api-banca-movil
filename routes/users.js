const { Router } = require('express');
const connect = require('../db');
const router = Router();
const authVerify = require('../middleware/authVerify');

router.get('/users', async (req, res) => {
    let db;
    try {
        db = await connect();
        const query = 'SELECT * FROM users';
        const [row] = await db.execute(query);
        console.log(row);
        res.json({
            'status': 200,
            'users': row
        });
    } catch (err) {
        console.log(err);
    }
});

router.get('/user/data', authVerify, async (req, res) => {
    const id = req.id
    console.log(id)
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
    } catch (err) {
        console.log(err);
    }
});

router.get('/users/transactions', authVerify, async (req, res) => {
    const id = req.id
    let db;
    try {
        db = await connect();
        console.log(email);
        const query = 'SELECT * FROM transactions WHERE account_orig_id = ? or account_dest_id = ?';
        const [rows] = await db.execute(query, [id, id]);
        console.log(rows);
        res.json({
            'status': 200,
            'users': rows
        });
    } catch (err) {
        console.log(err);
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