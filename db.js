const mongoose = require('mongoose');
const { Products, User } = require('./databseSchemas.js');
const dotenv = require("dotenv");
const stream = require("node:stream");

const main = async () => {
    dotenv.config();
    await mongoose.connect(`mongodb+srv://admin:${process.env.DB_PASSWORD}@shop.rdhilhf.mongodb.net/Shop?retryWrites=true&w=majority`);
}

const getData = async () => {
    return Products.find().sort({_id: -1}).limit(4);
}

const getDataByName = async (name) => {
    const regex = new RegExp(name, 'i')
    return Products.find({name: {$regex: regex}})
}

const getDataById = async (id) => {
    return Products.find({_id:id});
}

const getBestsellers = async () => {
    return Products.find().sort({sold:-1}).limit(4);
}

const getDataGender = async (gender) => {
    return Products.find({gender:gender});
}

const updateUser = async (email,url,userData) => {
    if (url) {
        userData.profilePicture = url;
    }
    return User.updateOne({email:email},{ $set: userData })
}

const updatePassword = async (email, password) => {
    return User.updateOne({email:email},{ $set: { password: password } })
}

const getUser = async (emailInfo) => {
    return User.findOne({email:emailInfo});
}

const getRefreshToken = async (token) => {
    return User.findOne({refreshToken: token})
}

const updateRefreshToken = async (email,token) => {
    return User.updateOne({email:email},{ $set: { refreshToken:token } })
}

const deleteRefreshToken = async (token) => {
    return User.updateOne({refreshToken: token},{$unset:{ refreshToken:"" }});
}

const insertUser = async (email, name, surname, hashedPassword, dateOfBirth,refreshToken) => {
    await User.create({
        name: name,
        surname: surname,
        email: email,
        password: hashedPassword,
        dateOfBirth: new Date(dateOfBirth),
        profilePicture:"https://vxdod9oqkeyknlzg.public.blob.vercel-storage.com/avatars/avatar-default-lqO1mxSvUe9aS0gfn7Gr9y1INIgB9o.svg"
    })
}

const verifyUser = async ( email, ) => {
    await User.collection.updateOne({ email: email }, { $set: { verified:true } })
}

main().catch(err => console.log(err));

module.exports = {
    getData,
    getBestsellers,
    getUser,
    insertUser,
    updateUser,
    getRefreshToken,
    updateRefreshToken,
    deleteRefreshToken,
    getDataGender,
    getDataByName,
    getDataById,
    verifyUser,
    updatePassword
};





