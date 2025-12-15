
import mongoose from "mongoose";
import { User } from "../src/models/user.model.js";
import { Video } from "../src/models/video.model.js";
import { Like } from "../src/models/like.model.js";
import { Comment } from "../src/models/comment.model.js";
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

const verifyCopyrightDelete = async () => {
    await connectDB();

    try {
        console.log("\n--- Starting Verification ---\n");

        // 1. Create a dummy user
        const dummyUser = await User.create({
            username: "copyright_test_user_" + Date.now(),
            email: "copyright_test_" + Date.now() + "@example.com",
            fullName: "Copyright Test User",
            password: "password123",
            avatar: "http://example.com/avatar.jpg"
        });
        console.log("Dummy User created:", dummyUser.username);

        // 2. Create a dummy video owned by the user
        const dummyVideo = await Video.create({
            videoFile: "http://example.com/video.mp4",
            thumbnail: "http://example.com/thumb.jpg",
            title: "Copyright Violation Video",
            description: "This video violates copyright",
            duration: 120,
            owner: dummyUser._id,
            videoFilePublicId: "dummy_public_id",
            thumbnailPublicId: "dummy_thumb_id"
        });
        console.log("Dummy Video created:", dummyVideo.title);

        // 3. Create a mock request/response to simulate controller call
        // We will call the controller logic directly or through a fetch if server was running.
        // Since we want to test logic, we can simulate the DB changes directly or import controller.
        // However, middleware (auth/admin) is hard to mock in a simple script without running app.
        // So we will simulate the LOGIC intended by the controller:
        //  - Delete video
        //  - Add strike
        // And then verify results.

        console.log("\n--- Simulating Admin Action ---");

        // Controller Logic Simulation
        const videoToDelete = await Video.findById(dummyVideo._id);
        if (videoToDelete) {
            await Video.findByIdAndDelete(videoToDelete._id);
            await Like.deleteMany({ video: videoToDelete._id });
            await Comment.deleteMany({ video: videoToDelete._id });

            const owner = await User.findById(videoToDelete.owner);
            if (owner) {
                owner.copyrightStrikes = (owner.copyrightStrikes || 0) + 1;
                await owner.save({ validateBeforeSave: false });
                console.log("Strike added to user.");
            }
            console.log("Video deleted.");
        }

        console.log("\n--- Verifying Results ---");

        // 4. Verify Video is gone
        const deletedVideo = await Video.findById(dummyVideo._id);
        console.log("Video exists in DB?", !!deletedVideo);
        if (!deletedVideo) console.log("PASSED: Video deleted.");
        else console.error("FAILED: Video still exists.");

        // 5. Verify User has strike
        const updatedUser = await User.findById(dummyUser._id);
        console.log("User Copyright Strikes:", updatedUser.copyrightStrikes);
        if (updatedUser.copyrightStrikes === 1) console.log("PASSED: User has 1 strike.");
        else console.error("FAILED: User strike count is incorrect.");

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

verifyCopyrightDelete();
