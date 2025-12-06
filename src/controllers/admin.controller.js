import mongoose from "mongoose"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getSystemStats = asyncHandler(async (req, res) => {
    // Get system stats
    const totalUsers = await User.countDocuments();
    const totalVideos = await Video.countDocuments();
    const totalViews = await Video.aggregate([
        { $group: { _id: null, totalViews: { $sum: "$views" } } }
    ]);
    const totalLikes = await Like.countDocuments();
    const totalComments = await Comment.countDocuments();
    const totalTweets = await Tweet.countDocuments();

    const stats = {
        totalUsers,
        totalVideos,
        totalViews: totalViews[0]?.totalViews || 0,
        totalLikes,
        totalComments,
        totalTweets
    };

    return res
        .status(200)
        .json(new ApiResponse(200, stats, "System stats fetched successfully"));
})

const getAllUsers = asyncHandler(async (req, res) => {
    // Get all users with pagination
    const { page = 1, limit = 10 } = req.query;
    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        select: "-password -refreshToken",
        sort: { createdAt: -1 }
    };

    // Since User model doesn't have aggregatePaginate plugin by default (usually), 
    // we might need to check if it does or use simple find with skip/limit.
    // Assuming we want to be consistent, let's use find/skip/limit or add plugin to User.
    // For now, let's use simple find/skip/limit.

    const skip = (options.page - 1) * options.limit;
    const users = await User.find({})
        .select("-password -refreshToken")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(options.limit);

    const totalUsers = await User.countDocuments();

    return res
        .status(200)
        .json(new ApiResponse(200, { users, totalUsers, page: options.page, limit: options.limit }, "Users fetched successfully"));
})

const deleteAnyVideo = asyncHandler(async (req, res) => {
    // Delete any video (admin only)
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findByIdAndDelete(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Cleanup related data (likes, comments, etc.) - Optional but good practice
    await Like.deleteMany({ video: videoId });
    await Comment.deleteMany({ video: videoId });

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video deleted successfully by admin"));
})

export {
    getSystemStats,
    getAllUsers,
    deleteAnyVideo
}
