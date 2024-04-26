const mongoose = require('mongoose');
const { Products, User } = require('./databseSchemas.js');
const dotenv = require("dotenv");

const main = async () => {
    dotenv.config();
    await mongoose.connect(`mongodb+srv://admin:${process.env.DB_PASSWORD}@shop.rdhilhf.mongodb.net/Shop?retryWrites=true&w=majority`);
}
const getData = async () => {
    return Products.find().sort({_id: -1}).limit(4);
}

const getBestsellers = async () => {
    return Products.find().sort({sold:-1}).limit(4)
}

const getUser = async (emailInfo) => {
    return User.findOne({email:emailInfo});
}

const insertUser = async (email, name, surname, hashedPassword, dateOfBirth) => {
    await User.collection.insertOne({
        name: name,
        surname: surname,
        email: email,
        password: hashedPassword,
        dateOfBirth: new Date(dateOfBirth)
    })
}

main().catch(err => console.log(err));

module.exports = { getData, getBestsellers, getUser, insertUser };





