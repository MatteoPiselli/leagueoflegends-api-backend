require("dotenv").config();
require("./database/connection");

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

var indexRouter = require("./routes/index");
var summonersRouter = require("./routes/summoner");
var masteriesRouter = require("./routes/masteries");
var matchsRouter = require("./routes/matchs");
var rankedRouter = require("./routes/ranked");
var championsRouter = require("./routes/champions");

var app = express();

const cors = require("cors");
app.use(cors({ origin: process.env.ORIGIN || "http://localhost:3000" }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api/summoner", summonersRouter);
app.use("/api/masteries", masteriesRouter);
app.use("/api/matchs", matchsRouter);
app.use("/api/ranked", rankedRouter);
app.use("/api/champions", championsRouter);

module.exports = app;
