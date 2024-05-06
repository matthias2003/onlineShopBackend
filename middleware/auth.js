const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const auth = (req, res, next) => {
    try {
        const token = req.cookies?.['jwt'];
        if (!token) { res.status(403).send("Access denied")};
        req.auth = jwt.verify(token, process.env.JWT_TOKEN);
        next();
    } catch (error) {
        res.status(400).send("Invalid token");
    }
}

module.exports = { auth }