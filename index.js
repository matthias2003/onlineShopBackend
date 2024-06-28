const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { getData, getBestsellers, loginUser } = require("./db.js");
const { json } = require("express");
const { getUser, insertUser, getRefreshToken, updateRefreshToken, deleteRefreshToken } = require("./db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require("./middleware/auth");
const { credentials } = require("./middleware/credentials")
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
app.use(credentials);
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
        accessToken = generateToken(userData.email,process.env.ACCESS_TOKEN_SECRET,"10min")
        refreshToken = generateToken(userData.email,process.env.REFRESH_TOKEN_SECRET,"7d")
        await updateRefreshToken(userData.email,refreshToken);
        res.cookie('jwt', refreshToken , { maxAge: 604800000, httpOnly: true, secure: true, sameSite:"none"});
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

app.get("/refresh", async (req,res)=> {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken) return res.sendStatus(401)
    const data = await getRefreshToken(refreshToken);
    if(!data) res.sendStatus(403);
    jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,decoded) => {
        if(err) res.sendStatus(403);
        const accessToken = generateToken(decoded.id,process.env.ACCESS_TOKEN_SECRET,"10min");
        res.json({ accessToken })
    })
})

app.post("/loggedIn", auth,(req,res) => {
    res.send(true); // TODO: change responses
})

app.post("/logout", async (req,res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt) res.sendStatus(204);
    else {
        await deleteRefreshToken(cookies?.jwt);
        res.clearCookie('jwt',{httpOnly: true, secure: true, sameSite:"none"});
        res.send("logged out");
    }
})

app.post("/user" , async (req,res) => {
    const { id } = req.body;
    const data = await getUser(id)
    const resData = {
        email: data.email,
        name: data.name,
        surname: data.surname,
        profilePicture:data.profilePicture
    }
    res.json(resData);
})


app.listen(port);