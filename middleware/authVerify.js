const jwt = require("jsonwebtoken");
require('dotenv').config()

function authVerify(req, res, next) {
    
    try {
        const token = req.signedCookies.jwt;
        bearerToken = token.split(' ')[1];
        const decoded = jwt.verify(bearerToken, process.env.SECRET_KEY);
        console.log(decoded);
        req.id = decoded.id;
        next();
    } catch(err) {
        return res.status(401).json({
            ok: false,
            message: 'Invalid token'
        });
    }
}

module.exports = authVerify;