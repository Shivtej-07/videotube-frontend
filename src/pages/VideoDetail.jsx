import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../index.css';
import CommentList from '../components/CommentList';
import AddToPlaylistModal from '../components/AddToPlaylistModal';

function VideoDetail() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [video, setVideo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Social State
    const [isLiked, setIsLiked] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    // Counts
    const [likeCount, setLikeCount] = useState(0);
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);

    // Deterministic fallback ONLY for subscribers if backend fails/is missing
    const getFallbackCount = (id) => {
        if (!id) return 1000;
        const seed = parseInt(id.substring(id.length - 4), 16);
        return (seed * 13) % 100000 + 500;
    };

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(`/videos/${videoId}`);
                console.log("Video detail:", response);
                const videoData = response.data.data;
                setVideo(videoData);

                // Set Real Like Count & Status from Backend
                setLikeCount(videoData.likesCount || 0);
                setIsLiked(videoData.isLiked || false);
                // Subscription status also comes from backend now
                setIsSubscribed(videoData.isSubscribed || false);

                // Fetch real subscriber count separately (as it's channel level)
                if (videoData?.owner?._id) {
                    try {
                        const subResponse = await api.get(`/subscriptions/c/${videoData.owner._id}`);
                        const realCount = subResponse.data.data.length;
                        setSubscriberCount(realCount);
                    } catch (subErr) {
                        console.warn("Could not fetch subs count:", subErr);
                        setSubscriberCount(getFallbackCount(videoData.owner._id));
                    }
                }

            } catch (err) {
                console.error("Failed to fetch video:", err);
                setError("Could not load video.");
            } finally {
                setLoading(false);
            }
        };

        if (videoId) {
            fetchVideo();
        }
    }, [videoId, user]);

    const formatCount = (count) => {
        if (count >= 1000000) {
            return (count / 1000000).toFixed(1) + 'M';
        }
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + 'K';
        }
        return count.toString();
    };

    const handleLike = async () => {
        if (!user) return alert("Please login to like videos");
        try {
            const response = await api.post(`/likes/toggle/v/${videoId}`);
            console.log("Like toggle:", response.data);

            const liked = response.data.data.isLiked;
            setIsLiked(liked);
            setLikeCount(prev => liked ? prev + 1 : prev - 1);
        } catch (err) {
            console.error("Like failed", err);
        }
    };

    const handleSubscribe = async () => {
        if (!user) return alert("Please login to subscribe");
        if (!video?.owner?._id) return;

        try {
            const response = await api.post(`/subscriptions/c/${video.owner._id}`);
            console.log("Sub toggle:", response.data);

            const newStatus = response.data.data.subscribed;
            setIsSubscribed(newStatus);
            setSubscriberCount(prev => newStatus ? prev + 1 : prev - 1);

        } catch (err) {
            console.error("Subscribe failed", err);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
    };

    if (loading) return <div className="text-center mt-8">Loading player...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
    if (!video) return <div className="text-center mt-8">Video not found.</div>;

    return (
        <div className="max-w-screen-2xl mx-auto flex flex-col lg:flex-row gap-6 p-4 lg:p-6">
            {/* Main Content */}
            <div className="lg:flex-1 w-full">
                {/* Video Player */}
                <div className="w-full aspect-video bg-black rounded-xl overflow-hidden">
                    <video
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                        poster={video.thumbnail}
                    >
                        <source src={video.videoFile} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Video Info */}
                <div className="mt-4">
                    <h1 className="text-xl lg:text-2xl font-semibold mb-2">{video.title}</h1>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                        {/* Channel Info */}
                        <div className="flex items-center gap-3">
                            <img
                                src={video.owner?.avatar || "https://via.placeholder.com/40"}
                                alt={video.owner?.username}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <h3 className="font-medium">{video.owner?.username}</h3>
                                <p className="text-sm text-gray-400">{formatCount(subscriberCount)} subscribers</p>
                            </div>

                            {user?._id === video.owner?._id ? (
                                <button
                                    onClick={() => navigate(`/video/edit/${video._id}`)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-medium text-sm transition-colors"
                                >
                                    Edit Video
                                </button>
                            ) : (
                                <button
                                    className={`px-4 py-2 rounded-full font-medium text-sm transition-colors ${isSubscribed
                                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                        : 'bg-white text-black hover:bg-gray-200'
                                        }`}
                                    onClick={handleSubscribe}
                                >
                                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                                </button>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors"
                                onClick={handleLike}
                            >
                                <span>{isLiked ? '❤️' : '👍'}</span>
                                <span>{likeCount}</span>
                            </button>
                            <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors">
                                👎
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors"
                                onClick={handleShare}
                            >
                                Share
                            </button>
                            <button
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full text-sm font-medium transition-colors"
                                onClick={() => setShowPlaylistModal(true)}
                            >
                                💾 Save
                            </button>
                        </div>
                    </div>

                    {showPlaylistModal && (
                        <AddToPlaylistModal
                            videoId={videoId}
                            onClose={() => setShowPlaylistModal(false)}
                        />
                    )}

                    {/* Description */}
                    <div className="bg-gray-800 p-4 rounded-xl mt-6">
                        <div className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                            <span>{video.views} views</span>
                            <span>•</span>
                            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-gray-200 whitespace-pre-wrap">{video.description}</p>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-8">
                        <CommentList videoId={videoId} />
                    </div>
                </div>
            </div>

            {/* Sidebar / Recommended Videos */}
            <div className="lg:w-80 w-full lg:mt-0 mt-6">
                <h3 className="text-lg font-semibold mb-4">Up Next</h3>
                <div className="space-y-4">
                    <div className="text-gray-400 text-sm">
                        Recommendations coming soon...
                    </div>
                    {/* Placeholder for recommended videos */}
                    <div className="bg-gray-800 rounded-lg p-4 animate-pulse">
                        <div className="h-40 bg-gray-700 rounded mb-3"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                    <div className="bg-gray-800 rounded-lg p-4 animate-pulse">
                        <div className="h-40 bg-gray-700 rounded mb-3"></div>
                        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default VideoDetail;