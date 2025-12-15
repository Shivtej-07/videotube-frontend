import dotenv from "dotenv"
import mongoose from "mongoose"
import { User } from "../src/models/user.model.js"
import connectDB from "../src/db/index.js"

dotenv.config({
    path: './.env'
})

const makeAdmin = async () => {
    const username = process.argv[2]

    if (!username) {
        console.error("Please provide a username as an argument")
        process.exit(1)
    }

    try {
        await connectDB()

        const user = await User.findOne({ username })

        if (!user) {
            console.error(`User '${username}' not found`)
            process.exit(1)
        }

        user.role = "admin"
        await user.save({ validateBeforeSave: false })

        console.log(`Successfully promoted user '${username}' to admin`)

    } catch (error) {
        console.error("Error promoting user to admin:", error)
    } finally {
        await mongoose.connection.close()
        process.exit(0)
    }
}

makeAdmin()
