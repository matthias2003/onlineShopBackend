const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { getData, getBestsellers, loginUser } = require("./db.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require("./middleware/auth");
const { credentials } = require("./middleware/credentials")
const corsOptions = require("./config/corsOrigins")
const cookieParser = require("cookie-parser");
const { z } = require("zod");
const mailtrap = require("mailtrap");
const multer = require('multer');
const { list, put } = require('@vercel/blob');
const { createReadStream, unlink} = require("node:fs");
const {
    getUser,
    insertUser,
    getRefreshToken,
    updateRefreshToken,
    deleteRefreshToken,
    getDataGender,
    getDataByName,
    getDataById,
    verifyUser,
    updateUser,
    updatePassword
} = require("./db");


const token = process.env.EMAIL_API_KEY;
const senderEmail = process.env.EMAIL_SENDER;

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
const client = new mailtrap.MailtrapClient({ token: token });
const sender = { name: "Sneaker Store", email: senderEmail };


//TODO: ADD STATUS CODES TO RESPONSES

dotenv.config();
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
    res.json("Online shop Api")
});

app.get("/api", async ( req, res)  => {
    const data = await getData();
    res.send(data);
})

app.get("/api/bestsellers", async (req , res) => {
    const data = await getBestsellers();
    res.send(data);
})

app.post("/api/gender", async ( req, res)  => {
    const data = await getDataGender(req.body.gender);
    res.send(data);
})

app.post("/api/search", async (req , res) => {
    const data = await getDataByName(req.body.name);
    res.send(data);
})

app.get("/api/item/:id", async (req , res) => {
    const data = await getDataById(req.params.id);
    res.send(data);
})

app.post("/login", async (req, res) => {
    const loginData = req.body;
    if (!loginData.password || !loginData.email) {
        return "Not all fields have been filled in";
    }

    const userData = await getUser(loginData.email);
    let accessToken,refreshToken;
    if (userData && userData.verified) {
        if (userData && ( await bcrypt.compare(loginData.password, userData.password))) {
            accessToken = generateToken(userData.email,process.env.ACCESS_TOKEN_SECRET,"10min")
            refreshToken = generateToken(userData.email,process.env.REFRESH_TOKEN_SECRET,"7d")
            await updateRefreshToken(userData.email, refreshToken);
            res.cookie('jwt', refreshToken , { maxAge: 604800000, httpOnly: true, secure: true, sameSite:"none", partitioned:true});
            res.json( { status:true, accessToken });
        } else {
            res.status(401).json({status:false});
        }
    } else {
        res.status(401).json({status:"User not verified"});
    }
})

