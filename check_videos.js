import mongoose from "mongoose";
import dotenv from "dotenv";
import { Video } from "./src/models/video.model.js";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`\n MongoDB connected !!`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

const checkVideos = async () => {
    await connectDB();
    try {
        const count = await Video.countDocuments();
        console.log(`Total videos in DB: ${count}`);

        if (count > 0) {
            const video = await Video.findOne();
            console.log("Sample video:", JSON.stringify(video, null, 2));
        }
    } catch (err) {
        console.error(err);
    } finally {
        mongoose.disconnect();
    }
};

checkVideos();
