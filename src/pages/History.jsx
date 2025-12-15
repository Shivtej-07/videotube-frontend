import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function History() {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

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

    const formatViewCount = (views) => {
        if (views >= 1000000) {
            return (views / 1000000).toFixed(1) + 'M';
        }
        if (views >= 1000) {
            return (views / 1000).toFixed(1) + 'K';
        }
        return views.toString();
    };

    const formatWatchDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return "Today";
        if (diffDays === 1) return "Yesterday";
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const handleClearHistory = async () => {
        try {
            await api.delete('/users/history/clear');
            setVideos([]);
            setShowClearConfirm(false);
        } catch (err) {
            console.error("Failed to clear history:", err);
            alert("Failed to clear history");
        }
    };

    const handleRemoveFromHistory = async (videoId) => {
        try {
            await api.delete(`/users/history/${videoId}`);
            setVideos(videos.filter(video => video._id !== videoId));
        } catch (err) {
            console.error("Failed to remove from history:", err);
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );

    if (error) return (
        <div className="text-center mt-8">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="p-4 lg:p-6 max-w-screen-2xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold mb-2">Watch History</h1>
                    <p className="text-gray-400">
                        {videos.length === 0
                            ? "No videos watched yet"
                            : `${videos.length} video${videos.length !== 1 ? 's' : ''} watched`
                        }
                    </p>
                </div>

                {videos.length > 0 && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowClearConfirm(true)}
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                        >
                            Clear all watch history
                        </button>
                    </div>
                )}
            </div>

            {/* Confirmation Modal */}
            {showClearConfirm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full border border-gray-800">
                        <h3 className="text-xl font-semibold mb-3">Clear all watch history?</h3>
                        <p className="text-gray-400 mb-6">
                            This will remove all videos from your watch history. This action cannot be undone.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClearHistory}
                                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                Clear all
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {videos.length === 0 ? (
                <div className="text-center py-16 rounded-xl bg-gray-900 border border-gray-800">
                    <div className="text-6xl mb-4">⏳</div>
                    <h3 className="text-xl font-semibold mb-2">No watch history found</h3>
                    <p className="text-gray-400 mb-6">Videos you watch will appear here</p>
                    <Link
                        to="/"
                        className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Explore Videos
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Group videos by watch date */}
                    {(() => {
                        const groupedVideos = {};
                        videos.forEach(video => {
                            const dateKey = formatWatchDate(video.createdAt);
                            if (!groupedVideos[dateKey]) {
                                groupedVideos[dateKey] = [];
                            }
                            groupedVideos[dateKey].push(video);
                        });

                        return Object.entries(groupedVideos).map(([date, dateVideos]) => (
                            <div key={date} className="mb-8">
                                <h2 className="text-lg font-semibold mb-4 pb-2 border-b border-gray-800">
                                    {date}
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {dateVideos.map(video => (
                                        <div key={video._id} className="group relative">
                                            <Link
                                                to={`/video/${video._id}`}
                                                className="block no-underline"
                                            >
                                                <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-800 mb-3">
                                                    <img
                                                        src={video.thumbnail}
                                                        alt={video.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                    />
                                                    <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-1.5 py-1 rounded">
                                                        {formatDuration(video.duration)}
                                                    </span>
                                                </div>

                                                <div className="flex gap-3">
                                                    <div className="flex-shrink-0">
                                                        {video.owner?.avatar ? (
                                                            <img
                                                                src={video.owner.avatar}
                                                                alt={video.owner.username}
                                                                className="w-9 h-9 rounded-full object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                                                {video.owner?.username?.[0]?.toUpperCase() || 'C'}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2 mb-1">
                                                            {video.title}
                                                        </h3>
                                                        <div className="text-sm text-gray-400 truncate">
                                                            {video.owner?.username || "Unknown Channel"}
                                                        </div>
                                                        <div className="text-sm text-gray-400">
                                                            {formatViewCount(video.views)} views
                                                        </div>
                                                    </div>
                                                </div>
                                            </Link>

                                            {/* Remove button */}
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleRemoveFromHistory(video._id);
                                                }}
                                                className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                aria-label="Remove from history"
                                            >
                                                <span className="text-white">✕</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ));
                    })()}
                </div>
            )}

            {/* Additional History Options */}
            {videos.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-800">
                    <div className="flex flex-wrap gap-4">
                        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
                            Pause watch history
                        </button>
                        <Link
                            to="/playlists"
                            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors no-underline"
                        >
                            Manage watch history
                        </Link>
                        <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors">
                            Download watch history
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default History;