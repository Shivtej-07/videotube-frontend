import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import '../index.css';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

function AdminDashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 10;

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [statsRes, usersRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get(`/admin/users?page=${page}&limit=${LIMIT}`)
            ]);

            setStats(statsRes.data.data);
            setUsers(usersRes.data.data.users || []);

            // Calculate total pages if totalUsers is provided in user response
            const totalUsers = usersRes.data.data.totalUsers || 0;
            setTotalPages(Math.ceil(totalUsers / LIMIT));

        } catch (err) {
            console.error("Admin data fetch failed:", err);
            setError(err.response?.data?.message || "Failed to load admin data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, [page]);

    if (loading && !stats) return <div className="text-center" style={{ marginTop: '2rem' }}>Loading Dashboard...</div>;
    if (error) return <div className="text-center status error" style={{ marginTop: '2rem' }}>{error}</div>;

    // Prepare data for charts
    const chartData = stats ? [
        { name: 'Videos', count: stats.totalVideos },
        { name: 'Users', count: stats.totalUsers },
        { name: 'Likes', count: stats.totalLikes },
        { name: 'Comments', count: stats.totalComments },
        { name: 'Tweets', count: stats.totalTweets },
    ] : [];

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

            {/* Stats Overview */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Views</h3>
                    <p className="stat-number">{stats?.totalViews.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Videos</h3>
                    <p className="stat-number">{stats?.totalVideos.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-number">{stats?.totalUsers.toLocaleString()}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Likes</h3>
                    <p className="stat-number">{stats?.totalLikes.toLocaleString()}</p>
                </div>
            </div>

            {/* Analytics Chart */}
            <h2 style={{ marginTop: '3rem', marginBottom: '1rem' }}>Platform Analytics</h2>
            <div style={{ height: '400px', backgroundColor: 'var(--card-bg)', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip contentStyle={{ backgroundColor: '#222', border: '1px solid #444' }} />
                        <Legend />
                        <Bar dataKey="count" fill="#3ea6ff" name="Count" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Recent Users Table */}
            <h2 style={{ marginTop: '3rem', marginBottom: '1rem' }}>User Management</h2>
            <div className="table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>Avatar</th>
                            <th style={{ padding: '12px' }}>Username</th>
                            <th style={{ padding: '12px' }}>Email</th>
                            <th style={{ padding: '12px' }}>Joined</th>
                            <th style={{ padding: '12px' }}>Role</th>
                            <th style={{ padding: '12px' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} style={{ borderBottom: '1px solid #222' }}>
                                <td style={{ padding: '12px' }}>
                                    <img src={user.avatar} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                                </td>
                                <td style={{ padding: '12px' }}>{user.username}</td>
                                <td style={{ padding: '12px' }}>{user.email}</td>
                                <td style={{ padding: '12px' }}>{new Date(user.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{
                                        backgroundColor: user.role === 'admin' ? '#3ea6ff' : '#333',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.8rem',
                                        color: 'white'
                                    }}>
                                        {user.role || 'user'}
                                    </span>
                                </td>
                                <td style={{ padding: '12px' }}>
                                    <button
                                        onClick={() => navigate(`/admin/user/${user._id}`)}
                                        style={{
                                            padding: '6px 12px',
                                            backgroundColor: '#3ea6ff',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        Manage
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '20px' }}>
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: page === 1 ? '#222' : '#333',
                        color: page === 1 ? '#555' : 'white',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        cursor: page === 1 ? 'not-allowed' : 'pointer'
                    }}
                >
                    Previous
                </button>
                <span style={{ display: 'flex', alignItems: 'center' }}>Page {page} of {totalPages || 1}</span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    style={{
                        padding: '8px 16px',
                        backgroundColor: page >= totalPages ? '#222' : '#333',
                        color: page >= totalPages ? '#555' : 'white',
                        border: '1px solid #444',
                        borderRadius: '4px',
                        cursor: page >= totalPages ? 'not-allowed' : 'pointer'
                    }}
                >
                    Next
                </button>
            </div>

            <style>{`
                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 1.5rem;
                }
                .stat-card {
                    background-color: var(--card-bg);
                    padding: 1.5rem;
                    border-radius: 8px;
                    border: 1px solid #333;
                }
                .stat-card h3 {
                    margin: 0 0 0.5rem 0;
                    font-size: 1rem;
                    color: #aaa;
                }
                .stat-number {
                    font-size: 2.5rem;
                    font-weight: 700;
                    margin: 0;
                    color: var(--primary-color);
                }
                .table-container {
                    background-color: var(--card-bg);
                    border-radius: 8px;
                    border: 1px solid #333;
                    overflow-x: auto;
                }
            `}</style>
        </div>
    );
}

export default AdminDashboard;
