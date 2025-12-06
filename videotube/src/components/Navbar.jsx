import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../index.css';

function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        // Implement search navigation here
        console.log("Searching for:", searchQuery);
    };

    return (
        <nav className="navbar">
            {/* Left: Menu & Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button className="btn-icon">
                    <span style={{ fontSize: '24px' }}>☰</span>
                </button>
                <div className="nav-brand">
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none', color: 'white' }}>
                        <span style={{ color: '#ff0000', fontSize: '28px' }}>▶</span>
                        <span style={{ fontSize: '20px', fontWeight: 'bold', fontFamily: 'Oswald, sans-serif', letterSpacing: '-0.5px' }}>VideoTube</span>
                    </Link>
                </div>
            </div>

            {/* Center: Search */}
            <form className="search-bar-container" onSubmit={handleSearch}>
                <div className="search-input-wrapper">
                    <input
                        type="text"
                        placeholder="Search"
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                        <span style={{ color: '#fff' }}>🔍</span>
                    </button>
                    {/* Voice search button could go here */}
                    <button type="button" className="btn-icon" style={{ marginLeft: '8px', backgroundColor: '#121212' }}>
                        <span style={{ fontSize: '18px' }}>🎤</span>
                    </button>
                </div>
            </form>

            {/* Right: User Actions */}
            <div className="nav-links">
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <Link to="/publish" className="btn-icon">📹</Link>
                        <button className="btn-icon">🔔</button>

                        <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleLogout}>
                            {user.avatar ? (
                                <img src={user.avatar} alt="avatar" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#555', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {user.username?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button className="btn-icon">⋮</button>
                        <Link to="/login" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            border: '1px solid #303030',
                            padding: '8px 16px',
                            borderRadius: '18px',
                            textDecoration: 'none',
                            color: '#3ea6ff',
                            fontSize: '14px',
                            fontWeight: '500'
                        }}>
                            👤  Sign in
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
