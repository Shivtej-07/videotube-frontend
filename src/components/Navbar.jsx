import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
            <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
                {/* Left: Menu & Logo */}
                <div className="flex items-center gap-4">
                    <button
                        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        aria-label="Menu"
                    >
                        <span className="text-2xl">☰</span>
                    </button>

                    <Link
                        to="/"
                        className="flex items-center gap-2 text-white no-underline hover:no-underline"
                    >
                        <span className="text-red-600 text-3xl">▶</span>
                        <span className="text-xl font-bold font-['Oswald'] tracking-tight">
                            VideoTube
                        </span>
                    </Link>
                </div>

                {/* Center: Search */}
                <form
                    onSubmit={handleSearch}
                    className="flex-1 max-w-2xl"
                >
                    <div className="flex items-center">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search"
                                className="w-full bg-gray-900 border border-gray-700 rounded-l-full py-2 px-4 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-gray-800 hover:bg-gray-700 border border-gray-700 border-l-0 rounded-r-full py-2 px-6 transition-colors"
                            aria-label="Search"
                        >
                            <span className="text-white">🔍</span>
                        </button>
                        <button
                            type="button"
                            className="ml-2 p-2 hover:bg-gray-800 rounded-full transition-colors"
                            aria-label="Voice search"
                        >
                            <span className="text-xl">🎤</span>
                        </button>
                    </div>
                </form>

                {/* Right: User Actions */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <>
                            <Link
                                to="/publish"
                                className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                                aria-label="Upload video"
                            >
                                <span className="text-2xl">📹</span>
                            </Link>

                            <button
                                className="p-2 hover:bg-gray-800 rounded-full transition-colors relative"
                                aria-label="Notifications"
                            >
                                <span className="text-2xl">🔔</span>
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>

                            {/* User Dropdown */}
                            <div className="relative group">
                                <button
                                    className="flex items-center gap-2 p-1 hover:bg-gray-800 rounded-full transition-colors"
                                    aria-label="User menu"
                                >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="w-8 h-8 rounded-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-semibold">
                                            {user.username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <span className="hidden md:inline text-sm text-gray-300">
                                        {user.username}
                                    </span>
                                </button>

                                {/* Dropdown Menu */}
                                <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                                    <div className="p-4 border-b border-gray-700">
                                        <div className="flex items-center gap-3">
                                            {user.avatar ? (
                                                <img
                                                    src={user.avatar}
                                                    alt={user.username}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center text-white font-semibold text-lg">
                                                    {user.username?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-semibold text-white">{user.username}</p>
                                                <p className="text-sm text-gray-400">@{user.username}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-2">
                                        <Link
                                            to="/dashboard"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 text-gray-300 transition-colors"
                                        >
                                            <span>📊</span> Dashboard
                                        </Link>
                                        <Link
                                            to="/settings"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 text-gray-300 transition-colors"
                                        >
                                            <span>⚙️</span> Settings
                                        </Link>
                                        <Link
                                            to="/subscriptions"
                                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 text-gray-300 transition-colors"
                                        >
                                            <span>📺</span> Subscriptions
                                        </Link>
                                    </div>
                                    <div className="py-2 border-t border-gray-700">
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-gray-800 text-red-400 transition-colors"
                                        >
                                            <span>🚪</span> Logout
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <button
                                className="p-2 hover:bg-gray-800 rounded-full transition-colors md:hidden"
                                aria-label="More options"
                            >
                                <span className="text-2xl">⋮</span>
                            </button>

                            <Link
                                to="/login"
                                className="flex items-center gap-2 border border-gray-700 px-4 py-2 rounded-full text-blue-400 hover:bg-blue-400/10 transition-colors no-underline"
                            >
                                <span className="text-lg">👤</span>
                                <span className="text-sm font-medium">Sign in</span>
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu (Hidden by default) */}
            {isMenuOpen && (
                <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-3">
                    <div className="flex flex-col space-y-2">
                        <Link
                            to="/"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors text-white no-underline"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <span>🏠</span> Home
                        </Link>
                        <Link
                            to="/trending"
                            className="flex items-center gap-3 px-4 py-3 hover:bg-gray-800 rounded-lg transition-colors text-white no-underline"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <span>🔥</span> Trending
                        </Link>
                        <Link
                            to="/subscriptions"
                        >
                            <span>📹</span> Upload Video
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}

export default Navbar;