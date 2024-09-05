const mongoose = require('mongoose');
const { ObjectId } = require('mongodb')

const productsSchema = new mongoose.Schema({
    name : String,
    color : String,
    img : String,
    gender : String,
    brand : String,
    price : String,
    sold : Number
})

const userCredentialsSchema = new mongoose.Schema({
    name: {type: String, required: true},
    verified : { type: Boolean, default: false, required: true },
    surname: {type: String, required: true},
    email: {type: String, required: true, unique:true},
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    refreshToken: {type:String},
    profilePicture:{type:String}
}, { versionKey: false });

const Products = mongoose.model("Products", productsSchema, "Products");
const User = mongoose.model("UsersCredentials",userCredentialsSchema,"UsersCredentials");

module.exports = { Products, User };