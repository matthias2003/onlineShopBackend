const bcrypt = require("bcrypt");
const { registerUser } = require("./db.js")
const { ObjectId } = require("mongodb");
const loginHandler = async (loginData, userData ) => {
    let returnedData = {};
    if (userData) {
        returnedData.status = await bcrypt.compare(loginData.password, userData.password);
        returnedData.message = returnedData.status ? "Logged in" : "Incorrect password";
    } else {
        returnedData.status = false;
        returnedData.message = "User not found";
    }
    return returnedData;
}

const registerHandler = async (registerData) => {
    // miejsce na walidację danych, sprawdzenie siły hasła itp
    const hashedPassword = await bcrypt.hash(registerData.password,10);
    registerData._id = new ObjectId();
    await registerUser(registerData);

}

module.exports = { loginHandler, registerHandler };