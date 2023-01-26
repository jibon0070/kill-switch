const SwitchModel = require("../models/switch.model");
import {Router} from "express";
import {SwitchModelType} from "../models/switch.model";


const router: Router = require("express").Router();
const authenticate = require("../authenticate");


router.use("/", authenticate);
router.get("/", (req, res) => {
    return res.json("Kill switch api.");
})
router.use("/home", require("./home/home"));
router.use("/users", require("./users/users"));

router.get("/:link", async (req, res) => {
    const {link} = req.params;
    let c_switch: SwitchModelType;
    try {
        c_switch = await SwitchModel.findOne({link});
    }
    catch (e) {
        return res.sendStatus(500);
    }
    return res.json(c_switch.status);
})

module.exports = router;