import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import VideoCard from '../components/VideoCard';

function Home() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Trending', 'Music', 'Gaming', 'Technology', 'Education', 'Entertainment'];

    useEffect(() => {
        const fetchVideos = async () => {
            try {
                const response = await api.get('/videos');
                console.log("Videos response:", response);
                setVideos(response.data.data?.videos || []);
            } catch (err) {
                console.error("Failed to fetch videos:", err);
                setError("Could not load videos. Backend might be down.");
            } finally {
                setLoading(false);
            }
        };

        fetchVideos();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );

    if (error) return (
        <div className="text-center mt-8">
            <div className="text-red-500 text-lg">{error}</div>
            <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
            >
                Retry
            </button>
        </div>
    );

    return (
        <div className="p-4 lg:p-6">
            {/* Categories Filter */}
            <div className="mb-6 overflow-x-auto">
                <div className="flex gap-2 pb-2">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === category
                                ? 'bg-gray-700 text-white'
                                : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            {/* Videos Grid */}
            {videos.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-5xl mb-4">📹</div>
                    <h3 className="text-xl font-semibold mb-2">No videos found</h3>
                    <p className="text-gray-400">Be the first to upload a video!</p>
                    <Link
                        to="/publish"
                        className="inline-block mt-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Upload Video
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {videos.map(video => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}

            {/* Load More Button */}
            {videos.length > 0 && (
                <div className="text-center mt-10">
                    <button
                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                        onClick={() => console.log('Load more videos')}
                    >
                        Load More Videos
                    </button>
                </div>
            )}
        </div>
    );
}

export default Home;