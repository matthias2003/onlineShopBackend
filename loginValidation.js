const bcrypt = require("bcrypt");
const { registerUser } = require("./db.js")
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
    const { email, name, surname, password, dateOfBirth } = registerData;
    const hashedPassword = await bcrypt.hash(password,10);
    
    await registerUser(email, name, surname, hashedPassword, dateOfBirth);

}

module.exports = { loginHandler, registerHandler };