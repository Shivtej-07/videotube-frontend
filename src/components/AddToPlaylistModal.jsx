import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

function AddToPlaylistModal({ videoId, onClose }) {
    const { user } = useAuth();
    const [playlists, setPlaylists] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newPlaylistName, setNewPlaylistName] = useState('');

    useEffect(() => {
        const fetchPlaylists = async () => {
            if (!user?._id) return;
            try {
                const response = await api.get(`/playlists/user/${user._id}`);
                setPlaylists(response.data.data || []);
            } catch (err) {
                console.error("Failed to fetch playlists:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPlaylists();
    }, [user]);

    const handleAddToPlaylist = async (playlistId) => {
        try {
            await api.patch(`/playlists/add/${videoId}/${playlistId}`);
            alert("Added to playlist!");
            onClose();
        } catch (err) {
            console.error("Failed to add to playlist:", err);
            if (err.response?.status === 400 && err.response?.data?.message?.includes("already")) {
                alert("Video is already in this playlist");
            } else {
                alert("Failed to add to playlist");
            }
        }
    };

    const handleCreateAndAdd = async (e) => {
        e.preventDefault();
        if (!newPlaylistName.trim()) return;

        try {
            // 1. Create playlist
            const createRes = await api.post('/playlists', {
                name: newPlaylistName,
                description: "Created from video page"
            });
            const newPlaylist = createRes.data.data;

            // 2. Add video to it
            await api.patch(`/playlists/add/${videoId}/${newPlaylist._id}`);

            alert("Playlist created and video added!");
            onClose();
        } catch (err) {
            console.error("Failed to create/add:", err);
            alert("Failed to create playlist and add video");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Save to...</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                <div className="max-h-60 overflow-y-auto mb-4 space-y-2">
                    {loading ? (
                        <div className="text-center text-gray-400">Loading...</div>
                    ) : playlists.length === 0 ? (
                        <div className="text-center text-gray-400">No playlists found</div>
                    ) : (
                        playlists.map(playlist => (
                            <button
                                key={playlist._id}
                                onClick={() => handleAddToPlaylist(playlist._id)}
                                className="w-full text-left px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors flex justify-between items-center"
                            >
                                <span className="truncate">{playlist.name}</span>
                                {playlist.videos.includes(videoId) && <span className="text-xs text-green-400">Added</span>}
                            </button>
                        ))
                    )}
                </div>

                <div className="border-t border-gray-700 pt-4">
                    <form onSubmit={handleCreateAndAdd} className="flex gap-2">
                        <input
                            type="text"
                            value={newPlaylistName}
                            onChange={(e) => setNewPlaylistName(e.target.value)}
                            className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                            placeholder="Create new playlist..."
                            required
                        />
                        <button
                            type="submit"
                            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg text-xl"
                        >
                            +
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AddToPlaylistModal;
