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

module.exports = router;