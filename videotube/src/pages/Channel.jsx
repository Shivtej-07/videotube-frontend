import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import VideoCard from '../components/VideoCard';

function Channel() {
    const { username } = useParams();
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();

    // If accessing /your-channel (no username param), use current user's username
    const targetUsername = username || currentUser?.username;

    const [channel, setChannel] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [subscribing, setSubscribing] = useState(false);
    const [activeTab, setActiveTab] = useState('videos');

    useEffect(() => {
        if (!targetUsername) {
            if (!currentUser) navigate('/login');
            return;
        }

        const fetchChannelData = async () => {
            try {
                // Get Channel Profile
                const profileRes = await api.get(`/users/c/${targetUsername}`);
                setChannel(profileRes.data.data);

                // Get Channel Videos (Assuming an endpoint exists or using general video search by userId)
                // Since we don't have a direct "get videos by username" easily without userId, 
                // we'll rely on the userId from the profile response.
                const userId = profileRes.data.data._id;
                const videosRes = await api.get(`/videos?userId=${userId}&limit=50`); // Adjust limit as needed
                setVideos(videosRes.data.data.videos);

            } catch (err) {
                console.error("Failed to fetch channel", err);
            } finally {
                setLoading(false);
            }
        };

        fetchChannelData();
    }, [targetUsername, currentUser, navigate]);

    const handleSubscribe = async () => {
        if (!currentUser) return navigate('/login');
        if (subscribing || !channel) return;

        setSubscribing(true);
        try {
            await api.post(`/subscriptions/c/${channel._id}`);
            setChannel(prev => ({
                ...prev,
                isSubscribed: !prev.isSubscribed,
                subscribersCount: prev.isSubscribed ? prev.subscribersCount - 1 : prev.subscribersCount + 1
            }));
        } catch (err) {
            console.error("Subscription failed", err);
        } finally {
            setSubscribing(false);
        }
    };

    if (loading) return <div className="text-center p-10 text-white">Loading Channel...</div>;
    if (!channel) return <div className="text-center p-10 text-white">Channel not found</div>;

    return (
        <div className="w-full">
            {/* Cover Image */}
            <div className="h-40 md:h-64 w-full bg-gray-800 overflow-hidden relative">
                {channel.coverImage ? (
                    <img src={channel.coverImage} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">No Cover Image</div>
                )}
            </div>

            {/* Channel Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                    <img
                        src={channel.avatar}
                        alt={channel.username}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-[#121212] -mt-16 md:-mt-20 z-10 bg-gray-800"
                    />

                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-bold text-white mb-1">{channel.fullName}</h1>
                        <p className="text-gray-400 mb-2">@{channel.username} • {channel.subscribersCount} subscribers</p>

                        <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                            {currentUser?._id !== channel._id ? (
                                <button
                                    onClick={handleSubscribe}
                                    className={`px-6 py-2 rounded-full font-medium transition-colors ${channel.isSubscribed
                                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                                            : 'bg-white text-black hover:bg-gray-200'
                                        }`}
                                    disabled={subscribing}
                                >
                                    {channel.isSubscribed ? 'Subscribed' : 'Subscribe'}
                                </button>
                            ) : (
                                <button
                                    onClick={() => navigate('/settings')}
                                    className="px-6 py-2 rounded-full font-medium bg-gray-700 text-white hover:bg-gray-600"
                                >
                                    Customize Channel
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-800 mt-8 mb-6 overflow-x-auto">
                    {['Videos', 'Playlists', 'About'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab.toLowerCase())}
                            className={`px-6 py-3 font-medium text-sm whitespace-nowrap border-b-2 transition-colors ${activeTab === tab.toLowerCase()
                                    ? 'border-white text-white'
                                    : 'border-transparent text-gray-400 hover:text-gray-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {activeTab === 'videos' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {videos.length > 0 ? (
                            videos.map(video => <VideoCard key={video._id} video={video} />)
                        ) : (
                            <div className="col-span-full text-center py-10 text-gray-500">No videos available</div>
                        )}
                    </div>
                )}

                {activeTab === 'playlists' && (
                    <div className="text-center py-10 text-gray-500">
                        Playlists coming soon...
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="bg-[#121212] p-6 rounded-lg border border-gray-800 max-w-2xl">
                        <h3 className="text-lg font-bold text-white mb-4">About</h3>
                        <p className="text-gray-300 mb-4">
                            {/* Assuming there exists a description or similar, if not fallback */}
                            Join Date: {new Date(channel.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-gray-300">
                            Email: {channel.email}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Channel;
