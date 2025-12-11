import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Subscriptions() {
    const [subscribedChannels, setSubscribedChannels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchSubscriptions = async () => {
            if (!user?._id) return;

            try {
                const response = await api.get(`/subscriptions/u/${user._id}`);
                setSubscribedChannels(response.data.data || []);
            } catch (err) {
                console.error("Failed to fetch subscriptions:", err);
                setError("Could not load subscriptions.");
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, [user]);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );

    if (error) return (
        <div className="text-center mt-8">
            <div className="text-red-500 text-lg">{error}</div>
        </div>
    );

    return (
        <div className="p-4 lg:p-6">
            <h1 className="text-2xl font-bold mb-6 text-white">Subscriptions</h1>

            {subscribedChannels.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-5xl mb-4">📺</div>
                    <h3 className="text-xl font-semibold mb-2">No subscriptions yet</h3>
                    <p className="text-gray-400">Subscribe to channels to see them here!</p>
                    <Link
                        to="/"
                        className="inline-block mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Explore Videos
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {subscribedChannels.map(({ channel }) => (
                        <Link
                            key={channel._id}
                            to={`/c/${channel.username}`}
                            className="block bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={channel.avatar}
                                    alt={channel.username}
                                    className="w-16 h-16 rounded-full object-cover"
                                />
                                <div>
                                    <h3 className="font-semibold text-white">{channel.fullName}</h3>
                                    <p className="text-gray-400 text-sm">@{channel.username}</p>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Subscriptions;
