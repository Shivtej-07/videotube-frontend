import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../index.css';

function AdminUserDetail() {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [userRes, videosRes] = await Promise.all([
                    api.get(`/admin/users/${userId}`),
                    api.get(`/admin/videos/${userId}`)
                ]);
                setUser(userRes.data.data);
                setVideos(videosRes.data.data.videos);
            } catch (err) {
                console.error("Failed to fetch user details:", err);
                setError(err.response?.data?.message || "Failed to load data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [userId]);

    const handleDeleteUser = async () => {
        if (!window.confirm("Are you sure you want to delete this user? This action CANNOT be undone.")) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            alert("User deleted successfully");
            navigate('/admin');
        } catch (err) {
            console.error(err);
            alert("Failed to delete user");
        }
    };

    const handleDeleteVideo = async (videoId) => {
        if (!window.confirm("Delete this video?")) return;
        try {
            await api.delete(`/admin/video/${videoId}`);
            setVideos(videos.filter(v => v._id !== videoId));
        } catch (err) {
            console.error(err);
            alert("Failed to delete video");
        }
    };

    const handleCopyrightStrike = async (videoId) => {
        if (!window.confirm("Issue copyright strike? This will delete the video and add a strike to the user.")) return;
        try {
            const res = await api.delete(`/admin/video/copyright/${videoId}`);
            setVideos(videos.filter(v => v._id !== videoId));
            // Update local user state specifically for strikes
            setUser(prev => ({ ...prev, copyrightStrikes: res.data.data.copyrightStrikes }));
            alert("Copyright strike issued.");
        } catch (err) {
            console.error(err);
            alert("Failed to issue strike");
        }
    };

    if (loading) return <div className="text-center mt-8">Loading...</div>;
    if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
    if (!user) return <div className="text-center mt-8">User not found</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
            <button
                onClick={() => navigate('/admin')}
                style={{
                    marginBottom: '20px',
                    padding: '8px 16px',
                    backgroundColor: '#333',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                &larr; Back to Dashboard
            </button>

            {/* User Profile Header */}
            <div style={{
                backgroundColor: 'var(--card-bg)',
                padding: '2rem',
                borderRadius: '8px',
                border: '1px solid #333',
                display: 'flex',
                gap: '2rem',
                alignItems: 'start',
                marginBottom: '2rem'
            }}>
                <img
                    src={user.avatar}
                    alt={user.username}
                    style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--primary-color)' }}
                />
                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                            <h1 style={{ margin: '0 0 0.5rem 0' }}>{user.fullName}</h1>
                            <p style={{ color: '#aaa', margin: '0 0 1rem 0' }}>@{user.username}</p>
                            <p style={{ margin: '0 0 0.5rem 0' }}><strong>Email:</strong> {user.email}</p>
                            <p style={{ margin: '0 0 0.5rem 0' }}><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
                            <p style={{ margin: '0 0 0.5rem 0' }}>
                                <strong>Role:</strong>
                                <span style={{
                                    marginLeft: '8px',
                                    backgroundColor: user.role === 'admin' ? '#3ea6ff' : '#333',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem'
                                }}>{user.role}</span>
                            </p>
                            <p style={{ margin: '0', color: '#ff4444' }}><strong>Copyright Strikes:</strong> {user.copyrightStrikes || 0}</p>
                        </div>
                        <button
                            onClick={handleDeleteUser}
                            style={{
                                backgroundColor: '#ff4444',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            Delete User
                        </button>
                    </div>
                </div>
            </div>

            {/* Videos Section */}
            <h2>Uploaded Videos ({videos.length})</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px', marginTop: '20px' }}>
                {videos.map(video => (
                    <div key={video._id} style={{
                        backgroundColor: 'var(--card-bg)',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #333'
                    }}>
                        <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                            <img
                                src={video.thumbnail}
                                alt={video.title}
                                style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: '4px',
                                right: '4px',
                                backgroundColor: 'rgba(0,0,0,0.8)',
                                padding: '2px 4px',
                                borderRadius: '4px',
                                fontSize: '0.8rem'
                            }}>
                                {(video.duration / 60).toFixed(2)} mins
                            </div>
                        </div>
                        <div style={{ padding: '12px' }}>
                            <h3 style={{ margin: '0 0 8px 0', fontSize: '1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{video.title}</h3>
                            <p style={{ fontSize: '0.9rem', color: '#aaa', margin: '0 0 12px 0' }}>{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</p>

                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={() => handleDeleteVideo(video._id)}
                                    style={{
                                        flex: 1,
                                        padding: '6px',
                                        backgroundColor: '#333',
                                        color: 'white',
                                        border: '1px solid #444',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => handleCopyrightStrike(video._id)}
                                    style={{
                                        flex: 1,
                                        padding: '6px',
                                        backgroundColor: '#333', // Warning color
                                        color: '#ff4444',
                                        border: '1px solid #ff4444',
                                        borderRadius: '4px',
                                        cursor: 'pointer'
                                    }}
                                    title="Delete video and add strike"
                                >
                                    Strike
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
                {videos.length === 0 && <p style={{ color: '#aaa' }}>No videos found.</p>}
            </div>
        </div>
    );
}

export default AdminUserDetail;
