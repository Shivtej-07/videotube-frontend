import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import VideoCard from '../components/VideoCard';

function Trending() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                // Fetch videos sorted by views descending
                const res = await api.get('/videos?sortBy=views&sortType=desc&limit=20');
                setVideos(res.data.data.videos);
            } catch (err) {
                console.error("Failed to fetch trending videos", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    if (loading) return <div className="p-8 text-center text-white">Loading trending...</div>;

    return (
        <div className="p-4 md:p-8">
            <div className="mb-6 flex items-center">
                <span className="text-3xl mr-4">🔥</span>
                <h1 className="text-2xl font-bold text-white">Trending Now</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {videos.map((video) => (
                    <VideoCard key={video._id} video={video} />
                ))}
            </div>
        </div>
    );
}

export default Trending;
