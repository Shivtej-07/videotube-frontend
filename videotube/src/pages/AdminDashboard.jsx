import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import '../index.css';

function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [statsRes, usersRes] = await Promise.all([
                    api.get('/admin/stats'),
                    api.get('/admin/users')
                ]);

                setStats(statsRes.data.data);
                setUsers(usersRes.data.data.users || []); // Assuming structure based on controller
            } catch (err) {
                console.error("Admin data fetch failed:", err);
                setError(err.response?.data?.message || "Failed to load admin data. Are you an admin?");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div className="text-center" style={{ marginTop: '2rem' }}>Loading Dashboard...</div>;
    if (error) return <div className="text-center status error" style={{ marginTop: '2rem' }}>{error}</div>;

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Admin Dashboard</h1>

            {/* Stats Grid */}
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-number">{stats?.totalUsers}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Videos</h3>
                    <p className="stat-number">{stats?.totalVideos}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Views</h3>
                    <p className="stat-number">{stats?.totalViews}</p>
                </div>
                <div className="stat-card">
                    <h3>Total Likes</h3>
                    <p className="stat-number">{stats?.totalLikes}</p>
                </div>
            </div>

            {/* Recent Users Table */}
            <h2 style={{ marginTop: '3rem', marginBottom: '1rem' }}>Users Directory</h2>
            <div className="table-container">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid #333', textAlign: 'left' }}>
                            <th style={{ padding: '12px' }}>Avatar</th>
                            <th style={{ padding: '12px' }}>Username</th>
                            <th style={{ padding: '12px' }}>Email</th>
                            <th style={{ padding: '12px' }}>Joined</th>
                            <th style={{ padding: '12px' }}>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} style={{ borderBottom: '1px solid #222' }}>
                                <td style={{ padding: '12px' }}>
                                    <img src={user.avatar} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%' }} />
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
                            </tr>
                        ))}
                    </tbody>
                </table>
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
