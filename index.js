const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { getData, getBestsellers, loginUser } = require("./db.js");
const { json } = require("express");
const {getUser, insertUser} = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//TODO: ADD STATUS CODES TO RESPONSES

dotenv.config();
const port = process.env.PORT || 3001 ;
const app = express();

const corsOptions = {
    origin: ["127.0.0.1:3000","https://online-shop.maciejkloda.pl"]
}
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_TOKEN, { expiresIn: "30d" });
};

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
    const loginData = req.body;
    if (!loginData.password || !loginData.email) {
        return "Not all fields have been filled in";
    }

    const userData = await getUser(loginData.email);
    let returnedData = {};
    if (userData && ( await bcrypt.compare(loginData.password, userData.password))) {
        returnedData = {
            status:true,
            id:userData._id,
            token: generateToken(userData._id),
            email:userData.email,
            name:  userData.name,
        }
    } else {
        returnedData.status = false;
    }
    res.cookie('jwt', returnedData.token, { expires: new Date(Date.now() + 90000), httpOnly: true, secure: true });
    res.send(returnedData);
})

app.post("/register", async (req, res) => {
    const { email, name, surname, password, dateOfBirth } = registerData;
    if (!name || !email || !password || !surname || !dateOfBirth) {
        res.send("Not all fields are fill in"); // change to erros throw
    }

    // place for data validation

    if (!await getUser(email)) {
        const hashedPassword = await bcrypt.hash(password,10);
        await insertUser(email, name, surname, hashedPassword, dateOfBirth);
    } else {
        res.send("This email address is already taken"); // change to erros throw
    }

    res.send('User successfully added');
})


app.listen(port);