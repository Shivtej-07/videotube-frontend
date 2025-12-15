
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user.model.js";
import { Video } from "../src/models/video.model.js";
import { Comment } from "../src/models/comment.model.js";
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
            videoFilePublicId: "vid_comment_test",
            thumbnail: "http://example.com/thumb.jpg",
            thumbnailPublicId: "thumb_comment_test",
            title: "Test Video for Comments",
            description: "A video to test comments",
            duration: 120,
            owner: user._id
        });
        console.log("Created dummy video:", video._id);

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

        // 3. Add Comment
        console.log(`\nAdding Comment to Video ${video._id}...`);
        const addCommentRes = await fetch(`${BASE_URL}/comments/${video._id}`, {
            method: "POST",
            headers,
            body: JSON.stringify({ content: "This is a test comment" })
        });
        console.log("Add Comment Status:", addCommentRes.status);
        const addCommentData = await addCommentRes.json();
        const commentId = addCommentData.data?._id;
        console.log("Comment ID:", commentId);

        if (!commentId) throw new Error("Failed to add comment");

        // 4. Get Video Comments
        console.log("\nGetting Video Comments...");
        const getCommentsRes = await fetch(`${BASE_URL}/comments/${video._id}`, { headers });
        console.log("Get Comments Status:", getCommentsRes.status);
        const getCommentsData = await getCommentsRes.json();
        console.log("Comments Count:", getCommentsData.data?.docs?.length || getCommentsData.data?.length);

        // 5. Update Comment
        console.log("\nUpdating Comment...");
        const updateCommentRes = await fetch(`${BASE_URL}/comments/c/${commentId}`, {
            method: "PATCH",
            headers,
            body: JSON.stringify({ content: "Updated test comment" })
        });
        console.log("Update Comment Status:", updateCommentRes.status);
        const updateCommentData = await updateCommentRes.json();
        console.log("Updated Content:", updateCommentData.data?.content);

        // 6. Delete Comment
        console.log("\nDeleting Comment...");
        const deleteCommentRes = await fetch(`${BASE_URL}/comments/c/${commentId}`, {
            method: "DELETE",
            headers
        });
        console.log("Delete Comment Status:", deleteCommentRes.status);

        // Cleanup
        await Video.findByIdAndDelete(video._id);
        // Comments should cascade delete ideally, or we delete manually.
        // For now, let's just delete the one we created if it still exists (though we just deleted it via API)
        // But if API failed, we might want to cleanup.
        await Comment.deleteMany({ video: video._id });
        console.log("\nCleanup complete.");
        process.exit(0);

    } catch (error) {
        console.error("Test Failed:", error);
        process.exit(1);
    }
}

runTests();
