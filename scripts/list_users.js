import dotenv from "dotenv"
import mongoose from "mongoose"
import { User } from "../src/models/user.model.js"
import connectDB from "../src/db/index.js"

dotenv.config({
    path: './.env'
})

const listUsers = async () => {
    try {
        await connectDB()

        const users = await User.find({}).select("username email role")
        console.log("Found users:")
        users.forEach(u => {
            console.log(`- Username: ${u.username}, Email: ${u.email}, Role: ${u.role}`)
        })

    } catch (error) {
        console.error("Error listing users:", error)
    } finally {
        await mongoose.connection.close()
        process.exit(0)
    }
}

listUsers()
