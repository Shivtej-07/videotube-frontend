import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import VideoCard from '../components/VideoCard';

function PlaylistDetail() {
    const { playlistId } = useParams();
    const navigate = useNavigate();
    const [playlist, setPlaylist] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlaylist = async () => {
            try {
                const response = await api.get(`/playlists/${playlistId}`);
                setPlaylist(response.data.data);
            } catch (err) {
                console.error("Failed to fetch playlist:", err);
                setError("Failed to load playlist.");
            } finally {
                setLoading(false);
            }
        };

        fetchPlaylist();
    }, [playlistId]);

    const handleDeletePlaylist = async () => {
        if (!window.confirm("Are you sure you want to delete this playlist?")) return;

        try {
            await api.delete(`/playlists/${playlistId}`);
            navigate('/playlists');
        } catch (err) {
            console.error("Failed to delete playlist:", err);
            alert("Failed to delete playlist");
        }
    };

    const handleRemoveVideo = async (videoId) => {
        if (!window.confirm("Remove video from playlist?")) return;

        try {
            await api.patch(`/playlists/remove/${videoId}/${playlistId}`);
            // Update local state
            setPlaylist(prev => ({
                ...prev,
                videos: prev.videos.filter(v => v._id !== videoId)
            }));
        } catch (err) {
            console.error("Failed to remove video:", err);
            alert("Failed to remove video");
        }
    };

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

    if (!playlist) return null;

    return (
        <div className="p-4 lg:p-6">
            <div className="bg-gray-800 rounded-xl p-6 mb-8">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">{playlist.name}</h1>
                        <p className="text-gray-400 text-lg">{playlist.description}</p>
                        <p className="text-sm text-gray-500 mt-2">
                            {playlist.videos?.length || 0} videos • Created by {playlist.owner?.username || 'You'}
                        </p>
                    </div>
                    <button
                        onClick={handleDeletePlaylist}
                        className="px-4 py-2 bg-red-600/10 hover:bg-red-600/20 text-red-500 rounded-lg transition-colors border border-red-600/20"
                    >
                        Delete Playlist
                    </button>
                </div>
            </div>

            {(!playlist.videos || playlist.videos.length === 0) ? (
                <div className="text-center py-16">
                    <div className="text-5xl mb-4">📺</div>
                    <h3 className="text-xl font-semibold mb-2">This playlist is empty</h3>
                    <p className="text-gray-400">Add videos to this playlist to see them here.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {playlist.videos.map(video => (
                        <div key={video._id} className="relative group">
                            <VideoCard video={video} />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleRemoveVideo(video._id);
                                }}
                                className="absolute top-2 right-2 bg-black/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                title="Remove from playlist"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default PlaylistDetail;
