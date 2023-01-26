import {SwitchModelType} from "../../models/switch.model";
import {CRequest} from "../../types/CRequest";
import {Response} from "express";

const SwitchModel = require("../../models/switch.model");

const router = require("express").Router();

router.get("/", async (req: CRequest, res: Response) => {
    if (!['admin'].includes(req.user.role ?? "")) return res.sendStatus(401);
    const switches = await SwitchModel.aggregate([
        {$match: {}},
        {$addFields: {id: "$_id"}},
        {$project: {id: 1, _id: 0, link: 1, status: 1}}
    ]);
    return res.json({switches});
})

router.post("/new", async (req: CRequest, res: Response) => {
    if (!['admin'].includes(req.user.role ?? "")) return res.sendStatus(401);
    const {link} = req.body;
    if (!link) return res.json({input_error: {name: "link", message: "Link is required."}});

    //check duplicate link
    let c_switch: SwitchModelType;
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

router.post("/toggle-status", async (req: CRequest, res: Response) => {
    if (!['admin'].includes(req.user.role ?? "")) return res.sendStatus(401);
    const {id, checked} = req.body;
    let c_switch: SwitchModelType;
    try {
        c_switch = await SwitchModel.findOne({_id: id});
    }
    catch (e) {
        return res.json({error: "Error retrieving switch"});
    }
    if (c_switch) {
        c_switch.status = checked;
        try {
            await c_switch.save();
        }
        catch (e) {
            return res.json({error: "Error saving switch"});
        }
    }
    return res.json({success: true});
})

router.post("/delete", async (req: CRequest, res: Response) => {
    if (!['admin'].includes(req.user.role ?? "")) return res.sendStatus(401);
    const {id} = req.body;
    let c_switch: SwitchModelType;
    try {
        c_switch = await SwitchModel.findOne({_id: id});
    }
    catch (e) {
        return res.json({error: "Error retrieving switch"});
    }
    if (c_switch) {
        try {
            await c_switch.delete();
        }
        catch (e) {
            return res.json({error: "Error deleting switch"});
        }
    }
    return res.json({success: true});
})

module.exports = router