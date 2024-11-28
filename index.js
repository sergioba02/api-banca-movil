const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const users = require('./routes/users');
const auth = require('./routes/auth');

const PORT = 3000;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.use(users);
app.use(auth);

app.listen(PORT, () => {
    console.log(`Escuchando por el puerto ${PORT}`); 
});