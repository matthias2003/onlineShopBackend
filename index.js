const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { getData, getBestsellers, loginUser } = require("./db.js");
const { loginHandler, registerHandler } = require("./loginValidation.js");
const {json} = require("express");

//TODO: ADD STATUS CODES TO RESPONSES

dotenv.config();
const port = process.env.PORT || 3001 ;
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
    const response = await loginHandler(req.body);
    res.send(response)
})

app.post("/register", async (req, res) => {
    const response = await registerHandler(req.body)
    res.status(400).send(response)
})


app.listen(port);