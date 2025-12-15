import React, { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import '../index.css';

function PublishVideo() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        video: null,
        thumbnail: null
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);

        if (!formData.video) {
            setError("Please select a video file");
            setLoading(false);
            return;
        }
        if (!formData.thumbnail) {
            setError("Please select a thumbnail");
            setLoading(false);
            return;
        }

        data.append('video', formData.video);
        data.append('thumbnail', formData.thumbnail);

        try {
            // Note: Cloudinary upload might take time, backend should handle timeout or frontend should wait
            const response = await api.post('/videos/publish', data);
            console.log("Upload success:", response.data);
            navigate('/');
        } catch (err) {
            console.error("Upload failed:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Failed to upload video. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>Upload Video</h1>

            {error && <div className="status error" style={{ marginBottom: '1rem', padding: '1rem' }}>{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-section">
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="modern-input"
                        placeholder="Video Title"
                    />
                </div>

                <div className="form-section">
                    <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="modern-input"
                        rows="5"
                        placeholder="Tell viewers about your video"
                        style={{ fontFamily: 'inherit' }}
                    />
                </div>

                <div className="form-row" style={{ display: 'flex', gap: '2rem' }}>
                    <div className="form-section" style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Video File</label>
                        <div style={{ border: '2px dashed #444', padding: '2rem', borderRadius: '12px', textAlign: 'center', backgroundColor: '#181818' }}>
                            <input
                                type="file"
                                name="video"
                                onChange={handleChange}
                                accept="video/*"
                                required
                                style={{ display: 'none' }}
                                id="video-upload"
                            />
                            <label htmlFor="video-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📁</div>
                                <div style={{ color: '#3ea6ff', fontWeight: '500' }}>Select Video</div>
                                {formData.video && <div style={{ marginTop: '0.5rem', color: '#aaa' }}>{formData.video.name}</div>}
                            </label>
                        </div>
                    </div>

                    <div className="form-section" style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem' }}>Thumbnail</label>
                        <div style={{ border: '2px dashed #444', padding: '2rem', borderRadius: '12px', textAlign: 'center', backgroundColor: '#181818' }}>
                            <input
                                type="file"
                                name="thumbnail"
                                onChange={handleChange}
                                accept="image/*"
                                required
                                style={{ display: 'none' }}
                                id="thumb-upload"
                            />
                            <label htmlFor="thumb-upload" style={{ cursor: 'pointer', display: 'block' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🖼️</div>
                                <div style={{ color: '#3ea6ff', fontWeight: '500' }}>Select Thumbnail</div>
                                {formData.thumbnail && <div style={{ marginTop: '0.5rem', color: '#aaa' }}>{formData.thumbnail.name}</div>}
                            </label>
                        </div>
                    </div>
                </div>

                <button
                    type="submit"
                    className="modern-btn"
                    disabled={loading}
                    style={{ marginTop: '1rem', padding: '1rem' }}
                >
                    {loading ? 'Uploading... This may take a while' : 'Publish Video'}
                </button>
            </form>

            <style>{`
                .modern-input {
                    width: 100%;
                    padding: 12px;
                    border-radius: 8px;
                    background-color: #121212;
                    border: 1px solid #444;
                    color: white;
                    font-size: 1rem;
                    outline: none;
                }
                .modern-input:focus {
                    border-color: #3ea6ff;
                }
                .modern-btn {
                    width: 100%;
                    background-color: #3ea6ff;
                    color: black;
                    border: none;
                    border-radius: 4px;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                }
                .modern-btn:disabled {
                    background-color: #555;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}

export default PublishVideo;
