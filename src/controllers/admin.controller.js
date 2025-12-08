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

const deleteVideoForCopyright = asyncHandler(async (req, res) => {
    // Delete video for copyright violation and add strike to user
    const { videoId } = req.params;

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    const userId = video.owner;

    // Delete the video
    await Video.findByIdAndDelete(videoId);

    // Cleanup related data
    await Like.deleteMany({ video: videoId });
    await Comment.deleteMany({ video: videoId });

    // Add strike to user
    const user = await User.findById(userId).select("+copyrightStrikes");
    if (user) {
        user.copyrightStrikes = (user.copyrightStrikes || 0) + 1;
        await user.save({ validateBeforeSave: false });
    }

    return res
        .status(200)
        .json(new ApiResponse(200, { copyrightStrikes: user ? user.copyrightStrikes : 0 }, "Video deleted for copyright violation, strike added to user"));
})

const getVideosByUserId = asyncHandler(async (req, res) => {
    // Get all videos by user ID
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { createdAt: -1 }
    };

    const videos = await Video.aggregate([
        {
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: (options.page - 1) * options.limit
        },
        {
            $limit: options.limit
        }
    ]);

    const totalVideos = await Video.countDocuments({ owner: userId });

    return res
        .status(200)
        .json(new ApiResponse(200, { videos, totalVideos, page: options.page, limit: options.limit }, "User videos fetched successfully"));
})

const deleteUser = asyncHandler(async (req, res) => {
    // Delete user
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Cleanup related data
    await Video.deleteMany({ owner: userId });
    await Like.deleteMany({ likedBy: userId });
    await Comment.deleteMany({ owner: userId });
    await Subscription.deleteMany({ subscriber: userId });
    await Subscription.deleteMany({ channel: userId });
    await Tweet.deleteMany({ owner: userId });


    return res
        .status(200)
        .json(new ApiResponse(200, {}, "User deleted successfully"));
})

const getUserById = asyncHandler(async (req, res) => {
    // Get user details
    const { userId } = req.params;

    if (!mongoose.isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    const user = await User.findById(userId).select("+copyrightStrikes +refreshToken +password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User details fetched successfully"));
})

export {
    getSystemStats,
    getAllUsers,
    deleteAnyVideo,
    deleteVideoForCopyright,
    getVideosByUserId,
    deleteUser,
    getUserById
}
