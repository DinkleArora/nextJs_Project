import mongoose from "mongoose";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

let isConnected = false;

export async function connect() {
    if (isConnected) {
        return;
    }

    try {
        console.log(
            "MongoDB URI hostname:",
            process.env.MONGO_URI?.split("@")[1]?.split("/")[0]
        );
        await mongoose.connect(process.env.MONGO_URI!);
        isConnected = true;
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection failed:", error);
        throw error;
    }
}
