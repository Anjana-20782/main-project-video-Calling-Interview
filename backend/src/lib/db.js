import mongoose from "mongoose";

import { ENV } from "./env.js";

export const connectDB = async() => {

    try {
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log("Connectd to MONGODB:", conn.connection.host);
        
    } catch (error) {
        console.log("Error connectiong to MongoDB",error);
        process.exit(1); //0 means success
        
    }
};