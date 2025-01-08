const express = require("express");
const router = express.Router();
const{ getUser, updateUser } = require('../controllers/userController');
const { auth } = require("../middleware/auth");
const multer = require("multer");

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.post('/',auth, getUser);

router.post('/update', upload.single('image'), updateUser);

module.exports = router;