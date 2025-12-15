
import mongoose from "mongoose";
import { User } from "../src/models/user.model.js";
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

const verifyStrikesHidden = async () => {
    await connectDB();

    try {
        console.log("\n--- Starting Verification ---\n");

        // 1. Create a dummy user
        const dummyUser = await User.create({
            username: "hidden_strikes_" + Date.now(),
            email: "hidden_" + Date.now() + "@example.com",
            fullName: "Hidden Strikes User",
            password: "password123",
            avatar: "http://example.com/avatar.jpg",
            copyrightStrikes: 5 // Force set it initially
        });
        console.log("Dummy User created:", dummyUser.username);

        // 2. Fetch User normally (simulating getCurrentUser or public profile)
        const userNormal = await User.findById(dummyUser._id);
        console.log("Fetched User (Normal):");
        console.log("  username:", userNormal.username);
        console.log("  copyrightStrikes:", userNormal.copyrightStrikes);

        if (userNormal.copyrightStrikes === undefined) {
            console.log("PASSED: copyrightStrikes is undefined in normal fetch.");
        } else {
            console.error("FAILED: copyrightStrikes is exposed!");
        }

        // 3. Fetch User with explicit selection (simulating admin)
        const userAdmin = await User.findById(dummyUser._id).select("+copyrightStrikes");
        console.log("Fetched User (Admin Select):");
        console.log("  username:", userAdmin.username);
        console.log("  copyrightStrikes:", userAdmin.copyrightStrikes);

        if (userAdmin.copyrightStrikes === 5) {
            console.log("PASSED: copyrightStrikes is visible when explicitly selected.");
        } else {
            console.error("FAILED: copyrightStrikes is missing or incorrect in admin fetch.");
        }

        // Cleanup
        console.log("\n--- Cleanup ---");
        await User.findByIdAndDelete(dummyUser._id);
        console.log("Dummy User deleted.");

    } catch (error) {
        console.error("Verification failed:", error);
    } finally {
        await mongoose.disconnect();
    }
}

verifyStrikesHidden();
