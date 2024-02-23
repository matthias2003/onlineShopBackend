const { MongoClient } = require("mongodb");

const url = "mongodb+srv://admin:nzXp02N2myDA1mfb@shop.rdhilhf.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(url);
const database = client.db("Shop");
const getData = async () => {
    const col  = database.collection("Products")
    const result = col.find().sort({_id: -1}).limit(4);
    return result.toArray();
}

const getBestsellers = async () => {
    const col  = database.collection("Products");
    const result = col.find().sort({sold:-1}).limit(4)
    return result.toArray();
}

const searchItemsByName = async (query) => {
    const col  = database.collection("Products")
    const result = col.find(query);
    return result.toArray();
}

module.exports = { getData, getBestsellers };