app.post("/register", async (req, res) => {
    const { email, name, surname, password, dateOfBirth } = req.body;
    const passwordReg = new RegExp(/^(?=.*[0-9])(?=.*[- ?!@#$%^&*\/\\])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9- ?!@#$%^&*\/\\]{8,30}$/)
    const emailReg = new RegExp(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);
    const names = name.split(' ');
    const surnames = surname.split(' ');
    const date =  z.coerce.date();

    let birthDate;
    try {
        birthDate = date.parse(new Date(dateOfBirth));
    } catch (err) {
        console.log(err)
    }

    if (name && email && password && surname && dateOfBirth) {
        if (!await getUser(email)) {
            if (names.length <= 3 && surnames.length <= 2) {
            if (passwordReg.exec(password)) {
                if (emailReg.exec(email)) {
                    const hashedPassword = await bcrypt.hash(password,10);

                    const key = process.env.EMAIL_API_KEY;
                    const senderEmail = process.env.EMAIL_SENDER;
                    const client = new mailtrap.MailtrapClient({ token: key });
                    const sender = { name: "Sneaker Store", email: senderEmail };
                    const emailToken = generateToken(email, process.env.EMAIL_TOKEN_SECRET, "48h");

                    try {
                       await client.send({
                            from: sender,
                            to: [{email:email}],
                            template_uuid: "1108a623-eb36-4477-9fc7-aa458a10cd0e",
                            template_variables: {
                                "name": name,
                                "token": emailToken
                            }
                          })

                        await insertUser(email, name, surname, hashedPassword, birthDate);
                        res.send('User successfully added');
                    } catch (err) {
                        res.send(err.message);
                    }

                } else {
                    res.send("Invalid email")
                }
            } else {
                res.send("Password doesn't fulfill requirements")
            }
            } else {
                res.send("Name or surname is too long")
            }
        } else {
            res.send("This email address is already taken");
        }
    } else {
        res.send("Not all fields are fill in");
    }
})

app.get("/register/account-confirmation/:token", async (req,res) => {
    const token = req.params.token;
    let email;
    console.log(token)
    jwt.verify( token, process.env.EMAIL_TOKEN_SECRET,(err, decoded)=>{
        if (err) return res.status(403).send(err);
        email = decoded.id
    });
    await verifyUser(email);
    res.send("You have successfully verified!").redirect("/");
})

app.get("/refresh", async (req,res)=> {
    const refreshToken = req.cookies?.jwt;
    if (!refreshToken) return res.sendStatus(401)
    try {
        const data = await getRefreshToken(refreshToken);
        if(!data) res.sendStatus(403);
        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,decoded) => {
            if(err) return res.sendStatus(403);
            const accessToken = generateToken(decoded.id,process.env.ACCESS_TOKEN_SECRET,"10min");
            res.json({ accessToken })
        })
    } catch (err) {
        console.error("Error:", error);
        res.sendStatus(500);
    }

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

app.post("/user" , auth, async (req,res) => {
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


app.post("/user/update" , upload.single('image'), async (req,res) => {
    try {
        const email = req.body.email;
        const userData = JSON.parse(req.body.userData);
        if (req.file) {
            const { buffer, originalname } = req.file;
            const blobName = Date.now()+"-"+originalname;
            const fileStream = Buffer.from(buffer).toString("utf-8");
            const { url } = await put(`avatars/${blobName}`, fileStream, { access: 'public',token: process.env.BLOB_READ_WRITE_TOKEN });
            const data = await list({prefix: 'avatars/'})

            data.blobs.map( async ( item) => {
                if (item.pathname.split("/")[1] === blobName) {
                    await updateUser(email,item.url,userData); // TODO: WILL ITERATE THROUGH ALL OF ITEMS WITH SAME PATHNAME AND WILL CHANGE URL MULTIPLE TIMES
                }
            })
        } else {
            await updateUser(email,"",userData);
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to upload image' });
    }
})

app.post("/newsletter", async (req, res ) => {
    const token = process.env.EMAIL_API_KEY;
    const senderEmail = process.env.EMAIL_SENDER;
    const recipient = req.body.email
    const client = new mailtrap.MailtrapClient({ token: token });
    const sender = { name: "Sneaker Store", email: senderEmail };

    try {
        const result = await client.send({
            from: sender,
            to: [{ email: recipient }],
            template_uuid: "ae54ea25-0d9a-4e4f-8d47-a5e103b5eba5",
            template_variables: {
            }
        })
        res.send(JSON.stringify(result))
    } catch (err) {
        res.send(err.message);
    }
})

app.post("/reset-password", async (req, res) => {
    const recipient = req.body.email;

    try {
        const emailToken = generateToken(recipient,process.env.RESET_PASSWD_TOKEN_SECRET,"24h")
        const result = await client.send({
            from: sender,
            to: [{ email: recipient }],
            template_uuid: "7b444087-5235-4e92-bbc4-f98065b12424",
            template_variables: {
               "token": emailToken
            }
        })
        res.send(JSON.stringify(result))
    } catch (err) {
        res.send(err.message);
    }
})

app.post("/reset-password/set", async (req, res) => {
    const { password, confirmPassword, token } = req.body;
    const passwordReg = new RegExp(/^(?=.*[0-9])(?=.*[- ?!@#$%^&*\/\\])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9- ?!@#$%^&*\/\\]{8,30}$/)

    if (!passwordReg.test(password)) {
        return res.status(400).json({
            status: false,
            message: "Password does not meet complexity requirements."
        });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({
            status: false,
            message: "Passwords do not match."
        });
    }

    try {
        let email;
        jwt.verify( token, process.env.RESET_PASSWD_TOKEN_SECRET,(err, decoded)=>{
            if (err) return res.status(403).send(err);
            email = decoded.id
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        await updatePassword(email, hashedPassword);

        return res.status(200).json({
            status: true,
            message: "Password has been successfully updated."
        });
    } catch (err) {
        console.error("Error updating password:", err);

        return res.status(500).json({
            status: false,
            message: "An error occurred while updating the password. Please try again later."
        });
    }
})

app.listen(port);