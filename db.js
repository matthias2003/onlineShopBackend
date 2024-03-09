const mongoose = require('mongoose');
const { productsSchema, userCredentialsSchema} = require('./databseSchemas.js');

const url = "mongodb+srv://admin:nzXp02N2myDA1mfb@shop.rdhilhf.mongodb.net/Shop?retryWrites=true&w=majority";

mongoose.connect(url);

// data db

const products = mongoose.model("Products", productsSchema, "Products");

const getData = async () => {
    return products.find().sort({_id: -1}).limit(4);
}

const getBestsellers = async () => {
    return products.find().sort({sold:-1}).limit(4)
}

// login db

const usersCredentials = mongoose.model("UsersCredentials",userCredentialsSchema,"UsersCredentials")

const loginUser = async (usernameInfo) => {
    return usersCredentials.findOne({email:usernameInfo});
}

const registerUser = async (userData) => {

    // const user = new usersCredentials(userData);
    console.log(userData)
    // user.save();
}


module.exports = { getData, getBestsellers, loginUser, registerUser };





