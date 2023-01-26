const UserModel = require("./models/user.model");
import {NextFunction, Response} from "express";
import {CRequest} from "./types/CRequest";

const jwt = require("jsonwebtoken");

function send_visitor_response(req: CRequest, next: NextFunction) {
    req.user = {
        id: "",
        role: "visitor"
    };
    return next();
}

const authenticate = async (req: CRequest, res: Response, next: NextFunction) => {
    const {headers} = req;
    if (!headers) return send_visitor_response(req, next);
    const {authorization} = headers;
    if (!authorization) return send_visitor_response(req, next);
    const [_, token] = authorization.split(" ");
    if (!token) return send_visitor_response(req, next);
    let payload: { id: string; role: string; };
    try {
        payload = jwt.verify(token, process.env.JWT_SECRET);
    }
    catch (e) {
        console.trace(e);
        return send_visitor_response(req, next)
    }
    let user: any;
    try {
        user = await UserModel.findOne({_id: payload.id, role: payload.role});
    }
    catch (e) {
        console.trace(e);
        return send_visitor_response(req, next);
    }
    if (!user) return send_visitor_response(req, next);
    req.user = {};
    req.user.id = user._id;
    req.user.role = user.role;
    return next();
}


module.exports = authenticate;