
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user.model.js";
import { Video } from "../src/models/video.model.js";
import { Tweet } from "../src/models/tweet.model.js";
import { DB_NAME } from "../src/constants.js";

dotenv.config({ path: './.env' });

const BASE_URL = "http://localhost:8000/api/v1";
const EMAIL = "test_playlist@example.com";
const PASSWORD = "password123";

async function runTests() {
    try {
        // 1. Setup Data directly in DB
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("Connected to DB for setup");

        const user = await User.findOne({ email: EMAIL });
        if (!user) throw new Error("Test user not found. Run setup_test_user.js first.");

        // Create a dummy video
        const video = await Video.create({
            videoFile: "http://example.com/video.mp4",
            videoFilePublicId: "vid_123",
            thumbnail: "http://example.com/thumb.jpg",
            thumbnailPublicId: "thumb_123",
            title: "Test Video for Likes",
            description: "A video to test likes",
            duration: 120,
            owner: user._id
        });
        console.log("Created dummy video:", video._id);

        // Create a dummy tweet
        const tweet = await Tweet.create({
            content: "This is a test tweet for likes",
            owner: user._id
        });
        console.log("Created dummy tweet:", tweet._id);

        // 2. Login
        console.log("\nLogging in...");
        const loginRes = await fetch(`${BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: EMAIL, password: PASSWORD })
        });

        if (!loginRes.ok) throw new Error("Login failed");
        const loginData = await loginRes.json();
        const accessToken = loginData.data.accessToken;

        const headers = {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        };

        // 3. Test Toggle Video Like
        console.log(`\nToggling Like on Video ${video._id}...`);
        const likeVideoRes = await fetch(`${BASE_URL}/likes/toggle/v/${video._id}`, { method: "POST", headers });
        console.log("Like Video Status:", likeVideoRes.status);
        const likeVideoData = await likeVideoRes.json();
        console.log("Is Liked:", likeVideoData.data?.isLiked);

        // 4. Test Toggle Tweet Like
        console.log(`\nToggling Like on Tweet ${tweet._id}...`);
        const likeTweetRes = await fetch(`${BASE_URL}/likes/toggle/t/${tweet._id}`, { method: "POST", headers });
        console.log("Like Tweet Status:", likeTweetRes.status);
        const likeTweetData = await likeTweetRes.json();
        console.log("Is Liked:", likeTweetData.data?.isLiked);

        // 5. Get Liked Videos
        console.log("\nGetting Liked Videos...");
        const getLikedRes = await fetch(`${BASE_URL}/likes/videos`, { headers });
        console.log("Get Liked Videos Status:", getLikedRes.status);
        const getLikedData = await getLikedRes.json();
        console.log("Liked Videos Count:", getLikedData.data?.length);
        const foundVideo = getLikedData.data?.find(v => v.video._id === video._id.toString());
        console.log("Found our liked video:", !!foundVideo);

        // Cleanup
        await Video.findByIdAndDelete(video._id);
        await Tweet.findByIdAndDelete(tweet._id);
        // We should also delete the likes, but for now it's fine.
        console.log("\nCleanup complete.");
        process.exit(0);

    } catch (error) {
        console.error("Test Failed:", error);
        process.exit(1);
    }
}

runTests();
