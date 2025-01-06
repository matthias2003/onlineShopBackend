const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { credentials } = require("./middleware/credentials")
const corsOptions = require("./config/corsOrigins")
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const mainRoutes = require("./routes/mainRoutes");
const apiRoutes = require('./routes/apiRoutes');
const newsletterRoutes = require("./routes/newsletterRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const port = process.env.PORT || 3001 ;
const app = express();

dotenv.config();

connectDB();


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(cookieParser());
app.use(credentials);

app.use("/", mainRoutes);
app.use('/api', apiRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(port);