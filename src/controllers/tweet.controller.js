import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    // Create tweet
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user?._id
    });

    if (!tweet) {
        throw new ApiError(500, "Failed to create tweet");
    }

    return res
        .status(201)
        .json(new ApiResponse(201, tweet, "Tweet created successfully"));
})

const getUserTweets = asyncHandler(async (req, res) => {
    // Get user tweets
    const { userId } = req.params;

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const tweets = await Tweet.find({ owner: userId }).sort({ createdAt: -1 });

    return res
        .status(200)
        .json(new ApiResponse(200, tweets, "User tweets fetched successfully"));
})

const updateTweet = asyncHandler(async (req, res) => {
    // Update tweet
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this tweet");
    }

    tweet.content = content;
    await tweet.save();

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
})

const deleteTweet = asyncHandler(async (req, res) => {
    // Delete tweet
    const { tweetId } = req.params;

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    const tweet = await Tweet.findById(tweetId);

    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    if (tweet.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this tweet");
    }

    await Tweet.findByIdAndDelete(tweetId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
