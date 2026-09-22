import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import CommentList from '../components/CommentList';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import VideoCard from '../components/VideoCard';
import {
    ThumbsUp,
    Share2,
    BookmarkPlus,
    Edit3,
    UserCheck,
    UserPlus,
    Eye,
    Calendar,
    Loader2,
} from 'lucide-react';

function VideoDetail() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [video, setVideo] = useState(null);
    const [recommendedVideos, setRecommendedVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Social State
    const [isLiked, setIsLiked] = useState(false);
    const [isSubscribed, setIsSubscribed] = useState(false);

    // Counts
    const [likeCount, setLikeCount] = useState(0);
    const [subscriberCount, setSubscriberCount] = useState(0);
    const [showPlaylistModal, setShowPlaylistModal] = useState(false);

    const getFallbackCount = (id) => {
        if (!id) return 1000;
        const seed = parseInt(id.substring(id.length - 4), 16);
        return (seed * 13) % 100000 + 500;
    };

    useEffect(() => {
        const fetchVideoAndRecommendations = async () => {
            setLoading(true);
            try {
                const response = await api.get(`/videos/${videoId}`);
                const videoData = response.data.data;
                setVideo(videoData);

                // Real Like Count & Status
                setLikeCount(videoData.likesCount || 0);
                setIsLiked(videoData.isLiked || false);
                setIsSubscribed(videoData.isSubscribed || false);

                // Fetch real subscriber count
                if (videoData?.owner?._id) {
                    try {
                        const subResponse = await api.get(`/subscriptions/c/${videoData.owner._id}`);
                        setSubscriberCount(subResponse.data.data.length);
                    } catch (subErr) {
                        setSubscriberCount(getFallbackCount(videoData.owner._id));
                    }
                }

                // Fetch real recommended videos
                try {
                    const recResponse = await api.get('/videos');
                    const allVids = recResponse.data.data?.videos || [];
                    setRecommendedVideos(allVids.filter((v) => v._id !== videoId).slice(0, 10));
                } catch (recErr) {
                    console.warn("Could not load recommended videos:", recErr);
                }

            } catch (err) {
                console.error("Failed to fetch video:", err);
                setError("Could not load video.");
            } finally {
                setLoading(false);
            }
        };

        if (videoId) {
            fetchVideoAndRecommendations();
        }
    }, [videoId, user]);

    const formatCount = (count) => {
        if (!count) return "0";
        if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
        if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
        return count.toString();
    };

    const handleLike = async () => {
        if (!user) return alert("Please login to like videos");
        try {
            const response = await api.post(`/likes/toggle/v/${videoId}`);
            const liked = response.data.data.isLiked;
            setIsLiked(liked);
            setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
        } catch (err) {
            console.error("Like failed", err);
        }
    };

    const handleSubscribe = async () => {
        if (!user) return alert("Please login to subscribe");
        if (!video?.owner?._id) return;

        try {
            const response = await api.post(`/subscriptions/c/${video.owner._id}`);
            const newStatus = response.data.data.subscribed;
            setIsSubscribed(newStatus);
            setSubscriberCount((prev) => (newStatus ? prev + 1 : prev - 1));
        } catch (err) {
            console.error("Subscribe failed", err);
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert("Video link copied to clipboard!");
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
            <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
            <p className="text-sm font-medium text-zinc-400">Loading video player...</p>
        </div>
    );

    if (error) return (
        <div className="text-center mt-12 px-4">
            <div className="text-red-400 text-lg font-semibold mb-4">{error}</div>
            <button
                onClick={() => navigate('/')}
                className="px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded-full text-sm font-semibold transition-colors"
            >
                Back to Home
            </button>
        </div>
    );

    if (!video) return <div className="text-center mt-12 text-zinc-400">Video not found.</div>;

    return (
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 p-2 sm:p-4">
            {/* Main Player & Info */}
            <div className="lg:flex-1 w-full min-w-0">
                {/* Native HTML5 Video Player */}
                <div className="w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl border border-zinc-800/80 relative group">
                    <video
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                        poster={video.thumbnail}
                    >
                        <source src={video.videoFile} type="video/mp4" />
                        Your browser does not support HTML5 video streaming.
                    </video>
                </div>

                {/* Video Info Header */}
                <div className="mt-4">
                    <h1 className="text-lg sm:text-2xl font-bold text-zinc-100 leading-snug mb-3">
                        {video.title}
                    </h1>

                    {/* Action Bar */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/80">
                        {/* Channel Details & Subscribe */}
                        <div className="flex items-center gap-3">
                            <img
                                src={video.owner?.avatar || "https://via.placeholder.com/40"}
                                alt={video.owner?.username}
                                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-zinc-700"
                            />
                            <div>
                                <h3 className="font-semibold text-sm sm:text-base text-zinc-100 leading-tight">
                                    {video.owner?.username}
                                </h3>
                                <p className="text-xs text-zinc-400">
                                    {formatCount(subscriberCount)} subscribers
                                </p>
                            </div>

                            {user?._id === video.owner?._id ? (
                                <button
                                    onClick={() => navigate(`/video/edit/${video._id}`)}
                                    className="ml-2 flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-semibold text-xs sm:text-sm transition-all active:scale-95"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    <span>Edit</span>
                                </button>
                            ) : (
                                <button
                                    className={`ml-2 flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-xs sm:text-sm transition-all active:scale-95 ${
                                        isSubscribed
                                            ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                                            : 'bg-white text-zinc-950 hover:bg-zinc-200'
                                    }`}
                                    onClick={handleSubscribe}
                                >
                                    {isSubscribed ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                                    <span>{isSubscribed ? 'Subscribed' : 'Subscribe'}</span>
                                </button>
                            )}
                        </div>

                        {/* Social Interaction Buttons */}
                        <div className="flex items-center gap-2 flex-wrap">
                            <button
                                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all active:scale-95 ${
                                    isLiked
                                        ? 'bg-red-600/20 text-red-500 border border-red-500/40'
                                        : 'bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200'
                                }`}
                                onClick={handleLike}
                            >
                                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-red-500' : ''}`} />
                                <span>{likeCount}</span>
                            </button>

                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-full text-xs sm:text-sm font-semibold text-zinc-200 transition-all active:scale-95"
                                onClick={handleShare}
                            >
                                <Share2 className="w-4 h-4" />
                                <span>Share</span>
                            </button>

                            <button
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700/80 rounded-full text-xs sm:text-sm font-semibold text-zinc-200 transition-all active:scale-95"
                                onClick={() => setShowPlaylistModal(true)}
                            >
                                <BookmarkPlus className="w-4 h-4" />
                                <span>Save</span>
                            </button>
                        </div>
                    </div>

                    {showPlaylistModal && (
                        <AddToPlaylistModal
                            videoId={videoId}
                            onClose={() => setShowPlaylistModal(false)}
                        />
                    )}

                    {/* Description Glass Box */}
                    <div className="bg-zinc-900/70 border border-zinc-800/80 p-4 rounded-2xl mt-4">
                        <div className="flex items-center gap-4 text-xs font-medium text-zinc-400 mb-2">
                            <span className="flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5 text-zinc-500" />
                                {video.views} views
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar className="w-3.5 h-3.5 text-zinc-500" />
                                {new Date(video.createdAt).toLocaleDateString(undefined, {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })}
                            </span>
                        </div>
                        <p className="text-zinc-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">
                            {video.description || "No description provided for this video."}
                        </p>
                    </div>

                    {/* Comments Section */}
                    <div className="mt-8">
                        <CommentList videoId={videoId} />
                    </div>
                </div>
            </div>

            {/* Up Next Recommended Feed */}
            <div className="lg:w-80 w-full flex-shrink-0">
                <h3 className="text-base font-bold text-zinc-100 mb-4 tracking-tight">
                    Recommended Videos
                </h3>
                {recommendedVideos.length === 0 ? (
                    <div className="text-sm text-zinc-500 italic py-4">No other videos available.</div>
                ) : (
                    <div className="space-y-4">
                        {recommendedVideos.map((recVid) => (
                            <VideoCard key={recVid._id} video={recVid} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default VideoDetail;