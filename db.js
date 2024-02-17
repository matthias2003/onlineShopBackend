const { MongoClient } = require("mongodb");

const url = "mongodb+srv://admin:nzXp02N2myDA1mfb@shop.rdhilhf.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(url);

const getData = async () => {
    const database = client.db("Shop");
    const col = database.collection("Products")
    const data = await col.findOne({brand:"Nike"});
    return data;
    // for await (const item of data) {
    //     console.log(item)
    // }
}

module.exports = { getData };