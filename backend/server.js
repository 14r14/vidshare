const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const dotenv = require("dotenv").config();

const session = require("express-session");
const MongoStore = require("connect-mongo");

const app = express();
app.use(
  cors({
    origin: "http://localhost:3001",
  })
);
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://localhost:27017/vidshare",
      ttl: 60 * 60 * 24 * 7, // 1 week
      autoRemove: "native",
      crypto: {
        secret: process.env.MONGO_STORE_SECRET,
      },
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 3, // 3 hours
      sameSite: true,
      secure: false,
    }
  })
);

const authRoutes = require("./routes/auth.routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRoutes);

mongoose.connect("mongodb://localhost:27017/vidshare").then(() => {
  console.log("Connected to MongoDB");
  app.listen(3000, () => {
    console.log("Server started on port 3000");
  });
});
