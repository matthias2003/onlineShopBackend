const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt")

const { getData, getBestsellers, loginUser } = require("./db.js");

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
    const userData = await loginUser(data.username);
    if (userData) {
        bcrypt.compare(data.password,userData.password, (err, result) => {
            console.log(result);
        })
    } else {
        console.log("User not found") /// zmienic na try i catch
    }
    // console.log(userData)
    res.send()
})

// bcrypt.hash("admin123", 10, function(err, hash) {
//     console.log(hash);
// });

app.listen(port);