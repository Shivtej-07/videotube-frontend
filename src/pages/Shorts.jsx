import React, { useEffect, useState, useRef } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CommentList from '../components/CommentList';

function Shorts() {
    const [shorts, setShorts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const containerRef = useRef(null);
    const videoRefs = useRef({});

    const [activeCommentVideoId, setActiveCommentVideoId] = useState(null);
    const { user } = useAuth(); // Assuming useAuth is available for checking login status

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
        if (!user) return alert("Please login to like");

        try {
            const response = await api.post(`/likes/toggle/v/${videoId}`);
            const isLiked = response.data.data.isLiked;

            setShorts(prevShorts => prevShorts.map(video => {
                if (video._id === videoId) {
                    return {
                        ...video,
                        isLiked: isLiked,
                        likesCount: isLiked ? (video.likesCount || 0) + 1 : (video.likesCount || 0) - 1
                    };
                }
                return video;
            }));
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
                        videoElement.play().catch(err => console.log("Auto-play prevented:", err));
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

    if (loading) return (
        <div className="flex justify-center items-center h-screen bg-black">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );

    if (error) return (
        <div className="flex justify-center items-center h-screen bg-black text-white">
            <div className="text-center">
                <p className="text-xl mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-red-600 rounded">Retry</button>
            </div>
        </div>
    );

    return (
        <div
            ref={containerRef}
            className="h-[calc(100vh-64px)] overflow-y-scroll snap-y snap-mandatory bg-black scroll-smooth"
        >
            {shorts.length === 0 ? (
                <div className="flex flex-col justify-center items-center h-full text-white">
                    <div className="text-6xl mb-4">📱</div>
                    <h2 className="text-2xl font-bold mb-2">No Shorts Found</h2>
                    <p className="text-gray-400">Upload a video under 60 seconds to see it here!</p>
                    <Link to="/publish" className="mt-6 px-6 py-3 bg-red-600 rounded-full font-semibold hover:bg-red-700 transition">
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
                            className="relative h-full w-full max-w-md bg-gray-900 group"
                            data-id={video._id}
                        >
                            <video
                                ref={(el) => (videoRefs.current[video._id] = el)}
                                src={video.videoFile}
                                className="h-full w-full object-cover cursor-pointer"
                                loop
                                playsInline
                                muted
                                onClick={() => togglePlay(video._id)}
                            />

                            {/* Overlay Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent text-white pointer-events-none">
                                <div className="flex items-center gap-3 mb-3 pointer-events-auto">
                                    <img
                                        src={video.owner?.avatar}
                                        alt={video.owner?.username}
                                        className="w-10 h-10 rounded-full border-2 border-white"
                                    />
                                    <span className="font-bold">@{video.owner?.username}</span>
                                    <button className="bg-white text-black text-xs px-3 py-1 rounded-full font-bold hover:bg-gray-200 transition">
                                        Subscribe
                                    </button>
                                </div>
                                <h3 className="text-lg font-semibold line-clamp-2 mb-2">{video.title}</h3>
                                <p className="text-sm text-gray-300 line-clamp-1">{video.description}</p>
                            </div>

                            {/* Mute Toggle */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const videoEl = videoRefs.current[video._id];
                                    if (videoEl) {
                                        videoEl.muted = !videoEl.muted;
                                        e.currentTarget.textContent = videoEl.muted ? '🔇' : '🔊';
                                    }
                                }}
                                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition pointer-events-auto"
                            >
                                🔇
                            </button>

                            {/* Side Actions */}
                            <div className="absolute bottom-20 right-2 flex flex-col gap-6 items-center text-white pointer-events-auto">
                                <button
                                    onClick={() => handleLike(video._id)}
                                    className="flex flex-col items-center gap-1 group/btn"
                                >
                                    <div className={`p-3 rounded-full transition ${video.isLiked ? 'bg-red-600' : 'bg-gray-800/60 group-hover/btn:bg-gray-700/60'}`}>
                                        👍
                                    </div>
                                    <span className="text-xs font-bold">{video.likesCount || 0}</span>
                                </button>
                                <button
                                    onClick={() => setActiveCommentVideoId(video._id)}
                                    className="flex flex-col items-center gap-1 group/btn"
                                >
                                    <div className="p-3 bg-gray-800/60 rounded-full group-hover/btn:bg-gray-700/60 transition">
                                        💬
                                    </div>
                                    <span className="text-xs font-bold">Comment</span>
                                </button>
                                <button className="flex flex-col items-center gap-1 group/btn">
                                    <div className="p-3 bg-gray-800/60 rounded-full group-hover/btn:bg-gray-700/60 transition">
                                        ↗️
                                    </div>
                                    <span className="text-xs font-bold">Share</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}

            {/* Comments Modal / Overlay */}
            {activeCommentVideoId && (
                <div className="fixed inset-0 z-50 bg-black/80 flex justify-end">
                    <div className="w-full max-w-md bg-gray-900 h-full p-4 overflow-y-auto relative animate-in slide-in-from-right duration-300">
                        <button
                            onClick={() => setActiveCommentVideoId(null)}
                            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold text-white mb-4">Comments</h2>
                        <CommentList videoId={activeCommentVideoId} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default Shorts;
