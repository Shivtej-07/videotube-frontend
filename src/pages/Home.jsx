import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import VideoCard from '../components/VideoCard';

function Home() {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('All');
    const categoriesRef = useRef(null);

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

    // Handle horizontal scroll for categories on mobile
    useEffect(() => {
        if (categoriesRef.current) {
            const scrollContainer = categoriesRef.current;

            const handleWheel = (e) => {
                if (window.innerWidth <= 768) { // Only on mobile
                    e.preventDefault();
                    scrollContainer.scrollLeft += e.deltaY;
                }
            };

            scrollContainer.addEventListener('wheel', handleWheel, { passive: false });

            return () => {
                scrollContainer.removeEventListener('wheel', handleWheel);
            };
        }
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );

    if (error) return (
        <div className="text-center mt-8 px-4">
            <div className="text-red-500 text-lg mb-4">{error}</div>
            <button
                onClick={() => window.location.reload()}
                className="w-full max-w-xs px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors active:scale-95"
            >
                Retry
            </button>
        </div>
    );

    return (

        <div className="sm:px-4 lg:px-6 pb-20 sm:pb-6">
            {/* Mobile Header */}
            <div className="sticky top-0 z-10 bg-black/95 backdrop-blur-sm pt-3 pb-2 mb-4 px-3 sm:px-0">
                <div className="flex justify-between items-center mb-3">
                    <h1 className="text-xl font-bold">VideoStream</h1>
                    <Link
                        to="/publish"
                        className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors active:scale-95"
                    >
                        Upload
                    </Link>
                </div>

                {/* Categories Filter - Mobile Optimized */}
                <div className="relative">
                    <div
                        ref={categoriesRef}
                        className="flex gap-2 pb-3 overflow-x-auto scrollbar-hide scroll-smooth"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 active:scale-95 ${selectedCategory === category
                                    ? 'bg-white text-black'
                                    : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Videos Grid - Mobile Optimized (No px-3 on mobile container to allow edge-to-edge) */}
            {videos.length === 0 ? (
                <div className="text-center py-16 px-4">
                    <div className="text-6xl mb-6">📹</div>
                    <h3 className="text-lg font-semibold mb-3">No videos found</h3>
                    <p className="text-gray-400 mb-6">Be the first to upload a video!</p>
                    <Link
                        to="/publish"
                        className="inline-block w-full max-w-xs px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors active:scale-95"
                    >
                        Upload Video
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-y-4 sm:gap-4 md:gap-6">
                    {videos.map(video => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}

            {/* Load More Button */}
            {videos.length > 0 && (
                <div className="text-center mt-10 px-4">
                    <button
                        className="w-full max-w-xs px-6 py-3.5 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors active:scale-95"
                        onClick={() => console.log('Load more videos')}
                    >
                        Load More Videos
                    </button>
                </div>
            )}



            {/* Add custom scrollbar hide for mobile */}

        </div>
    );
}

export default Home;