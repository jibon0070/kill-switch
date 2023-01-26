import {Express} from "express";
import * as mongoose from "mongoose";

require('dotenv').config();
const express = require('express');
const app: Express = express();

app.use(express.json());

app.use(require('cors')());

app.use("/api", require("./routes/routes"));

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI!);

let port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`server running in http://localhost:${port}/api`);
});