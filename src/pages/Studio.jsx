import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Studio() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchStudioData = async () => {
            try {
                // Fetch stats and videos
                // Using dashboard endpoints verified in dashboard.controller.js
                const [statsRes, videosRes] = await Promise.all([
                    api.get('/dashboard/stats'),
                    api.get('/dashboard/videos')
                ]);

                setStats(statsRes.data.data);
                setVideos(videosRes.data.data);

            } catch (err) {
                console.error("Studio fetch failed", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStudioData();
    }, [user, navigate]);

    const handleDelete = async (videoId) => {
        if (!window.confirm("Delete this video permanently?")) return;
        try {
            await api.delete(`/videos/${videoId}`);
            setVideos(videos.filter(v => v._id !== videoId));
        } catch (err) {
            alert("Failed to delete video");
        }
    };

    const handleTogglePublish = async (videoId) => {
        try {
            const res = await api.patch(`/videos/toggle/publish/${videoId}`);
            const newStatus = res.data.data.isPublished;
            setVideos(videos.map(v => v._id === videoId ? { ...v, isPublished: newStatus } : v));
        } catch (err) {
            console.error("Failed to toggle publish status");
        }
    };

    if (loading) return <div className="text-center p-8 text-white">Loading Studio...</div>;

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-white">Channel Content</h1>
                <Link
                    to="/publish"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded font-medium transition-colors flex items-center gap-2"
                >
                    <span>➕</span> Create
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Total Subscribers</h3>
                    <p className="text-3xl font-bold text-white">{stats?.totalSubscribers}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Total Views</h3>
                    <p className="text-3xl font-bold text-white">{stats?.totalViews}</p>
                </div>
                <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
                    <h3 className="text-gray-400 text-sm font-medium mb-2">Total Likes</h3>
                    <p className="text-3xl font-bold text-white">{stats?.totalLikes}</p>
                </div>
            </div>

            {/* Video List */}
            <h2 className="text-xl font-bold text-white mb-4">Videos</h2>
            <div className="bg-[#121212] border border-gray-800 rounded-lg overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-[#1f1f1f] text-gray-300 text-sm uppercase">
                        <tr>
                            <th className="p-4 font-medium">Video</th>
                            <th className="p-4 font-medium">Visibility</th>
                            <th className="p-4 font-medium">Date</th>
                            <th className="p-4 font-medium">Views</th>
                            <th className="p-4 font-medium">Likes</th>
                            <th className="p-4 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {videos.map(video => (
                            <tr key={video._id} className="hover:bg-gray-900/50 transition-colors group">
                                <td className="p-4">
                                    <div className="flex gap-4">
                                        <div className="relative w-32 aspect-video bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                            <img src={video.thumbnail} alt="" className="w-full h-full object-cover" />
                                            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                                                {(video.duration / 60).toFixed(2)}
                                            </span>
                                        </div>
                                        <div>
                                            <Link to={`/video/${video._id}`} className="text-white font-medium hover:text-blue-400 line-clamp-2 mb-1">
                                                {video.title}
                                            </Link>
                                            <p className="text-xs text-gray-400 line-clamp-2">{video.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => handleTogglePublish(video._id)}
                                        className={`flex items-center gap-2 px-2 py-1 rounded text-xs font-medium border ${video.isPublished
                                                ? 'border-green-500/30 text-green-400 bg-green-500/10'
                                                : 'border-gray-600 text-gray-400 bg-gray-800'
                                            }`}
                                    >
                                        {video.isPublished ? 'Public' : 'Private'}
                                    </button>
                                </td>
                                <td className="p-4 text-gray-400 text-sm">
                                    {new Date(video.createdAt).toLocaleDateString()}
                                </td>
                                <td className="p-4 text-gray-300 text-sm">
                                    {video.views}
                                </td>
                                <td className="p-4 text-gray-300 text-sm">
                                    {/* Likes count not directly in video object from dashboard endpoint usually, 
                                        but checking controller it might be missing or aggregate needs adjust. 
                                        Assuming 0 or missing for now if not populated. */}
                                    {video.likesCount || '-'}
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Link
                                            to={`/video/edit/${video._id}`}
                                            className="p-2 text-gray-400 hover:text-white"
                                            title="Edit"
                                        >
                                            ✏️
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(video._id)}
                                            className="p-2 text-gray-400 hover:text-red-400"
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {videos.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                        You haven't uploaded any videos yet.
                    </div>
                )}
            </div>
        </div>
    );
}

export default Studio;
