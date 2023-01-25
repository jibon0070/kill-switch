import { Request } from "express"
export interface CRequest extends Request {
    user: {
        id?: string;
        role?: string;
    } // or any other type
}