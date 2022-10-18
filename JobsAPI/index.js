require("dotenv").config();
require("express-async-errors");

// extra security package.
const helmet = require("helmet");
var cors = require("cors");
var xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

const express = require("express");
const app = express();
const { connectDB } = require("./db/connect");
const authRouter = require("./routes/auth");
const jobsRouter = require("./routes/jobs");
const authMiddleWare = require("./middleware/authentication");
// error handler
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//middleware

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 request allowed
});
app.set("trust proxy", 1);
app.use(limiter);
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());

// Swagger
const swaggerUi = require("swagger-ui-express");
const path = require("path");
const yaml = require("yamljs");
const yamlAbsolutePath = path.resolve(__dirname, "swagger.yaml");
console.log(yamlAbsolutePath)
const swaggerDocument = yaml.load(yamlAbsolutePath);

app.get("/", (req, res) => {
  res.setHeader("Content-type", "text/html");
  res.write("<h1>Welcome to Jobs API</h1>");
  res.write('<a href="/api-use" target="_blank">Swagger Documentation</a>');
  res.send();
});

app.use("/api-use", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", authMiddleWare, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 3000;

// Check if mongo db connection is successful then only listen to port.
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Jobs API app listening on port ${port}!`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();
