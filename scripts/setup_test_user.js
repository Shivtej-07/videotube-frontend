import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user.model.js";
import { DB_NAME } from "../src/constants.js";

dotenv.config({ path: './.env' });

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log("Connected to DB");
    } catch (error) {
        console.error("DB Connection Error", error);
        process.exit(1);
    }
};

const setupUser = async () => {
    await connectDB();
    const email = "test_playlist@example.com";
    const username = "test_playlist_user";
    const password = "password123";

    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (!user) {
        console.log("Creating test user...");
        try {
            user = await User.create({
                fullName: "Test Playlist User",
                email,
                username,
                password,
                avatar: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg",
                coverImage: ""
            });
            console.log("Test user created.");
        } catch (e) {
            console.error("Error creating user:", e);
        }
    } else {
        console.log("Test user already exists.");
    }

    console.log(`User: ${email} / ${password}`);
    process.exit(0);
};

setupUser();
