
import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user.model.js";
import { Video } from "../src/models/video.model.js";
import { DB_NAME } from "../src/constants.js";

dotenv.config({ path: './.env' });

const BASE_URL = "http://localhost:8000/api/v1";
const ADMIN_EMAIL = "admin_test@example.com";
const ADMIN_PASSWORD = "adminpassword";

async function runTests() {
    try {
        // 1. Setup Data directly in DB
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("Connected to DB for setup");

        // Create Admin User
        let adminUser = await User.findOne({ email: ADMIN_EMAIL });
        if (!adminUser) {
            adminUser = await User.create({
                fullName: "Admin User",
                email: ADMIN_EMAIL,
                username: "admin_test",
                password: ADMIN_PASSWORD,
                avatar: "http://example.com/admin.jpg",
                role: "admin" // Crucial step
            });
            console.log("Created Admin User:", adminUser._id);
        } else {
            // Ensure role is admin
            if (adminUser.role !== "admin") {
                adminUser.role = "admin";
                await adminUser.save();
                console.log("Updated existing user to admin role");
            }
        }

        // Create a dummy video to delete
        const video = await Video.create({
            videoFile: "http://example.com/video.mp4",
            videoFilePublicId: "vid_admin_test",
            thumbnail: "http://example.com/thumb.jpg",
            thumbnailPublicId: "thumb_admin_test",
            title: "Video to be deleted by Admin",
            description: "Admin deletion test",
            duration: 120,
            owner: adminUser._id // Owner doesn't strictly matter for admin delete, but good for context
        });
        console.log("Created dummy video:", video._id);


        // 2. Login as Admin
        console.log("\nLogging in as Admin...");
        const loginRes = await fetch(`${BASE_URL}/users/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD })
        });

        if (!loginRes.ok) throw new Error("Admin Login failed");
        const loginData = await loginRes.json();
        const accessToken = loginData.data.accessToken;

        const headers = {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": "application/json"
        };

        // 3. Get System Stats
        console.log("\nGetting System Stats...");
        const statsRes = await fetch(`${BASE_URL}/admin/stats`, { headers });
        console.log("Get Stats Status:", statsRes.status);
        const statsData = await statsRes.json();
        console.log("Stats:", statsData.data);

        if (statsRes.status !== 200) throw new Error("Failed to get system stats");

        // 4. Get All Users
        console.log("\nGetting All Users...");
        const usersRes = await fetch(`${BASE_URL}/admin/users`, { headers });
        console.log("Get Users Status:", usersRes.status);
        const usersData = await usersRes.json();
        console.log("Users Count:", usersData.data?.users?.length);

        if (usersRes.status !== 200) throw new Error("Failed to get users");

        // 5. Delete Any Video
        console.log("\nDeleting Video as Admin...");
        const deleteRes = await fetch(`${BASE_URL}/admin/video/${video._id}`, {
            method: "DELETE",
            headers
        });
        console.log("Delete Video Status:", deleteRes.status);

        if (deleteRes.status !== 200) throw new Error("Failed to delete video");

        // Verify Deletion
        const deletedVideo = await Video.findById(video._id);
        console.log("Video exists in DB:", !!deletedVideo);

        if (deletedVideo) throw new Error("Video was not deleted");

        // Cleanup
        // Admin user can stay for future tests or be deleted. Let's keep it but maybe delete if we want clean state.
        // await User.findByIdAndDelete(adminUser._id); 
        console.log("\nCleanup complete.");
        process.exit(0);

    } catch (error) {
        console.error("Test Failed:", error);
        process.exit(1);
    }
}

runTests();
