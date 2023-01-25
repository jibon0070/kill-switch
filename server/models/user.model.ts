let mongoose = require("mongoose");
let schema = mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    full_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        required: true,
        default: "general"
    },
    created_at: {
        type: Number,
        required: true
    }
});
module.exports = mongoose.model("users", schema);