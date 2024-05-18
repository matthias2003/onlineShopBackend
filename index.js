const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { getData, getBestsellers, loginUser } = require("./db.js");
const { json } = require("express");
const { getUser, insertUser } = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require('./middleware/auth');
const corsOptions = require("./config/corsOrigins")
const cookieParser = require("cookie-parser");

//TODO: ADD STATUS CODES TO RESPONSES

dotenv.config();
const port = process.env.PORT || 3001 ;
const app = express();
const generateToken = (id,secret, expires) => {
    return jwt.sign({ id }, secret, { expiresIn: `${expires}` });
};

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(cookieParser());
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
    let accessToken,refreshToken;
    if (userData && ( await bcrypt.compare(loginData.password, userData.password))) {
        accessToken = generateToken(userData._id,process.env.ACESS_TOKEN_SECRET,"10min")
        refreshToken = generateToken(userData._id,process.env.REFRESH_TOKEN_SECRET,"7d")
        res.cookie('jwt', refreshToken , { maxAge: 604800, httpOnly: true, secure: true});
        res.json( { status:true, accessToken });
    } else {
        res.status(401).json({status:false});
    }
})

app.post("/register", async (req, res) => {
    const { email, name, surname, password, dateOfBirth } = req.body;
    const passwordReg = new RegExp(/^(?=.*[0-9])(?=.*[- ?!@#$%^&*\/\\])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9- ?!@#$%^&*\/\\]{8,30}$/)
    const emailReg = new RegExp(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);

    if (name && email && password && surname && dateOfBirth) {
        if (!await getUser(email)) {
            if (passwordReg.exec(password)) {
                if (emailReg.exec(email)) {
                    const hashedPassword = await bcrypt.hash(password,10);
                    await insertUser(email, name, surname, hashedPassword, dateOfBirth);
                    res.send('User successfully added');
                } else {
                    res.send("Invalid email")
                }
            } else {
                res.send("Password doesn't fulfill requirements")
            }
        } else {
            res.send("This email address is already taken");
        }
    } else {
        res.send("Not all fields are fill in");
    }
})

app.post("/loggedIn", auth,(req,res) => {
    res.send(true); // TODO: change responses
})

app.post("/logout", (req,res) => {
    res.clearCookie('jwt');
    res.send("done");
})


app.listen(port);