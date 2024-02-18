const express = require("express");
const { getData } = require("./db.js");

const port = 3001;
const app = express();

app.get("/api", async ( req, res)  => {
    const data = await getData();
    res.send(data);
})

app.listen(port);