const mongoose = require('mongoose');
const { ObjectId } = require('mongodb')

const productsSchema = new mongoose.Schema({
    _id : ObjectId,
    name : String,
    color : String,
    img : String,
    gender : String,
    brand : String,
    price : String,
    sold : Number
})

const userCredentialsSchema = new mongoose.Schema({
    _id: ObjectId,
    name: {type: String, required: true},
    surname: {type: String, required: true},
    email: {type: String, required: true, unique:true},
    password: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
    refreshToken: {type:String}
});

const Products = mongoose.model("Products", productsSchema, "Products");
const User = mongoose.model("UsersCredentials",userCredentialsSchema,"UsersCredentials");

module.exports = { Products, User };