const { User } = require('../models/user');

const getUser = async (email) => {
    return User.findOne({ email });
}

const getRefreshToken = async (token) => {
    return User.findOne({ refreshToken: token });
}

const updateUser = async (email, url, userData) => {
    if (url) {
        userData.profilePicture = url;
    }
    return User.updateOne({ email: email }, { $set: userData });
}

const updatePassword = async (email, password) => {
    return User.updateOne({ email: email }, { $set: { password: password } });
}

const updateRefreshToken = async (email,token) => {
    return User.updateOne({email:email},{ $set: { refreshToken:token } })
}

const deleteRefreshToken = async (token) => {
    return User.updateOne({refreshToken: token},{$unset:{ refreshToken:"" }});
}


const insertUser = async (email, name, surname, hashedPassword, dateOfBirth) => {
    await User.create({
        name,
        surname,
        email,
        password: hashedPassword,
        dateOfBirth: new Date(dateOfBirth),
        profilePicture: "https://vxdod9oqkeyknlzg.public.blob.vercel-storage.com/avatars/avatar-default-lqO1mxSvUe9aS0gfn7Gr9y1INIgB9o.svg"
    });
}

const verifyUser = async (email) => {
    await User.collection.updateOne({ email: email }, { $set: { verified: true } });
}

module.exports = {
    getUser,
    getRefreshToken,
    updateUser,
    updatePassword,
    insertUser,
    verifyUser,
    updateRefreshToken,
    deleteRefreshToken
};
