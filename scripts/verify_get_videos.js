
import mongoose from "mongoose";
import { User } from "../src/models/user.model.js";
import { Video } from "../src/models/video.model.js";
import dotenv from "dotenv";

dotenv.config({
    path: './.env'
})

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`)
        console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1)
    }
}

const verifyGetVideos = async () => {
    await connectDB();

    try {
        console.log("\n--- Starting Verification ---\n");

        // 1. Create a dummy user
        const dummyUser = await User.create({
            username: "video_fetch_user_" + Date.now(),
            email: "video_fetch_" + Date.now() + "@example.com",
            fullName: "Video Fetch User",
            password: "password123",
            avatar: "http://example.com/avatar.jpg"
        });
        console.log("Dummy User created:", dummyUser.username);

        // 2. Create 3 dummy videos owned by the user
        await Video.create([
            {
                videoFile: "http://example.com/v1.mp4",
                thumbnail: "http://example.com/t1.jpg",
                title: "Video 1",
                description: "Desc 1",
                duration: 120,
                owner: dummyUser._id,
                videoFilePublicId: "pub1",
                thumbnailPublicId: "thumb1",
                isPublished: true
            },
            {
                videoFile: "http://example.com/v2.mp4",
                thumbnail: "http://example.com/t2.jpg",
                title: "Video 2",
                description: "Desc 2",
                duration: 130,
                owner: dummyUser._id,
                videoFilePublicId: "pub2",
                thumbnailPublicId: "thumb2",
                isPublished: false
            },
            {
                videoFile: "http://example.com/v3.mp4",
                thumbnail: "http://example.com/t3.jpg",
                title: "Video 3",
                description: "Desc 3",
                duration: 140,
                owner: dummyUser._id,
                videoFilePublicId: "pub3",
                thumbnailPublicId: "thumb3",
                isPublished: true
            }
        ]);
        console.log("3 Dummy Videos created (1 unpublished).");

        console.log("\n--- Simulating Admin Action ---");

        // Simulate Controller Logi: Get All Videos for User
        const videos = await Video.aggregate([
            {
                $match: {
                    owner: dummyUser._id
                }
            },
            {
                $sort: {
                    createdAt: -1
                }
            }
        ]);

        console.log(`Fetched ${videos.length} videos.`);

        // Verify count
        if (videos.length === 3) console.log("PASSED: Retrieved all 3 videos.");
        else console.error(`FAILED: Expected 3 videos, got ${videos.length}`);

        // Verify content
        const unpublishedVideo = videos.find(v => !v.isPublished);
        if (unpublishedVideo) console.log("PASSED: Retrieved unpublished video.");
        else console.error("FAILED: Unpublished video missing.");


        // Cleanup
        console.log("\n--- Cleanup ---");
        await Video.deleteMany({ owner: dummyUser._id });
        await User.findByIdAndDelete(dummyUser._id);
        console.log("Dummy User and Videos deleted.");

    } catch (error) {
        console.error("Verification failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

verifyGetVideos();
