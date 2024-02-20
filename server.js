const express = require("express");
const cors = require("cors");
const { getData } = require("./db.js");

const port = 3001;
const app = express();
const corsOptions = {
    origin: ["127.0.0.1:3000"]
}

app.use(cors());
app.get("/api", async ( req, res)  => {
    const data = await getData();
    res.send(data);
})

app.listen(port);