import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/axios';
import VideoCard from '../components/VideoCard';

function Search() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q');
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!query) return;

            setLoading(true);
            setError(null);
            try {
                const response = await api.get(`/videos?query=${encodeURIComponent(query)}`);
                setVideos(response.data.data?.videos || []);
            } catch (err) {
                console.error("Failed to search videos:", err);
                setError("Failed to load search results.");
            } finally {
                setLoading(false);
            }
        };

        fetchSearchResults();
    }, [query]);

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
            <h2 className="text-2xl font-bold text-white mb-6">
                Search Results for "{query}"
            </h2>

            {videos.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-5xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">No videos found</h3>
                    <p className="text-gray-400">Try different keywords</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {videos.map(video => (
                        <VideoCard key={video._id} video={video} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default Search;
