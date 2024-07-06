"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = main;
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
async function main() {
    try {
        const DB = process.env.DATABASE_URL;
        await mongoose_1.default.connect(DB);
        console.log("Connected to DataBase Successfully !!!");
    }
    catch (error) {
        console.log("Error is ", error);
    }
}
