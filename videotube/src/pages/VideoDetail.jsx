import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import '../index.css';

function VideoDetail() {
    const { videoId } = useParams();
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

    // Deterministic fallback ONLY for subscribers if backend fails/is missing
    // (Though now backend should return real subs count via separate call)
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
    }, [videoId, user]); // Refetch if user logs in/out to update isLiked status

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

    if (loading) return <div className="text-center" style={{ marginTop: '2rem' }}>Loading player...</div>;
    if (error) return <div className="text-center status error" style={{ marginTop: '2rem' }}>{error}</div>;
    if (!video) return <div className="text-center" style={{ marginTop: '2rem' }}>Video not found.</div>;

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 800px' }}>
                {/* Video Player */}
                <div className="video-player-wrapper">
                    <video
                        controls
                        autoPlay
                        style={{ width: '100%', height: '100%', borderRadius: '12px' }}
                        poster={video.thumbnail}
                    >
                        <source src={video.videoFile} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </div>

                {/* Video Info */}
                <div style={{ marginTop: '16px' }}>
                    <h1 style={{ fontSize: '1.4rem', fontWeight: '600', marginBottom: '8px' }}>{video.title}</h1>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <img
                                src={video.owner?.avatar || "https://via.placeholder.com/40"}
                                alt={video.owner?.username}
                                style={{ width: '40px', height: '40px', borderRadius: '50%' }}
                            />
                            <div>
                                <h3 style={{ fontSize: '1rem', fontWeight: '500', margin: 0 }}>{video.owner?.username}</h3>
                                <p style={{ fontSize: '0.8rem', color: '#aaa', margin: 0 }}>{formatCount(subscriberCount)} subscribers</p>
                            </div>

                            <button
                                className={`subscribe-btn ${isSubscribed ? 'subscribed' : ''}`}
                                onClick={handleSubscribe}
                            >
                                {isSubscribed ? 'Subscribed' : 'Subscribe'}
                            </button>
                        </div>

                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="action-btn" onClick={handleLike}>
                                {isLiked ? '❤️' : '👍'} {likeCount}
                            </button>
                            <button className="action-btn">👎</button>
                            <button className="action-btn" onClick={handleShare}>Share</button>
                        </div>
                    </div>

                    <div className="description-box">
                        <p style={{ fontWeight: '500', marginBottom: '8px' }}>{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</p>
                        <p>{video.description}</p>
                    </div>
                </div>
            </div>

            {/* Sidebar / Recommended (Placeholder) */}
            <div style={{ flex: '1 1 300px' }}>
                <h3>Up Next</h3>
                <p style={{ color: '#aaa' }}>Recommendations coming soon...</p>
            </div>

            <style>{`
                .video-player-wrapper {
                     width: 100%;
                     aspect-ratio: 16/9;
                     background-color: black;
                     border-radius: 12px;
                }
                .subscribe-btn {
                    background-color: white;
                    color: black;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 18px;
                    font-weight: 500;
                    cursor: pointer;
                    margin-left: 16px;
                    transition: background-color 0.2s;
                }
                .subscribe-btn:hover {
                    background-color: #d9d9d9;
                }
                .subscribe-btn.subscribed {
                    background-color: #303030;
                    color: #aaa;
                }
                .action-btn {
                    background-color: #272727;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 18px;
                    cursor: pointer;
                    font-size: 0.9rem;
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .action-btn:hover {
                    background-color: #3f3f3f;
                }
                .description-box {
                    background-color: #272727;
                    padding: 12px;
                    border-radius: 12px;
                    margin-top: 16px;
                    font-size: 0.95rem;
                    white-space: pre-wrap; /* Preserve newlines in description */
                }
            `}</style>
        </div>
    );
}

export default VideoDetail;
