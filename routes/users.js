const { Router } = require('express');
const connect = require('../db');
const bcrypt = require('bcrypt');
const router = Router();
const authVerify = require('../middleware/authVerify');

router.get('/users', async (req, res) =>{
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
    } catch(err) {
        console.log(err);
    }
});

router.post('/register', async(req, res) => {
    let db;
    try {
        const {name, surname, email, password} = req.body;
        const saltRound = 10;
        db = await connect();
        const hashPassword = await bcrypt.hash(password, saltRound);
        console.log(hashPassword);
        const query = `INSERT INTO users(name, surname, email, password) VALUES(?, ?, ?, ?)`;
        const [row] = await db.execute(query, [name, surname, email, hashPassword]);
        console.log(row);
        res.json({
            'status': 200,
            'users': row
        });
    } catch(err) {
        console.log(err);
    }
});

router.get('/users', async (req, res) => {
    let db;
    try {
        db = await connect();
        console.log(email);
        const query = 'SELECT * FROM users';
        const [row] = await db.execute(query);
        console.log(row);
        res.json({
            'status': 200,
            'users': row
        });
    } catch(err) {
        console.log(err);
    }
});

router.delete('/delete', authVerify, async (req, res) => {
    const {email} = req.body;
    let db;
    try {
        db = await connect();
        const query = 'DELETE FROM users WHERE email = ?';
        const [rows] = await db.execute(query, [email]);
        if(rows.affectedRows === 0) { 
            res.json({
                'users': [],
                'status': 404,
                'msg': 'Email no encontrado',
            });
        } else {
            res.json({
                'status': 200,
                'users':[]
            });
        }
    } catch(err) {
        console.log(err);
    }
});

router.put('/update', async (req, res) => {
    const {email} = req.body;
    const {nombre} = req.body;

    try {
        db = await connect();
        const query = 'UPDATE users SET name = ? WHERE email = ?';
        const [rows] = await db.execute(query, [nombre, email]);
        if(rows.affectedRows === 0) {
            res.json({
                'users': [],
                'status': 404,
                'msg': 'Email no encontrado',
            });
        } else {
            res.json({
                'status': 200,
                'users':[]
            });
        }
    } catch(err) {
        console.log(err);
    }
});

module.exports = router;