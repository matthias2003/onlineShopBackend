const express = require("express");
const cors = require("cors");

const { getData, getBestsellers } = require("./db.js");

const port = 3001 ;
const app = express();
const corsOptions = {
    origin: ["127.0.0.1:3000","https://online-shop.maciejkloda.pl"]
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.get("/api", async ( req, res)  => {
    const data = await getData();
    res.send(data);
})

app.get("/api/bestsellers", async (req , res) => {
    const data = await getBestsellers();
    res.send(data);
})

app.post("/login", async (req, res) => {
   const data = await req.body;
    console.log(data)
   res.send("Ok")
})

app.listen(port);