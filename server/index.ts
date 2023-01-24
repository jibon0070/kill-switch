import {Express} from "express";

const express = require('express');
const app: Express = express();

app.use(express.json());

app.use("/api", require("./routes/routes"));

let port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`server running in http://localhost:${port}/api`);
});