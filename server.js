const express = require("express");
const { getData } = require("./db.js");

const port = 3000;

const app = express();

app.get("/", async ( req, res)  => {
    const data = await getData();
    res.send(data);
})

app.listen(port);