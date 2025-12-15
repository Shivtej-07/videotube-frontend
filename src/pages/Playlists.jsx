import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function Playlists() {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [newPlaylistName, setNewPlaylistName] = useState('');
    const [newPlaylistDesc, setNewPlaylistDesc] = useState('');

    useEffect(() => {
        const fetchPlaylists = async () => {
            if (!user?._id) return;
            try {
                const response = await api.get(`/playlists/user/${user._id}`);
                setPlaylists(response.data.data || []);
            } catch (err) {
                console.error("Failed to fetch playlists:", err);
                setError("Failed to load playlists.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylists();
    }, [user]);

    const handleCreatePlaylist = async (e) => {
        e.preventDefault();
        if (!newPlaylistName.trim() || !newPlaylistDesc.trim()) return;

        try {
            const response = await api.post('/playlists', {
                name: newPlaylistName,
                description: newPlaylistDesc
            });
            setPlaylists([...playlists, response.data.data]);
            setShowCreateModal(false);
            setNewPlaylistName('');
            setNewPlaylistDesc('');
        } catch (err) {
            console.error("Failed to create playlist:", err);
            alert("Failed to create playlist");
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
        </div>
    );

    return (
        <div className="p-4 lg:p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">My Playlists</h2>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
                >
                    + Create Playlist
                </button>
            </div>

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {playlists.length === 0 ? (
                <div className="text-center py-16">
                    <div className="text-5xl mb-4">📂</div>
                    <h3 className="text-xl font-semibold mb-2">No playlists found</h3>
                    <p className="text-gray-400">Create your first playlist to organize your videos.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {playlists.map(playlist => (
                        <Link
                            to={`/playlist/${playlist._id}`}
                            key={playlist._id}
                            className="group block no-underline bg-gray-800 rounded-xl overflow-hidden hover:bg-gray-700 transition-colors"
                        >
                            <div className="aspect-video bg-gray-900 flex items-center justify-center text-gray-500 text-4xl">
                                📺
                            </div>
                            <div className="p-4">
                                <h3 className="font-semibold text-white group-hover:text-red-400 transition-colors truncate">
                                    {playlist.name}
                                </h3>
                                <p className="text-sm text-gray-400 line-clamp-2 mt-1">
                                    {playlist.description}
                                </p>
                                <p className="text-xs text-gray-500 mt-2">
                                    {playlist.videos?.length || 0} videos
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Create Playlist Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-md">
                        <h3 className="text-xl font-bold text-white mb-4">Create New Playlist</h3>
                        <form onSubmit={handleCreatePlaylist}>
                            <div className="mb-4">
                                <label className="block text-gray-400 text-sm mb-2">Name</label>
                                <input
                                    type="text"
                                    value={newPlaylistName}
                                    onChange={(e) => setNewPlaylistName(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                                    placeholder="Enter playlist name"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-gray-400 text-sm mb-2">Description</label>
                                <textarea
                                    value={newPlaylistDesc}
                                    onChange={(e) => setNewPlaylistDesc(e.target.value)}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 h-24 resize-none"
                                    placeholder="Enter playlist description"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Playlists;
