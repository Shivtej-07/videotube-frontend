import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import VideoCard from '../components/VideoCard';
import { Video, RotateCcw, Loader2, Sparkles } from 'lucide-react';

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

    const filteredVideos = selectedCategory === 'All'
        ? videos
        : videos.filter((v) =>
            v.title?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
            v.description?.toLowerCase().includes(selectedCategory.toLowerCase())
        );

    if (loading) return (
        <div className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
            <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
            <p className="text-sm font-medium text-zinc-400">Loading videos...</p>
        </div>
    );

    if (error) return (
        <div className="text-center mt-12 px-4">
            <div className="text-red-400 text-lg font-semibold mb-4">{error}</div>
            <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full text-sm font-semibold transition-all shadow-lg shadow-red-600/20 active:scale-95"
            >
                <RotateCcw className="w-4 h-4" />
                <span>Retry Connection</span>
            </button>
        </div>
    );

    return (
        <div className="pb-8">
            {/* Header / Category Chips */}
            <div className="sticky top-16 z-20 bg-zinc-950/90 backdrop-blur-md pt-2 pb-3 mb-6 border-b border-zinc-800/40">
                <div className="relative">
                    <div
                        ref={categoriesRef}
                        className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth py-1 px-1"
                    >
                        {categories.map((category) => {
                            const active = selectedCategory === category;
                            return (
                                <button
                                    key={category}
                                    onClick={() => setSelectedCategory(category)}
                                    className={`px-4 py-2 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap flex-shrink-0 transition-all duration-200 active:scale-95 ${
                                        active
                                            ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/30'
                                            : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800/80 hover:border-zinc-700'
                                    }`}
                                >
                                    {category}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Video Feed Grid */}
            {filteredVideos.length === 0 ? (
                <div className="text-center py-20 px-4 max-w-md mx-auto">
                    <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-red-500 shadow-xl">
                        <Video className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-100 mb-2">No videos found</h3>
                    <p className="text-xs sm:text-sm text-zinc-400 mb-6">
                        {selectedCategory !== 'All'
                            ? `No videos match category "${selectedCategory}".`
                            : "Be the first creator to upload a video on VideoTube!"}
                    </p>
                    <Link
                        to="/publish"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full text-sm font-semibold shadow-lg shadow-red-600/20 transition-all active:scale-95 no-underline"
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>Upload Video</span>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                    {filteredVideos.map((video) => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Home;