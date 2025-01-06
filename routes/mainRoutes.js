const { getHome } = require("../controllers/productController");
const express = require("express");
const router = express.Router();

router.get('/', getHome);

module.exports = router;