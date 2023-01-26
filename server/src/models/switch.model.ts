import {Document, model, Schema} from "mongoose"

export interface SwitchModelType extends Document{
    link: string;
    status: boolean;
    created_at: number
}

const switch_schema = new Schema<SwitchModelType>({
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
module.exports = model<SwitchModelType>("switches", switch_schema);