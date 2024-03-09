const mongoose = require('mongoose');
const { ObjectId } = require('mongodb')
const stream = require("stream");

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
    username:String,
    password:String
});

module.exports = { productsSchema, userCredentialsSchema };