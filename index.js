const express = require('express');
const connect = require('./DB');

const app = express();
const port = 3000;
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/usuarios', async (req,res) => {
    let db;
    try{
        db = await connect();
        const query = 'SELECT * FROM usuarios';
        const [row] = await db.execute(query);
        console.log(row);
        res.json({
            status: 200,
            user: row
        });
    }catch(err){
        console.log(err);


    
}});



app.post('/user', async (req, res) => {
    let db;
    try{
        const {email, nombre} = req.body;
        db = await connect();
        const query = `INSERT INTO usuarios (nombre, email) values ('${nombre}','${email}')`;
        const [row] = await db.execute(query);
        console.log(row);
        res.json({
            status: 200,
            user: row
        });
    }catch(err){
        console.log(err);
}})

app.get('/alumnos/:no_control',(req,res) => {
    const noControl=req.params.no_control;
    res.send(noControl);
})

app.get('/alumnos/:no_control',(req,res) => {
    const noControl=req.params.no_control;
    res.send(noControl);
})

app.listen(port, () =>{

    console.log(`Escuchando por el puerto ${port}`);
    
});