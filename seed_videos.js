import mongoose from "mongoose";
import dotenv from "dotenv";
import { Video } from "./src/models/video.model.js";
import { User } from "./src/models/user.model.js";

dotenv.config();

const sampleVideos = [
    {
        title: "Building a YouTube Clone with MERN Stack",
        description: "Learn how to build a full-stack video sharing application...",
        duration: 1240,
        views: 10500,
        isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop",
        videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
        videoFilePublicId: "dummy_vid_1",
        thumbnailPublicId: "dummy_thumb_1"
    },
    {
        title: "Top 10 VS Code Extensions for 2024",
        description: "Boost your productivity with these essential VS Code extensions...",
        duration: 685,
        views: 5200,
        isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=1000&auto=format&fit=crop",
        videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
        videoFilePublicId: "dummy_vid_2",
        thumbnailPublicId: "dummy_thumb_2"
    },
    {
        title: "React vs Vue vs Angular - Which one to choose?",
        description: "A comprehensive comparison of the top frontend frameworks...",
        duration: 945,
        views: 23000,
        isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1000&auto=format&fit=crop",
        videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
        videoFilePublicId: "dummy_vid_3",
        thumbnailPublicId: "dummy_thumb_3"
    },
    {
        title: "Lofi Beats to Code/Relax to",
        description: "Chill vibes for your coding session...",
        duration: 3600,
        views: 89000,
        isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000&auto=format&fit=crop",
        videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
        videoFilePublicId: "dummy_vid_4",
        thumbnailPublicId: "dummy_thumb_4"
    },
    {
        title: "Understanding JavaScript Closures",
        description: "Deep dive into one of JS's trickiest concepts...",
        duration: 450,
        views: 1200,
        isPublished: true,
        thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=1000&auto=format&fit=crop",
        videoFile: "https://www.w3schools.com/html/mov_bbb.mp4",
        videoFilePublicId: "dummy_vid_5",
        thumbnailPublicId: "dummy_thumb_5"
    }
];

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`);
        console.log(`\n MongoDB connected !!`);
    } catch (error) {
        console.log("MONGODB connection FAILED ", error);
        process.exit(1);
    }
};

const seedVideos = async () => {
    await connectDB();
    try {
        // Find a user to be the owner (or create one)
        let owner = await User.findOne();
        if (!owner) {
            console.log("No users found. Creating a demo user...");
            owner = await User.create({
                username: "demo_creator",
                email: "demo@example.com",
                fullName: "Demo Creator",
                password: "password123", // Note: In real app this should be hashed
                avatar: "https://ui-avatars.com/api/?name=Demo+Creator&background=random"
            });
        }

        console.log(`Assigning videos to user: ${owner.username}`);

        const videosToInsert = sampleVideos.map(video => ({
            ...video,
            owner: owner._id
        }));

        await Video.insertMany(videosToInsert);
        console.log(`Successfully added ${videosToInsert.length} sample videos!`);

    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        mongoose.disconnect();
    }
};

seedVideos();
