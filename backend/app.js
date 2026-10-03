// const express = require("express");
// const userRouter = require("./routes/userRoutes");

// const app = express();

// app.use(express.json());
// app.use("/api/v2/users", userRouter);
// module.exports = app;

const express = require("express");
const cors = require("cors");

const userRouter = require("./routes/userRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/v2/users", userRouter);

module.exports = app;
