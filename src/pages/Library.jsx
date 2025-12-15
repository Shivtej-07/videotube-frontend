import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Library() {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [liked, setLiked] = useState([]);
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLibraryData = async () => {
            // If no user, we might show empty or login prompt, but assuming auth for library
            if (!user) return;

            try {
                const [historyRes, likedRes, playlistsRes] = await Promise.all([
                    api.get('/users/history'),
                    api.get('/likes/videos'), // Assuming this endpoint exists based on routes
                    api.get(`/playlists/user/${user._id}`)
                ]);

                setHistory(historyRes.data.data.slice(0, 5) || []); // Top 5
                setLiked(likedRes.data.data.slice(0, 5) || []);     // Top 5
                setPlaylists(playlistsRes.data.data.slice(0, 5) || []); // Top 5

            } catch (err) {
                console.error("Library fetch error", err);
            } finally {
                setLoading(false);
            }
        };
        fetchLibraryData();
    }, [user]);

    if (!user) return <div className="p-8 text-center text-white">Please log in to view your library.</div>;
    if (loading) return <div className="p-8 text-center text-white">Loading library...</div>;

    const Section = ({ title, items, link, type = "video" }) => (
        <div className="mb-10">
            <div className="flex justify-between items-center mb-4 border-b border-gray-800 pb-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">{title}</h2>
                <Link to={link} className="text-blue-400 hover:text-blue-300 text-sm">See all</Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {items.length > 0 ? items.map(item => {
                    // Normalize data structure handling
                    const key = item._id;
                    const img = type === 'playlist' ? 'https://via.placeholder.com/300x200?text=Playlist' : (item.thumbnail || (item.video ? item.video.thumbnail : ''));
                    const titleText = item.name || item.title || (item.video ? item.video.title : 'Content');
                    const linkTo = type === 'playlist' ? `/playlist/${item._id}` : `/video/${item._id || (item.video ? item.video._id : '')}`;

                    // For liked videos, the structure might be { likedBy, video: {...} } or simply video list
                    // Adjust based on typical backend response

                    return (
                        <Link key={key} to={linkTo} className="group">
                            <div className="aspect-video bg-gray-800 rounded-lg overflow-hidden mb-2 border border-gray-700">
                                <img src={img} alt={titleText} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                            </div>
                            <h3 className="text-sm font-medium text-white truncate">{titleText}</h3>
                            {type !== 'playlist' && <p className="text-xs text-gray-400 mt-1">{item.date ? new Date(item.date).toLocaleDateString() : ''}</p>}
                        </Link>
                    )
                }) : (
                    <p className="text-gray-500 text-sm col-span-full">No content found.</p>
                )}
            </div>
        </div>
    );

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            <div className="mb-6 flex items-center">
                <span className="text-3xl mr-4">📚</span>
                <h1 className="text-2xl font-bold text-white">Your Library</h1>
            </div>

            <Section title="⏳ Recent History" items={history} link="/history" />
            <Section title="👍 Liked Videos" items={liked.map(l => l.video)} link="/liked" />
            <Section title="📂 Your Playlists" items={playlists} link="/playlists" type="playlist" />
        </div>
    );
}

export default Library;
