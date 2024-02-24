const mongoose = require('mongoose');
const {ObjectId, Double} = require("mongodb");

const url = "mongodb+srv://admin:nzXp02N2myDA1mfb@shop.rdhilhf.mongodb.net/Shop?retryWrites=true&w=majority";

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

mongoose.connect(url);
const products = mongoose.model("Products", productsSchema, "Products");
const getData = async () => {
    return products.find().sort({_id: -1}).limit(4);
}

const getBestsellers = async () => {
    return products.find().sort({sold:-1}).limit(4)
}

module.exports = { getData, getBestsellers};





