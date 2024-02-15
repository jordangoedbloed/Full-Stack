import express from "express";
import "dotenv/config";
import Router from "./routes/Pagination.js";
import mongoose from "mongoose";
import cors from "cors";

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/AOE");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/kitty", Router);

app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(process.env.PORT, () => {
  console.log("server staat aan");
});
