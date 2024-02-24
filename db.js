const mongoose = require('mongoose');
const productsSchema = require('./productsSchema.js');

const url = "mongodb+srv://admin:nzXp02N2myDA1mfb@shop.rdhilhf.mongodb.net/Shop?retryWrites=true&w=majority";


mongoose.connect(url);
const products = mongoose.model("Products", productsSchema, "Products");
const getData = async () => {
    return products.find().sort({_id: -1}).limit(4);
}

const getBestsellers = async () => {
    return products.find().sort({sold:-1}).limit(4)
}

module.exports = { getData, getBestsellers};





