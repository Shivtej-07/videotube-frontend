import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
    const { user } = useAuth();

    return (
        <aside className="sidebar-wrapper">
            <div style={{ padding: '8px 12px' }}>
                <Link to="/" className="sidebar-link active">
                    <span style={{ marginRight: '24px', fontSize: '1.2rem' }}>🏠</span>
                    <span>Home</span>
                </Link>

                <hr style={{ borderColor: 'var(--border-color)', margin: '12px 0' }} />

                <h3 style={{ padding: '8px 12px', fontSize: '1rem', color: 'var(--text-main)' }}>You </h3>

                <Link to="/history" className="sidebar-link">
                    <span style={{ marginRight: '24px', fontSize: '1.2rem' }}>⏳</span>
                    <span>History</span>
                </Link>
                <Link to="/playlists" className="sidebar-link">
                    <span style={{ marginRight: '24px', fontSize: '1.2rem' }}>🎼</span>
                    <span>Playlists</span>
                </Link>
                <Link to="/liked" className="sidebar-link">
                    <span style={{ marginRight: '24px', fontSize: '1.2rem' }}>👍</span>
                    <span>Liked Videos</span>
                </Link>

                {user?.role === 'admin' && (
                    <>
                        <hr style={{ borderColor: 'var(--border-color)', margin: '12px 0' }} />
                        <Link to="/admin" className="sidebar-link">
                            <span style={{ marginRight: '24px', fontSize: '1.2rem' }}>🛡️</span>
                            <span>Admin Dashboard</span>
                        </Link>
                    </>
                )}
            </div>

            <style>{`
                .sidebar-link {
                    display: flex;
                    align-items: center;
                    padding: 0 12px;
                    height: 40px;
                    border-radius: 10px;
                    color: var(--text-main);
                    text-decoration: none;
                    font-size: 0.9rem;
                    margin-bottom: 4px;
                }
                .sidebar-link:hover {
                    background-color: var(--hover-bg);
                }
                .sidebar-link.active {
                    background-color: var(--hover-bg);
                    font-weight: 500;
                }
            `}</style>
        </aside>
    );
}

export default Sidebar;
