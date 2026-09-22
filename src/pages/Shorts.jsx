import React, { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommentList from '../components/CommentList';
import {
    Smartphone,
    Volume2,
    VolumeX,
    ThumbsUp,
    MessageSquare,
    Share2,
    X,
    Loader2,
    UserPlus,
} from 'lucide-react';

function Shorts() {
    const [shorts, setShorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const containerRef = useRef(null);
    const videoRefs = useRef({});
    const [isMuted, setIsMuted] = useState(true);

    const [activeCommentVideoId, setActiveCommentVideoId] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchShorts = async () => {
            try {
                const response = await api.get('/videos?isShorts=true');
                setShorts(response.data.data?.videos || []);
            } catch (err) {
                console.error("Failed to fetch shorts:", err);
                setError("Could not load shorts.");
            } finally {
                setLoading(false);
            }
        };

        fetchShorts();
    }, []);

    const handleLike = async (videoId) => {
        if (!user) return alert("Please login to like videos");

        try {
            const response = await api.post(`/likes/toggle/v/${videoId}`);
            const isLiked = response.data.data.isLiked;

            setShorts((prevShorts) =>
                prevShorts.map((video) => {
                    if (video._id === videoId) {
                        return {
                            ...video,
                            isLiked: isLiked,
                            likesCount: isLiked
                                ? (video.likesCount || 0) + 1
                                : (video.likesCount || 0) - 1,
                        };
                    }
                    return video;
                })
            );
        } catch (err) {
            console.error("Failed to toggle like:", err);
        }
    };

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.6,
        };

        const handleIntersection = (entries) => {
            entries.forEach((entry) => {
                const videoId = entry.target.dataset.id;
                if (!videoId) return;

                const videoElement = videoRefs.current[videoId];

                if (entry.isIntersecting) {
                    if (videoElement) {
                        videoElement.play().catch((err) => console.log("Auto-play blocked:", err));
                    }
                } else {
                    if (videoElement) {
                        videoElement.pause();
                        videoElement.currentTime = 0;
                    }
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersection, observerOptions);

        Object.values(videoRefs.current).forEach((video) => {
            if (video && video.parentElement) observer.observe(video.parentElement);
        });

        return () => {
            observer.disconnect();
        };
    }, [shorts]);

    const togglePlay = (videoId) => {
        const video = videoRefs.current[videoId];
        if (video) {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        }
    };

    const toggleMute = () => {
        const nextMuted = !isMuted;
        setIsMuted(nextMuted);
        Object.values(videoRefs.current).forEach((vid) => {
            if (vid) vid.muted = nextMuted;
        });
    };

    if (loading) return (
        <div className="flex flex-col justify-center items-center h-screen bg-zinc-950 text-white gap-3">
            <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
            <p className="text-sm font-medium text-zinc-400">Loading Shorts...</p>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen bg-zinc-950 text-white p-4">
            <div className="text-center">
                <p className="text-lg text-red-400 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-6 py-2.5 bg-red-600 rounded-full font-semibold hover:bg-red-500 transition"
                >
                    Retry
                </button>
            </div>
        </div>
    );

    return (
        <div
            ref={containerRef}
            className="h-[calc(100vh-5rem)] overflow-y-scroll snap-y snap-mandatory bg-black scroll-smooth rounded-2xl border border-zinc-800/80 shadow-2xl relative"
        >
            {shorts.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-white p-6 text-center">
                    <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4 text-red-500">
                        <Smartphone className="w-8 h-8" />
                    </div>
                    <h2 className="text-xl font-bold mb-2">No Shorts Available</h2>
                    <p className="text-xs sm:text-sm text-zinc-400 max-w-sm mb-6">
                        Upload short vertical videos (under 60 seconds) to feature them here!
                    </p>
                    <Link
                        to="/publish"
                        className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-semibold shadow-lg shadow-red-600/30 transition no-underline"
                    >
                        Create Short
                    </Link>
                </div>
            ) : (
                shorts.map((video) => (
                    <div
                        key={video._id}
                        className="h-full w-full snap-start flex justify-center items-center relative"
                    >
                        <div
                            className="relative h-full w-full max-w-md bg-zinc-900 overflow-hidden shadow-2xl group"
                            data-id={video._id}
                        >
                            <video
                                ref={(el) => (videoRefs.current[video._id] = el)}
                                src={video.videoFile}
                                className="h-full w-full object-cover cursor-pointer"
                                loop
                                playsInline
                                muted={isMuted}
                                onClick={() => togglePlay(video._id)}
                            />

                            {/* Gradient Info Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white pointer-events-none">
                                <div className="flex items-center gap-3 mb-3 pointer-events-auto">
                                    <img
                                        src={video.owner?.avatar || "https://via.placeholder.com/40"}
                                        alt={video.owner?.username}
                                        className="w-10 h-10 rounded-full border-2 border-white/80 object-cover"
                                    />
                                    <span className="font-bold text-sm truncate max-w-[140px]">
                                        @{video.owner?.username}
                                    </span>
                                    <button className="flex items-center gap-1 bg-white text-zinc-950 text-xs px-3 py-1.5 rounded-full font-bold hover:bg-zinc-200 transition">
                                        <UserPlus className="w-3.5 h-3.5" />
                                        <span>Subscribe</span>
                                    </button>
                                </div>
                                <h3 className="text-sm font-bold line-clamp-2 mb-1 leading-snug">
                                    {video.title}
                                </h3>
                                <p className="text-xs text-zinc-300 line-clamp-1">
                                    {video.description}
                                </p>
                            </div>

                            {/* Global Mute Toggle */}
                            <button
                                onClick={toggleMute}
                                className="absolute top-4 right-4 p-3 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-black/80 transition pointer-events-auto shadow-lg"
                                aria-label="Toggle Sound"
                            >
                                {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-white" />}
                            </button>

                            {/* Side Quick Actions Bar */}
                            <div className="absolute bottom-20 right-3 flex flex-col gap-5 items-center text-white pointer-events-auto z-10">
                                <button
                                    onClick={() => handleLike(video._id)}
                                    className="flex flex-col items-center gap-1 group/btn"
                                >
                                    <div
                                        className={`p-3 rounded-full backdrop-blur-md transition-all ${
                                            video.isLiked
                                                ? 'bg-red-600 text-white shadow-lg shadow-red-600/50'
                                                : 'bg-black/60 group-hover/btn:bg-zinc-800 text-zinc-200'
                                        }`}
                                    >
                                        <ThumbsUp className={`w-5 h-5 ${video.isLiked ? 'fill-white' : ''}`} />
                                    </div>
                                    <span className="text-[11px] font-bold">
                                        {video.likesCount || 0}
                                    </span>
                                </button>

                                <button
                                    onClick={() => setActiveCommentVideoId(video._id)}
                                    className="flex flex-col items-center gap-1 group/btn"
                                >
                                    <div className="p-3 bg-black/60 backdrop-blur-md rounded-full group-hover/btn:bg-zinc-800 transition text-zinc-200">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-bold">Comments</span>
                                </button>

                                <button
                                    onClick={() => {
                                        navigator.clipboard.writeText(window.location.href);
                                        alert("Short link copied!");
                                    }}
                                    className="flex flex-col items-center gap-1 group/btn"
                                >
                                    <div className="p-3 bg-black/60 backdrop-blur-md rounded-full group-hover/btn:bg-zinc-800 transition text-zinc-200">
                                        <Share2 className="w-5 h-5" />
                                    </div>
                                    <span className="text-[11px] font-bold">Share</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {/* Comments Overlay Drawer */}
            {activeCommentVideoId && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
                    <div className="w-full max-w-md bg-zinc-900 h-full p-4 overflow-y-auto relative animate-fade-in border-l border-zinc-800">
                        <button
                            onClick={() => setActiveCommentVideoId(null)}
                            className="absolute top-4 right-4 text-zinc-400 hover:text-white p-2 rounded-full hover:bg-zinc-800 transition"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg font-bold text-white mb-4">Comments</h2>
                        <CommentList videoId={activeCommentVideoId} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Shorts;

