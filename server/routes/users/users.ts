import {Router} from "express";

const router: Router = require('express').Router();

router.post("/register", (req, res) => {
    return res.json("User");
});

module.exports = router;