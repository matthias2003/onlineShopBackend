const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const dotenv = require("dotenv");
const { swaggerOptions} = require("./swagger-options");


const { credentials } = require("./middleware/credentials");
const connectDB = require("./config/db");
const corsOptions = require("./config/corsOrigins");

const apiRoutes = require('./routes/apiRoutes');
const newsletterRoutes = require("./routes/newsletterRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const port = process.env.PORT || 3001 ;
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
connectDB();

const swaggerSpec = swaggerJsdoc(swaggerOptions);


app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


app.use(cookieParser());
app.use(credentials);

app.get("/", (req, res) => {
    res.redirect("/api-docs");
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', apiRoutes);
app.use("/newsletter", newsletterRoutes);
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

app.listen(port);