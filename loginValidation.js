const bcrypt = require("bcrypt");
const { insertUser, getUser } = require("./db.js")
const loginHandler = async (loginData ) => {
    const userData = await getUser(loginData.email);
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
    const { email, name, surname, password, dateOfBirth } = registerData;
    const hashedPassword = await bcrypt.hash(password,10);

    if (!await getUser(email)) {
        await insertUser(email, name, surname, hashedPassword, dateOfBirth);
    } else {
        console.log("User Already exist")
    }
}

module.exports = { loginHandler, registerHandler };