const express = require('express');
const connect = require('./db');

const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/users', async (req,res) => {
    let db;
    try{
        db = await connect();
        const query = 'SELECT * FROM users';
        const [row] = await db.execute(query);
        console.log(row);
        res.json({
            status: 200,
            user: row
        });
    }catch(err){
        console.log(err);


    } finally {
        if (db) await db.end();
    }});



app.post('/register', async (req, res) => {
    let db;
    try{
        const {name, email, password} = req.body;
        db = await connect();
        const query = `INSERT INTO users (name, email, password) values (?, ?, ?)`;
        const [row] = await db.execute(query,[name, email, password]);
        console.log(row);
        res.json({
            status: 200,
            user: row
        });

    }catch(err){
        console.log(err);

    } finally {
        if (db) await db.end();
    }});

app.delete('/delete/:id', async (req, res) => {
    let db;
    try{
        const id = req.params.id;
        db = await connect();
        const query = `DELETE FROM users WHERE id = ?`;
        const [row] = await db.execute(query, [id]);
        console.log(row);
        res.json({
            status: 200,
            user: row
        });

    }catch(err){
        console.log(err);

    } finally {
        if (db) await db.end();
    }});

app.put('/update/:id', async (req, res) => {
    let db;
    try{
        const id = req.params.id;
        const {name} = req.body;
        db = await connect();
        const query = `UPDATE users SET name = ? WHERE id = ?`;
        const [row] = await db.execute(query, [name, id]);
        console.log(row);
        res.json({
            status: 200,
            user: row
        });
        
    }catch(err){
        console.log(err);

    } finally {
        if (db) await db.end();
    }});

app.listen(port, () =>{

    console.log(`Escuchando por el puerto ${port}`);
    
});