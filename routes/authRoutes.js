const express = require('express');
const router = express.Router();
const { login, register, registerConfirmation, refresh, logout, resetPassword, setResetPassword } = require('../controllers/authController');

router.post("/login", login)

router.post("/register", register)

router.get("/register/account-confirmation/:token", registerConfirmation)

router.get("/refresh", refresh)

router.post("/logout", logout)

router.post("/reset-password", resetPassword)

router.post("/reset-password/set", setResetPassword)

module.exports = router;