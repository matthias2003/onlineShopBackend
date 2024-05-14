const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const auth = (req, res, next) => {
    try {
        const token = req.cookies?.['jwt'];
        if (!token) { res.status(403).send("Access denied")}
        else {
            next();
        }
    } catch (error) {
        res.status(400).send("Invalid token");
    }
}

module.exports = { auth }