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

module.exports = { productsSchema };