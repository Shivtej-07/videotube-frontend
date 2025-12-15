
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

const verifyUserManagement = async () => {
    await connectDB();

    try {
        console.log("\n--- Starting Verification ---\n");

        // 1. Create a dummy user
        const dummyUser = await User.create({
            username: "manage_user_" + Date.now(),
            email: "manage_" + Date.now() + "@example.com",
            fullName: "Manage Test User",
            password: "password123",
            avatar: "http://example.com/avatar.jpg",
            copyrightStrikes: 2
        });
        console.log("Dummy User created:", dummyUser.username);

        // 2. Create some data for this user
        await Video.create({
            videoFile: "http://example.com/v.mp4",
            thumbnail: "http://example.com/t.jpg",
            title: "User Video",
            description: "Desc",
            duration: 100,
            owner: dummyUser._id,
            videoFilePublicId: "vid1",
            thumbnailPublicId: "thumb1"
        });
        console.log("Dummy Video created.");

        // 3. Simulate getUserById (Admin)
        console.log("\n--- Simulate Get User Info (Admin) ---");
        const userAdmin = await User.findById(dummyUser._id).select("+copyrightStrikes +refreshToken +password");
        console.log("Fetched User:");
        console.log("  copyrightStrikes:", userAdmin.copyrightStrikes);

        if (userAdmin.copyrightStrikes === 2) console.log("PASSED: Retrieved hidden fields.");
        else console.error("FAILED: Hidden fields missing.");


        // 4. Simulate deleteUser (Admin)
        console.log("\n--- Simulate Delete User (Admin) ---");

        // Simulating controller logic
        await User.findByIdAndDelete(dummyUser._id);
        await Video.deleteMany({ owner: dummyUser._id });

        console.log("User and related data deleted.");

        // Verify Deletion
        const deletedUser = await User.findById(dummyUser._id);
        const deletedVideo = await Video.findOne({ owner: dummyUser._id });

        if (!deletedUser) console.log("PASSED: User deleted from DB.");
        else console.error("FAILED: User still exists.");

        if (!deletedVideo) console.log("PASSED: User video deleted.");
        else console.error("FAILED: User video still exists.");

    } catch (error) {
        console.error("Verification failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

verifyUserManagement();
