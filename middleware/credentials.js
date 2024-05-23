const { whiteList } = require("../config/origins")
const credentials = (req, res, next) => {
    const origin = req.headers.origin;
    if (whiteList.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);
    }
    next();
}

module.exports = { credentials }