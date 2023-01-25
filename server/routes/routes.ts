import {Router} from "express";


const router: Router = require("express").Router();
const authenticate = require("../authenticate");


router.use("/", authenticate);
router.get("/", (req, res) => {
    return res.json("Kill switch api.");
})
router.use("/home", require("./home/home"));

router.use("/users", require("./users/users"));
module.exports = router;