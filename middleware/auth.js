const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const auth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).send("Access denied");
    jwt.verify( token, process.env.ACCESS_TOKEN_SECRET,(err, decoded)=>{
        if (err) return res.status(403).send(err);
        req.user = decoded.username;
        next();
    });
}

module.exports = { auth }