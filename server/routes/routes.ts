import {Router} from "express";

const router: Router = require("express").Router();

router.get("/", (req, res) => {
    return res.json("Kill switch api.");
})

router.use("/users", require("./users/users"));
module.exports = router;