const mongoose = require('mongoose');

const productsSchema = new mongoose.Schema({
    name : String,
    color : String,
    img : String,
    gender : String,
    brand : String,
    price : String,
    sold : Number
})

const Products = mongoose.model("Products", productsSchema, "Products");

module.exports = { Products };