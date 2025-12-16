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

            {/* Mobile Bottom Navigation - YouTube Style */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800/50 py-1 flex justify-around items-center sm:hidden z-20 h-12">
                <Link to="/" className="flex flex-col items-center justify-center w-full h-full text-white">
                    <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                    <span className="text-[10px]">Home</span>
                </Link>
                <Link to="/explore" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-white">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="text-[10px]">Shorts</span>
                </Link>
                <Link to="/publish" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-white">
                    <div className="w-9 h-9 rounded-full border border-gray-500 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                </Link>
                <Link to="/subscriptions" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-white">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                    <span className="text-[10px]">Subs</span>
                </Link>
                <Link to="/library" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-white">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                    <span className="text-[10px]">You</span>
                </Link>
            </div>

            {/* Add custom scrollbar hide for mobile */}

        </div>
    );
}

export default Home;