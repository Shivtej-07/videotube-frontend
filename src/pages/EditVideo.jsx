import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

function EditVideo() {
    const { videoId } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        thumbnail: null,
        thumbnailPreview: ''
    });

    useEffect(() => {
        const fetchVideo = async () => {
            try {
                const response = await api.get(`/videos/${videoId}`);
                const video = response.data.data;
                setFormData({
                    title: video.title,
                    description: video.description,
                    thumbnail: null,
                    thumbnailPreview: video.thumbnail
                });
            } catch (err) {
                console.error("Failed to fetch video:", err);
                setError("Failed to load video details.");
            } finally {
                setLoading(false);
            }
        };

        if (videoId) fetchVideo();
    }, [videoId]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'thumbnail' && files && files[0]) {
            setFormData({
                ...formData,
                thumbnail: files[0],
                thumbnailPreview: URL.createObjectURL(files[0])
            });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setUpdating(true);
        setError('');

        try {
            // using FormData to handle file upload or regular JSON if no file?
            // Backend expects PATCH /videos/:videoId
            // If thumbnail is present, it must be multipart/form-data with 'thumbnail' field
            // If no thumbnail, we can just send JSON or FormData. 
            // Consistent approach: Always use FormData for this endpoint if we want to support file upload.

            // HOWEVER: If we use FormData for text-only updates, we must ensure backend parses it.
            // video.middleare.js handles 'thumbnail' field upload.
            // video.controller.js checks for req.file.path.

            // Let's use FormData
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            if (formData.thumbnail) {
                data.append('thumbnail', formData.thumbnail);
            }

            await api.patch(`/videos/${videoId}`, data); // Axios sets Content-Type boundary automatically

            navigate(`/video/${videoId}`);
        } catch (err) {
            console.error("Update failed:", err);
            setError(err.response?.data?.message || "Failed to update video.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4 lg:p-8">
            <h1 className="text-2xl font-bold mb-6">Edit Video</h1>

            {error && (
                <div className="bg-red-500/10 text-red-500 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="5"
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">nam
                        Thumbnail
                    </label>
                    <div className="border-2 border-dashed border-gray-700 rounded-lg p-4 text-center">
                        {formData.thumbnailPreview && (
                            <img
                                src={formData.thumbnailPreview}
                                alt="Preview"
                                className="h-40 mx-auto object-cover rounded-lg mb-4"
                            />
                        )}
                        <label className="cursor-pointer">
                            <span className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors">
                                Choose New Thumbnail
                            </span>
                            <input
                                type="file"
                                name="thumbnail"
                                accept="image/*"
                                onChange={handleChange}
                                className="hidden"
                            />
                        </label>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        type="submit"
                        disabled={updating}
                        className={`flex-1 py-3 rounded-lg font-medium transition-colors ${updating
                                ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                    >
                        {updating ? 'Updating...' : 'Update Video'}
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate(`/video/${videoId}`)}
                        className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default EditVideo;
