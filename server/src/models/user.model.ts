import {Document, model, Schema} from "mongoose";

export interface UserModelType extends Document{
    username: string;
    full_name: string;
    email: string;
    password: string;
    role: string;
    created_at: number;
}
const users_schema = new Schema<UserModelType>({
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
module.exports = model<UserModelType>("users", users_schema);