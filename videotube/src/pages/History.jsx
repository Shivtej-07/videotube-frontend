import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

function History() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await api.get('/users/history');
                console.log("History response:", response);
                setVideos(response.data.data || []);
            } catch (err) {
                console.error("Failed to fetch history:", err);
                setError("Could not load history.");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, []);

    const formatDuration = (seconds) => {
        if (!seconds) return "0:00";
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const formatTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const seconds = Math.floor((now - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " years ago";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " months ago";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        return "Just now";
    };

    if (loading) return <div className="text-center mt-8">Loading history...</div>;
    if (error) return <div className="text-center status error mt-8">{error}</div>;

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Watch History</h1>

            {videos.length === 0 ? (
                <p className="text-center text-gray-400">No watch history found.</p>
            ) : (
                <div className="video-grid">
                    {videos.map(video => (
                        <Link to={`/video/${video._id}`} key={video._id} className="video-card" style={{ textDecoration: 'none' }}>
                            <div className="thumbnail-container">
                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="thumbnail-img"
                                />
                                <span className="duration-badge">{formatDuration(video.duration)}</span>
                            </div>
                            <div className="video-info">
                                <div className="channel-avatar">
                                    {video.owner?.avatar ? (
                                        <img src={video.owner.avatar} alt="avatar" />
                                    ) : (
                                        <div className="avatar-placeholder" />
                                    )}
                                </div>
                                <div className="video-details">
                                    <h3 className="video-title">{video.title}</h3>
                                    <p className="channel-name">{video.owner?.username || "Unknown Channel"}</p>
                                    <p className="video-meta">
                                        {video.views} views • {formatTimeAgo(video.createdAt)}
                                    </p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            <style>{`
                .video-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 16px;
                    row-gap: 32px;
                }
                
                .video-card {
                    cursor: pointer;
                }
                
                .thumbnail-container {
                    position: relative;
                    aspect-ratio: 16/9;
                    border-radius: 12px;
                    overflow: hidden;
                    background-color: #202020;
                    margin-bottom: 12px;
                }
                .thumbnail-img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    transition: transform 0.2s;
                }
                .video-card:hover .thumbnail-img {
                    border-radius: 0; 
                }
                
                .duration-badge {
                    position: absolute;
                    bottom: 8px;
                    right: 8px;
                    background-color: rgba(0, 0, 0, 0.8);
                    color: white;
                    padding: 3px 6px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 500;
                }
                
                .video-info {
                    display: flex;
                    gap: 12px;
                    align-items: flex-start;
                }
                
                .channel-avatar img, .avatar-placeholder {
                    width: 36px;
                    height: 36px;
                    border-radius: 50%;
                    background-color: #555;
                    object-fit: cover;
                }
                
                .video-details {
                    flex: 1;
                }
                
                .video-title {
                    margin: 0 0 4px 0;
                    font-size: 1rem;
                    line-height: 1.4rem;
                    font-weight: 600;
                    color: var(--text-main);
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                
                .channel-name, .video-meta {
                    color: var(--text-secondary);
                    font-size: 0.9rem;
                    margin: 0;
                    line-height: 1.2rem;
                }
                .channel-name {
                    margin-bottom: 2px;
                }
                .channel-name:hover {
                    color: var(--text-main);
                }
            `}</style>
        </div>
    );
}

export default History;
