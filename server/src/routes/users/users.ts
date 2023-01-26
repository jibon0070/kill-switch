import {UserModelType} from "../../models/user.model";
import {Response} from "express";
import {CRequest} from "../../types/CRequest";

const jwt = require('jsonwebtoken');
let bcrypt = require("bcrypt");

const router = require('express').Router();
const UserModel = require("../../models/user.model");

router.post("/register", async (req: CRequest, res: Response) => {
    if (!['visitor'].includes(req.user.role ?? "")) return res.sendStatus(401);
    let {username, full_name, email, password} = req.body;
    //check required
    if (!username) return res.json({input_error: {name: "username", message: "Username is required."}});
    if (!full_name) return res.json({input_error: {name: "full_name", message: "Full name is required."}});
    if (!email) return res.json({input_error: {name: "email", message: "Email is required."}});
    if (!password) return res.json({input_error: {name: "password", message: "Password is required."}});

    //check for min length
    if (username.length < 4) return res.json({
        input_error: {
            name: "username",
            message: "Username must be at least 4 characters."
        }
    });
    if (full_name.length < 4) return res.json({
        input_error: {
            name: "full_name",
            message: "Full name must be at least 4 characters."
        }
    });
    if (password.length < 8) return res.json({
        input_error: {
            name: "password",
            message: "Password must be at least 8 characters."
        }
    });

    //check for max length
    if (username.length > 50) return res.json({
        input_error: {
            name: "username",
            message: "Username must be at most 50 characters."
        }
    });
    if (full_name.length > 50) return res.json({
        input_error: {
            name: "full_name",
            message: "Full name must be at most 50 characters."
        }
    });
    if (password.length > 50) return res.json({
        input_error: {
            name: "password",
            message: "Password must be at most 50 characters."
        }
    });

    //check for unique username
    let user: UserModelType;
    try {
        user = await UserModel.findOne({username: username});
    }
    catch (e) {
        return res.json({
            error: "Error retrieving user"
        })
    }
    if (user) return res.json({input_error: {name: "username", message: "Username is already registered."}});

    //check for unique email
    try {
        user = await UserModel.findOne({email: email});
    }
    catch (e) {
        return res.json({
            error: "Error retrieving user"
        });
    }
    if (user) return res.json({input_error: {name: "email", message: "Email is already registered."}});

    password = bcrypt.hashSync(password, bcrypt.genSaltSync());

    //create user
    user = UserModel({
        username, full_name, email, password, role: "general", created_at: new Date().getTime()
    })

    try {
        await user.save();
    }
    catch (e) {
        return res.json({
            error: "Error saving user"
        })
    }

    const payload = {id: user._id, role: user.role};
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return res.json({token, success: true});
});

router.post('/login', async (req: CRequest, res: Response) => {
    if (!['visitor'].includes(req.user.role ?? "")) return res.sendStatus(401);
    let {username, password} = req.body;
    //check required
    if (!username) return res.json({input_error: {name: "username", message: "Username is required."}});
    if (!password) return res.json({input_error: {name: "password", message: "Password is required."}});

    let user: UserModelType;
    try {
        user = await UserModel.findOne({$or: [{username: username}, {email: username}]});
    }
    catch (e) {
        return res.json({
            error: "Error retrieving user"
        })
    }

    if (!user) return res.json({input_error: {name: "username", message: "Invalid username or email."}});
    if (!bcrypt.compareSync(password, user.password)) return res.json({
        input_error: {
            name: "password",
            message: "Invalid password."
        }
    });

    const payload = {id: user._id, role: user.role};
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    return res.json({token, success: true});
});

router.post("/uniq", async (req: CRequest, res: Response) => {
    const {value, field} = req.body;
    const filter: { [key: string]: any } = {};
    filter[field] = value;
    let user: UserModelType;
    try {
        user = await UserModel.findOne(filter);
    }
    catch (e) {
        return res.json(false);
    }
    if (!user)
        return res.json(true);
    else
        return res.json(false);
})

module.exports = router;