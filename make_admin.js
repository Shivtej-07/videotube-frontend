import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "./src/models/user.model.js";

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`\n MongoDB connected !!`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

const makeAdmin = async () => {
    await connectDB();
    try {
        // Find the most recently created user or by specific username
        const user = await User.findOne().sort({ createdAt: -1 });

        if (!user) {
            console.log("No users found.");
            return;
        }

        user.role = "admin"; // Check your User model if this field exists, usually added manually or default 'user'
        // If 'role' is not in schema, you might need to add it to schema first or ensure it supports it.
        // Assuming strict schema is on, checking schema...

        await user.save({ validateBeforeSave: false }); // Bypass validation just in case
        console.log(`User ${user.username} is now an ADMIN.`);

    } catch (err) {
        console.error("Failed to promote user:", err);
    } finally {
        mongoose.disconnect();
    }
};

makeAdmin();
