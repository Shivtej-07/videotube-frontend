
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user.model.js";
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

        // 3. Create Tweet
        console.log("\nCreating Tweet...");
        const createTweetRes = await fetch(`${BASE_URL}/tweets`, {
            method: "POST",
            headers,
            body: JSON.stringify({ content: "This is a test tweet" })
        });
        console.log("Create Tweet Status:", createTweetRes.status);
        const createTweetData = await createTweetRes.json();
        const tweetId = createTweetData.data?._id;
        console.log("Tweet ID:", tweetId);

        if (!tweetId) throw new Error("Failed to create tweet");

        // 4. Get User Tweets
        console.log("\nGetting User Tweets...");
        const getTweetsRes = await fetch(`${BASE_URL}/tweets/user/${user._id}`, { headers });
        console.log("Get Tweets Status:", getTweetsRes.status);
        const getTweetsData = await getTweetsRes.json();
        console.log("Tweets Count:", getTweetsData.data?.length);

        // 5. Update Tweet
        console.log("\nUpdating Tweet...");
        const updateTweetRes = await fetch(`${BASE_URL}/tweets/${tweetId}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ content: "Updated test tweet" })
        });
        console.log("Update Tweet Status:", updateTweetRes.status);
        const updateTweetData = await updateTweetRes.json();
        console.log("Updated Content:", updateTweetData.data?.content);

        // 6. Delete Tweet
        console.log("\nDeleting Tweet...");
        const deleteTweetRes = await fetch(`${BASE_URL}/tweets/${tweetId}`, {
            method: "DELETE",
            headers
        });
        console.log("Delete Tweet Status:", deleteTweetRes.status);

        // Cleanup
        // Tweet should be deleted by API, but let's double check
        await Tweet.findByIdAndDelete(tweetId);
        console.log("\nCleanup complete.");
        process.exit(0);

    } catch (error) {
        console.error("Test Failed:", error);
        process.exit(1);
    }
}

runTests();
