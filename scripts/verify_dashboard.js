
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user.model.js";
import { Video } from "../src/models/video.model.js";
import { Subscription } from "../src/models/subscription.model.js";
import { Like } from "../src/models/like.model.js";
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
            videoFilePublicId: "vid_dash_test",
            thumbnail: "http://example.com/thumb.jpg",
            thumbnailPublicId: "thumb_dash_test",
            title: "Test Video for Dashboard",
            description: "A video to test dashboard stats",
            duration: 120,
            views: 100,
            owner: user._id
        });
        console.log("Created dummy video:", video._id);

        // Create a subscription (self-subscribe for simplicity or just create a dummy sub)
        // Let's create a dummy subscriber
        const subscriber = await User.create({
            fullName: "Dummy Subscriber",
            email: `dummy_sub_${Date.now()}@example.com`,
            username: `dummy_sub_${Date.now()}`,
            password: "password",
            avatar: "http://example.com/avatar.jpg"
        });

        const subscription = await Subscription.create({
            subscriber: subscriber._id,
            channel: user._id
        });
        console.log("Created dummy subscription");

        // Create a like on the video
        const like = await Like.create({
            video: video._id,
            likedBy: subscriber._id
        });
        console.log("Created dummy like");


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

        // 3. Get Channel Stats
        console.log("\nGetting Channel Stats...");
        const getStatsRes = await fetch(`${BASE_URL}/dashboard/stats`, { headers });
        console.log("Get Stats Status:", getStatsRes.status);
        const getStatsData = await getStatsRes.json();
        console.log("Stats:", getStatsData.data);

        // Verify stats (roughly)
        if (getStatsData.data.totalVideos < 1) console.error("Expected at least 1 video");
        if (getStatsData.data.totalViews < 100) console.error("Expected at least 100 views");
        if (getStatsData.data.totalSubscribers < 1) console.error("Expected at least 1 subscriber");
        if (getStatsData.data.totalLikes < 1) console.error("Expected at least 1 like");


        // 4. Get Channel Videos
        console.log("\nGetting Channel Videos...");
        const getVideosRes = await fetch(`${BASE_URL}/dashboard/videos`, { headers });
        console.log("Get Videos Status:", getVideosRes.status);
        const getVideosData = await getVideosRes.json();
        console.log("Videos Count:", getVideosData.data?.length);

        const foundVideo = getVideosData.data?.find(v => v._id === video._id.toString());
        console.log("Found our video:", !!foundVideo);


        // Cleanup
        await Video.findByIdAndDelete(video._id);
        await Subscription.findByIdAndDelete(subscription._id);
        await Like.findByIdAndDelete(like._id);
        await User.findByIdAndDelete(subscriber._id);
        console.log("\nCleanup complete.");
        process.exit(0);

    } catch (error) {
        console.error("Test Failed:", error);
        process.exit(1);
    }
}

runTests();
