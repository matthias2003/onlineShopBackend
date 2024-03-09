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
    _id:ObjectId,
    name: String,
    surname: String,
    email:String,
    password:String,
    dateOfBirth: Date

});

module.exports = { productsSchema, userCredentialsSchema };