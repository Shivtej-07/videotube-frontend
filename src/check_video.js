import mongoose from "mongoose";
import { DB_NAME } from "./constants.js";
import { Video } from "./models/video.model.js";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
});

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection error ", error);
        process.exit(1);
    }
};

const checkLatestVideo = async () => {
    await connectDB();
    try {
        const video = await Video.findOne().sort({ createdAt: -1 });
        console.log("Latest Video:");
        console.log("Title:", video?.title);
        console.log("Duration:", video?.duration);
        console.log("Video URL:", video?.videoFile);
    } catch (error) {
        console.error("Error fetching video:", error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

checkLatestVideo();
