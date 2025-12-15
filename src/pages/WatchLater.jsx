import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../context/AuthContext';

function WatchLater() {
    const { user } = useAuth();
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [playlistId, setPlaylistId] = useState(null);

    useEffect(() => {
        const fetchWatchLater = async () => {
            if (!user) return;
            try {
                // First get all playlists
                const playlistsRes = await api.get(`/playlists/user/${user._id}`);
                const playlists = playlistsRes.data.data;
                const wl = playlists.find(p => p.name === "Watch Later");

                if (wl) {
                    setPlaylistId(wl._id);
                    // Fetch playlist details to get videos
                    const detailRes = await api.get(`/playlists/${wl._id}`);
                    setVideos(detailRes.data.data.videos || []);
                } else {
                    // Automatically create "Watch Later" if not exists
                    try {
                        const createRes = await api.post('/playlists', {
                            name: "Watch Later",
                            description: "Your watch later list"
                        });
                        setPlaylistId(createRes.data.data._id);
                    } catch (createErr) {
                        console.error("Failed to create Watch Later playlist", createErr);
                    }
                }
            } catch (err) {
                console.error("Failed to load Watch Later", err);
            } finally {
                setLoading(false);
            }
        };

        fetchWatchLater();
    }, [user]);

    if (!user) return <div className="p-8 text-center text-white">Please log in.</div>;
    if (loading) return <div className="p-8 text-center text-white">Loading Watch Later...</div>;

    return (
        <div className="p-4 md:p-8">
            <div className="mb-6 flex items-center">
                <span className="text-3xl mr-4">⏱️</span>
                <h1 className="text-2xl font-bold text-white">Watch Later</h1>
            </div>

            {videos.length === 0 ? (
                <div className="text-center text-gray-400 mt-10">
                    <p>No videos in Watch Later.</p>
                    <p className="text-sm">Save videos here to watch them when you have time.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {videos.map(video => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default WatchLater;
