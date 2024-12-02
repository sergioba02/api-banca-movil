const { Router } = require('express');
const connect = require('../db');
const bcrypt = require('bcrypt');
const router = Router();
const jwt = require('jsonwebtoken');
require('dotenv').config()

router.post('/auth/login', async (req, res) => {
    let db;
    try {
        const { email, password } = req.body;
        db = await connect();

        const query = `SELECT * FROM users WHERE email = ?`;
        const [row] = await db.execute(query, [email]);

        if (row.length===0) {
            console.error('Email no registrado')
            res.status(404).json({
                message: 'EL email ingresado no está registrado'
            });
        }
        else{
            const hashPassword = row[0].password;
            if (await bcrypt.compare(password, hashPassword)) {
                const token = jwt.sign({ id: row[0].id }, process.env.SECRET_KEY, {
                    expiresIn: '1h'
                });
                res.cookie('jwt', token)
                res.status(200).json({
                    token: token,
                    message: 'Inicio de sesion exitoso'
                });
            } else {
                res.status(401).json({
                    message: 'La contraseña es incorrecta'

                });
            }
        }
    } catch (err) {
        console.log(err);
    }
});

router.post('/auth/register', async (req, res) => {
    let db;
    try {
        const { name, surname, email, password } = req.body;
        const saltRound = 10;
        db = await connect();
        const hashPassword = await bcrypt.hash(password, saltRound);
        const query = `INSERT INTO users(name, surname, email, password) VALUES(?, ?, ?, ?)`;
        const [row] = await db.execute(query, [name, surname, email, hashPassword]);
        console.log(row);
        if (row) {
            res.status(200).json({
                status: 200,
                users: row,
                msg: 'User registered succesfully'
            });
        }
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({
                status: 409,
                message: 'El email ya está en uso',
                error: error.sqlMessage,
            });
        }
        return res.status(500).json({
            status: 500,
            message: 'Error interno del servidor',
            error: error.message,
        });
    }
});

module.exports = router;