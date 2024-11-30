const { Router } = require('express');
const connect = require('../db');
const bcrypt = require('bcrypt');
const router = Router();
const jwt = require('jsonwebtoken');

router.post('/auth/login', async (req, res) => {
    let db;
    try {
        const {email, password} = req.body;
        db = await connect();
        
        const query = `SELECT * FROM users WHERE email = "${email}"`;
        const [row] = await db.execute(query);
        
        if(row.length === 1 ) {
            const hashPassword = row[0].password;
            if(await bcrypt.compare(password, hashPassword)) {
                const token = jwt.sign({email: email}, 'secret', {
                    expiresIn: '1h'
                });
                res.json({
                    'status': 200,
                    'token': token
                });
            } else {
                res.json({
                    'status': 400,
                    'token': null
                });
            }
        }
    } catch(err) {
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