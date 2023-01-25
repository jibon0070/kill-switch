const SwitchModel = require("../../models/switch.model");
import {CRequest} from "../../types/CRequest";
import {Response} from "express";

const router = require("express").Router();

router.post("/new", async (req: CRequest, res: Response) => {
    if (!['admin'].includes(req.user.role ?? "")) return res.sendStatus(401);
    const {link} = req.body;
    if (!link) return res.json({input_error: {name: "link", message: "Link is required."}});

    //check duplicate link
    let c_switch: any;
    try {
        c_switch = await SwitchModel.findOne({link});
    }
    catch (e) {
        return res.json({error: "Error retrieving switch"});
    }
    if (c_switch) return res.json({error: "Link already exists"});

    c_switch = new SwitchModel({
        link, status: true, created_at: new Date().getTime()
    })

    try {
        await c_switch.save();
    }
    catch (e) {
        return res.json({error: "Error saving switch"});
    }

    return res.json({success: true});
});

module.exports = router