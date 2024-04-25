const bcrypt = require("bcrypt");
const { insertUser, getUser } = require("./db.js")
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const express = require("express");
dotenv.config();

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: "30d" });
};

const loginHandler = async (loginData ) => {
    if (!loginData.password || !loginData.email) {
        return "Not all fields have been filled in";
    }

    const userData = await getUser(loginData.email);
    let returnedData = {};
    if (userData && ( await bcrypt.compare(loginData.password, userData.password))) {
        returnedData = {
            status:true,
            id:userData._id,
            token: generateToken(userData._id),
            email:userData.email,
            name:  userData.name,
        }
    } else {
        returnedData.status = false;
    }
    return returnedData;
}

const registerHandler = async (registerData) => {
    const { email, name, surname, password, dateOfBirth } = registerData;
    if (!name || !email || !password || !surname || !dateOfBirth) {
        return "Not all fields are fill in"; // change to erros throw
    }


    // place for data validation

    if (!await getUser(email)) {
        const hashedPassword = await bcrypt.hash(password,10);
        await insertUser(email, name, surname, hashedPassword, dateOfBirth);
    } else {
        return "This email address is already taken"; // change to erros throw
    }

    return 'User successfully added';
}

module.exports = { loginHandler, registerHandler };