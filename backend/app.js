const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const distributionRoutes = require("./routes/distributionRoutes");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/distribution", distributionRoutes);

module.exports = app;
