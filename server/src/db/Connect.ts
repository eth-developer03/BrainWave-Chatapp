// DataBase Connection
import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

export default async function main(): Promise<void> {
    try {
        const DB= process.env.DATABASE_URL as string;

await mongoose.connect(DB)
console.log("Connected to DataBase Successfully !!!");

    } catch (error) {
        console.log("Error is ",error);
        
    }
}