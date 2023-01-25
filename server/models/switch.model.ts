let mongoose = require("mongoose");
let schema = mongoose.Schema({
    link: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    },
    created_at: {
        type: Number,
        required: true
    }
});
module.exports = mongoose.model("switches", schema);