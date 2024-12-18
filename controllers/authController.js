const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z, date} = require("zod");
const mailtrap = require("mailtrap");
const {
    getUser,
    updateRefreshToken,
    insertUser,
    verifyUser,
    getRefreshToken,
    deleteRefreshToken,
    updatePassword
} = require("../db");

const passwordReg = new RegExp(/^(?=.*[0-9])(?=.*[- ?!@#$%^&*\/\\])(?=.*[A-Z])(?=.*[a-z])[a-zA-Z0-9- ?!@#$%^&*\/\\]{8,30}$/)
const emailReg = new RegExp(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/);


const generateToken = (id,secret, expires) => {
    return jwt.sign({ id }, secret, { expiresIn: `${expires}` });
};

exports.login = async (req, res) => {
    const loginData = req.body;
    if (!loginData.password || !loginData.email) {
        return res.status(400).json({ message: "Not all fields have been filled in" });
    }
    try {
        const userData = await getUser(loginData.email);
        if (userData && userData.verified) {
            if (userData && ( await bcrypt.compare(loginData.password, userData.password))) {
                const accessToken = generateToken(userData.email,process.env.ACCESS_TOKEN_SECRET,"10min");
                const refreshToken = generateToken(userData.email,process.env.REFRESH_TOKEN_SECRET,"7d");

                await updateRefreshToken(userData.email, refreshToken);

                res.cookie('jwt', refreshToken , { maxAge: 604800000, httpOnly: true, secure: true, sameSite:"none", partitioned:true});
                res.json( { status:true, accessToken });
            } else {
                res.status(401).json({ status:false, message: "Invalid credentials" });
            }
        } else {
            res.status(401).json({ status:false, message: "User not verified or does not exist"});
        }
    } catch (error) {
        res.status(500).json({ status:false, message: "An error occurred during login" });
    }
}

exports.register = async (req, res) => {
    const { email, name, surname, password, dateOfBirth } = req.body;
    const names = name.split(' ');
    const surnames = surname.split(' ');


    if (!email || !name || !surname || !password || !dateOfBirth) {
        return res.status(400).json({ message: "All fields are required" });
    }

    try {
        const date =  z.coerce.date();
        const birthDate = date.parse(new Date(dateOfBirth));
        const today = new Date();

        if (birthDate > today) {
            return res.status(400).json({ message: "Date of birth cannot be in the future." });
        }

        if (await getUser(email)) {
            return res.status(400).json({ message: "Email is already in use" });
        }

        if (names.length > 3 || surnames.length > 2) {
            return res.status(400).json({ message: "Name or surname is too long" });
        }

        if (!passwordReg.exec(password)) {
            return res.status(400).json({message: "Password must include upper/lowercase letters, numbers, and special characters.",});
        }

        if (!emailReg.exec(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const client = new mailtrap.MailtrapClient({token: process.env.EMAIL_API_KEY});
        const sender = { name: "Sneaker Store", email: process.env.EMAIL_SENDER };
        const emailToken = generateToken(email, process.env.EMAIL_TOKEN_SECRET, "48h");

        await client.send({
            from: sender,
            to: [{email: email}],
            template_uuid: "1108a623-eb36-4477-9fc7-aa458a10cd0e",
            template_variables: {
                "name": name,
                "token": emailToken
            }
        })

        await insertUser(email, name, surname, hashedPassword, birthDate);

        res.status(201).json({ message: "User successfully registered. Please check your email to verify your account." });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during registration" });
    }
}

exports.registerConfirmation = async (req,res) => {
    const { token } = req.params;

    try {
        let email;
        jwt.verify( token, process.env.EMAIL_TOKEN_SECRET,(err, decoded)=>{
            if (err) return res.status(400).json({ message: "Invalid or expired token" });
            email = decoded.id
        });
        await verifyUser(email);
        res.status(200).json({ message: "Account successfully verified" }).redirect("/");
    } catch (error) {
        res.status(400).json({ message: "Invalid or expired token" });
    }
}

exports.refresh = async (req,res)=> {
    const refreshToken = req.cookies?.jwt;

    if (!refreshToken) {
        return res.status(401).json({ message: "No refresh token provided" });
    }

    try {
        const data = await getRefreshToken(refreshToken);

        if (!data) {
            return res.status(403).json({ message: "Invalid refresh token" });
        }

        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,decoded) => {
            if (err) {
                return res.status(403).json({ message: "Token verification failed" });
            }
            const accessToken = generateToken(decoded.id,process.env.ACCESS_TOKEN_SECRET,"10min");
            res.status(200).json({ accessToken })
        })
    } catch (err) {
        res.status(500).json({ message: "An error occurred while refreshing token" });
    }
}

exports.logout = async (req,res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(204);
    }

    try {
        await deleteRefreshToken(cookies?.jwt);
        res.clearCookie("jwt", { httpOnly: true, secure: true, sameSite: "none" });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during logout" });
    }
}

exports.resetPassword = async (req, res) => {
    const recipient = req.body.email;

    try {
        const emailToken = generateToken(recipient,process.env.RESET_PASSWD_TOKEN_SECRET,"24h");
        const client = new mailtrap.MailtrapClient({ token: process.env.EMAIL_API_KEY });
        const sender = { name: "Sneaker Store", email: process.env.EMAIL_SENDER };

        await client.send({
            from: sender,
            to: [{ email: recipient }],
            template_uuid: "7b444087-5235-4e92-bbc4-f98065b12424",
            template_variables: {
                "token": emailToken
            }
        })
        res.status(200).json({ message: "Password reset email sent successfully" });
    } catch (err) {
        res.status(500).json({ message: "An error occurred while sending reset email" });
    }
}

exports.setResetPassword = async (req, res) => {
    const { password, confirmPassword, token } = req.body;

    if (!passwordReg.test(password)) {
        return res.status(400).json({ status: false, message: "Password does not meet complexity requirements." });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ status: false,  message: "Passwords do not match." });
    }

    try {
        let email;
        jwt.verify( token, process.env.RESET_PASSWD_TOKEN_SECRET,(err, decoded)=>{
            if (err) {
                return res.status(403).json({ message: "Token verification failed" });
            }
            email = decoded.id
        });

        const hashedPassword = await bcrypt.hash(password, 10);
        await updatePassword(email, hashedPassword);

        return res.status(200).json({ status: true, message: "Password has been successfully updated." });
    } catch (err) {
        return res.status(500).json({ status: false, message: "An error occurred while updating the password. Please try again later." });
    }
}