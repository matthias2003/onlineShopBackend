const mongoose = require('mongoose');
const { Products, User } = require('./databseSchemas.js');

const url = "mongodb+srv://admin:nzXp02N2myDA1mfb@shop.rdhilhf.mongodb.net/Shop?retryWrites=true&w=majority";

mongoose.connect(url); // wrzucić to w funkcje jakąś

// data db


const getData = async () => {
    return Products.find().sort({_id: -1}).limit(4);
}

const getBestsellers = async () => {
    return Products.find().sort({sold:-1}).limit(4)
}

// login db


const loginUser = async (usernameInfo) => {
    return User.findOne({email:usernameInfo});
}

const registerUser = async (email, name, surname, hashedPassword, dateOfBirth) => {

    await User.collection.insertOne({
        name: name,
        surname: surname,
        email: email,
        password: hashedPassword,
        dateOfBirth: new Date(dateOfBirth)
    })
}


module.exports = { getData, getBestsellers, loginUser, registerUser };





