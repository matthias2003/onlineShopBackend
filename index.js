const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { auth } = require("./middleware/auth");
const { credentials } = require("./middleware/credentials")
const corsOptions = require("./config/corsOrigins")
const cookieParser = require("cookie-parser");
const multer = require('multer');
const connectDB = require("./config/db");

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


//TODO: ADD STATUS CODES TO RESPONSES

dotenv.config();
connectDB();

const port = process.env.PORT || 3001 ;
const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieParser());
app.use(credentials);

const generateToken = (id,secret, expires) => {
    return jwt.sign({ id }, secret, { expiresIn: `${expires}` });
};


app.get("/" , (req, res) => {
});

app.get("/api", async ( req, res)  => {

})

app.get("/api/bestsellers", async (req , res) => {

})

app.post("/api/gender", async ( req, res)  => {

})

app.post("/api/search", async (req , res) => {

})

app.get("/api/item/:id", async (req , res) => {

})

app.post("/login", async (req, res) => {

})

app.post("/register", async (req, res) => {

})

app.get("/register/account-confirmation/:token", async (req,res) => {

})

app.get("/refresh", async (req,res)=> {

})

app.post("/logout", async (req,res) => {
})

app.post("/user" , auth, async (req,res) => {
})


app.post("/user/update" , upload.single('image'), async (req,res) => {
})

app.post("/newsletter", async (req, res ) => {

})

app.post("/reset-password", async (req, res) => {

})

app.post("/reset-password/set", async (req, res) => {

})

app.listen(port);