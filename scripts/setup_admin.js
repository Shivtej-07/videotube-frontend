import dotenv from "dotenv"
import mongoose from "mongoose"
import { User } from "../src/models/user.model.js"
import connectDB from "../src/db/index.js"

dotenv.config({
    path: './.env'
})

const setupAdmin = async () => {
    const username = "shivtej";
    const email = "shivtej@example.com";
    const password = "password123";
    const fullName = "Shivtej Admin";

    try {
        await connectDB()

        // Check if user exists
        let user = await User.findOne({ username })

        if (!user) {
            console.log(`User '${username}' not found. Creating new user...`)
            user = await User.create({
                username,
                email,
                password,
                fullName,
                avatar: "https://res.cloudinary.com/demo/image/upload/v1312461204/sample.jpg" // Dummy avatar
            })
            console.log(`User '${username}' created successfully.`)
        } else {
            console.log(`User '${username}' already exists.`)
        }

        // Promote to admin
        user.role = "admin"
        await user.save({ validateBeforeSave: false })

        console.log(`Successfully promoted user '${username}' to admin`)
        console.log(`Credentials: username=${username}, password=${password}`)

    } catch (error) {
        console.error("Error setting up admin:", error)
    } finally {
        await mongoose.connection.close()
        process.exit(0)
    }
}

setupAdmin()
