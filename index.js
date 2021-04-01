const express = require("express");
const mongoose = require("mongoose");
const authRouter = require("./authRouter.js");
require("dotenv").config();
const PORT = process.env.PORT || 3001;
const MONGO_URL =
  process.env.MONGO_URL ||
  "mongodb+srv://dbuser:1qaz2wsx@cluster0.fkfff.mongodb.net/ulbitv-auth-roles?retryWrites=true&w=majority";

const app = express();
app.use(express.json());
app.use("/auth", authRouter);
console.log("process.env.PORT", process.env.PORT);
console.log("process.env.MONGO_URL", process.env.MONGO_URL);

const start = async () => {
  try {
    await mongoose.connect(
      MONGO_URL,
      { useNewUrlParser: true, useUnifiedTopology: true },
      (err) => {
        if (err) throw err;
        console.log("Connection established");
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
      }
    );
  } catch (e) {
    console.log(e);
  }
};

start();
