import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { Like } from "../models/like.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js"

export const getAllVideos = asyncHandler(async (req, res) => {
    const {
        page = 1,
        limit = 10,
        query = "",
        sortBy = "createdAt",
        sortType = "desc",
        userId
    } = req.query;

    // Convert pagination values to numbers
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;

    // Build filter conditions
    const filter = {};

    // 🔍 Search by title or description
    if (query) {
        filter.$or = [
            { title: { $regex: query, $options: "i" } },
            { description: { $regex: query, $options: "i" } }
        ];
    }

    // 👤 Filter by uploader userId
    if (userId) {
        filter.owner = userId;
    }

    // Sorting
    const sort = {};
    sort[sortBy] = sortType === "asc" ? 1 : -1;

    // Pagination
    const skip = (pageNumber - 1) * limitNumber;

    // Fetch videos
    const videos = await Video
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limitNumber)
        .populate("owner", "username avatar");

    const totalVideos = await Video.countDocuments(filter);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {
                    videos,
                    pagination: {
                        totalVideos,
                        page: pageNumber,
                        limit: limitNumber,
                        totalPages: Math.ceil(totalVideos / limitNumber)
                    }
                },
                "Videos fetched successfully"
            )
        );
});

export const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required");
    }

    // Video + Thumbnail Files (from multer)
    // Note: Field name is 'video' as per recent refactor
    const videoLocalPath = req?.files?.video?.[0]?.path;
    const thumbnailLocalPath = req?.files?.thumbnail?.[0]?.path;

    if (!videoLocalPath) {
        throw new ApiError(400, "Video file is required");
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "Thumbnail image is required");
    }

    // Upload to Cloudinary
    const video = await uploadOnCloudinary(videoLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!video || !thumbnail) {
        throw new ApiError(500, "Cloudinary upload failed");
    }

    // Create Video Document
    const newVideo = await Video.create({
        title,
        description,
        videoFile: video.url,
        videoFilePublicId: video.public_id,
        thumbnail: thumbnail.url,
        thumbnailPublicId: thumbnail.public_id,
        duration: video.duration || 0,
        owner: req.user?._id
    });

    return res.status(201).json(
        new ApiResponse(
            201,
            newVideo,
            "Video uploaded successfully"
        )
    );
});

export const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Fetch video and atomic increment views
    const video = await Video.findByIdAndUpdate(
        videoId,
        {
            $inc: { views: 1 }
        },
        { new: true }
    ).populate("owner", "username avatar");

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // -- REAL METRICS --
    // 1. Get Like Count
    const likesCount = await Like.countDocuments({ video: videoId });

    // 2. Check if Current User Liked / Subscribed (if logged in)
    let isLiked = false;
    let isSubscribed = false;

    if (req.user) {
        // Add to watch history
        await User.findByIdAndUpdate(req.user._id, {
            $addToSet: { watchHistory: videoId }
        });

        // Check Like
        isLiked = await Like.exists({
            video: videoId,
            likedBy: req.user._id
        });

        // Check Subscription to Channel Owner
        isSubscribed = await Subscription.exists({
            subscriber: req.user._id,
            channel: video.owner._id
        });
    }

    // Combine data
    const videoData = {
        ...video.toObject(),
        likesCount,
        isLiked: !!isLiked,
        isSubscribed: !!isSubscribed
    };

    return res.status(200).json(
        new ApiResponse(
            200,
            videoData,
            "Video fetched successfully"
        )
    );
});

export const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;

    // Validate ID
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Find video
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Check ownership — ONLY the uploader can update
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to update this video");
    }

    // Update title and description if provided
    if (title) video.title = title;
    if (description) video.description = description;

    // Handle new thumbnail upload (optional)
    const thumbnailLocalPath = req?.file?.path; // For single file upload

    if (thumbnailLocalPath) {
        const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath);

        if (!thumbnailUpload?.url && !thumbnailUpload?.secure_url) {
            throw new ApiError(500, "Failed to upload thumbnail to Cloudinary");
        }

        // Delete old thumbnail if exists
        if (video.thumbnailPublicId) {
            await deleteFromCloudinary(video.thumbnailPublicId, "image");
        }

        video.thumbnail = thumbnailUpload.secure_url || thumbnailUpload.url;
        video.thumbnailPublicId = thumbnailUpload.public_id;
    }

    // Save updates
    await video.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            video,
            "Video updated successfully"
        )
    );
});

export const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Validate video ID
    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    // Find video
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Allow delete only if user is the owner
    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not allowed to delete this video");
    }

    // Delete files from Cloudinary
    try {
        if (video.videoFilePublicId) {
            await deleteFromCloudinary(video.videoFilePublicId, "video");
        }
        if (video.thumbnailPublicId) {
            await deleteFromCloudinary(video.thumbnailPublicId, "image");
        }
    } catch (error) {
        // Not critical - do not block request
        console.log("Cloudinary delete failed:", error);
    }

    // Delete video document
    await Video.findByIdAndDelete(videoId);

    return res.status(200).json(
        new ApiResponse(
            200,
            {},
            "Video deleted successfully"
        )
    );
});

export const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    if (video.owner.toString() !== req.user?._id.toString()) {
        throw new ApiError(403, "You are not allowed to toggle publish status");
    }

    video.isPublished = !video.isPublished;
    await video.save();

    return res.status(200).json(
        new ApiResponse(
            200,
            { isPublished: video.isPublished },
            "Video publish status toggled successfully"
        )
    );
});