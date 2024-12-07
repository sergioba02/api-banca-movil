const { Router } = require('express');
const connect = require('../db');
const bcrypt = require('bcrypt');
const router = Router();
const jwt = require('jsonwebtoken');
require('dotenv').config()

const blacklist = [];

router.post('/auth/login', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (blacklist.includes(token)) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
    let db;
    try {
        const { email, password } = req.body;
        db = await connect();

        const query = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await db.execute(query, [email]);

        if (rows.length===0) {
            console.error('Email no registrado')
            res.status(404).json({
                message: 'EL email ingresado no está registrado'
            });
        }
        else{
            const hashPassword = rows[0].password;
            if (await bcrypt.compare(password, hashPassword)) {
                const token = jwt.sign({ id: rows[0].id }, process.env.SECRET_KEY, {
                    expiresIn: '1h'
                });
                res.status(200).json({
                    token: token,
                    message: 'Inicio de sesion exitoso'
                });
            } else {
                res.status(400).json({
                    message: 'La contraseña es incorrecta'

                });
            }
        }
        db.end();
    } catch (err) {
        console.log(err);
    }
});

router.post('/auth/logout', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        blacklist.push(token);
        return res.status(200).json({ message: 'Logout exitoso' });
    }
    
    return res.status(400).json({ message: 'Token no proporcionado' });
});


router.post('/auth/register', async (req, res) => {
    let db;
    try {
        const { name, surname, email, password } = req.body;
        const saltRound = 10;
        db = await connect();
        const hashPassword = await bcrypt.hash(password, saltRound);
        const query = `INSERT INTO users(name, surname, email, password) VALUES(?, ?, ?, ?)`;
        const [rows] = await db.execute(query, [name, surname, email, hashPassword]);
        console.log(rows);
        if (rows) {
            res.status(200).json({
                users: rows,
                msg: 'User succesfully registered'
            });
        }
        db.end();
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                message: 'El email ya está en uso',
                error: error.sqlMessage,
            });
        }
        return res.status(500).json({
            message: 'Error interno del servidor',
            error: error.message,
        });
    }
});

module.exports = router;