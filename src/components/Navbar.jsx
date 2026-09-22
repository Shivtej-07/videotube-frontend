import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Menu,
    X,
    Play,
    Search,
    Mic,
    Video,
    Bell,
    User,
    LayoutDashboard,
    Settings,
    Tv,
    LogOut,
    ChevronDown,
} from 'lucide-react';

function Navbar({ onToggleSidebar, isMobileOpen }) {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [showUserMenu, setShowUserMenu] = useState(false);

    const handleLogout = async () => {
        await logout();
        setShowUserMenu(false);
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/70 px-3 sm:px-6">
            <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-3 sm:gap-6">
                {/* Left: Hamburger & Brand Logo */}
                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
                    <button
                        onClick={onToggleSidebar}
                        className="p-2 hover:bg-zinc-800/80 text-zinc-300 hover:text-white rounded-full transition-all duration-200 active:scale-95 focus:outline-none"
                        aria-label="Toggle navigation menu"
                    >
                        {isMobileOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
                    </button>

                    <Link
                        to="/"
                        className="flex items-center gap-2 group text-white no-underline hover:no-underline"
                    >
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 p-0.5 shadow-lg shadow-red-500/20 group-hover:shadow-red-500/40 transition-all duration-300 flex items-center justify-center">
                            <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                                <Play className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 fill-red-500 ml-0.5 group-hover:scale-110 transition-transform duration-200" />
                            </div>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-base sm:text-lg font-bold tracking-tight bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent font-['Inter']">
                                Video<span className="text-red-500">Tube</span>
                            </span>
                        </div>
                    </Link>
                </div>

                {/* Center: Search Bar */}
                <form
                    onSubmit={handleSearch}
                    className="flex-1 max-w-xl mx-2 sm:mx-4"
                >
                    <div className="flex items-center">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search videos..."
                                className="w-full bg-zinc-900/90 border border-zinc-800 rounded-l-full py-2 px-4 pl-4 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-red-500/50 focus:ring-1 focus:ring-red-500/30 transition-all duration-200"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-800 border-l-0 rounded-r-full py-2 px-4 sm:px-5 transition-colors text-zinc-300 hover:text-white flex items-center justify-center"
                            aria-label="Submit Search"
                        >
                            <Search className="w-4 h-4" />
                        </button>
                        <button
                            type="button"
                            className="hidden sm:flex ml-2 p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-full text-zinc-400 hover:text-zinc-100 transition-colors"
                            aria-label="Voice search"
                        >
                            <Mic className="w-4 h-4" />
                        </button>
                    </div>
                </form>

                {/* Right: Actions / User Profile */}
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                    {user ? (
                        <>
                            <Link
                                to="/publish"
                                className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs sm:text-sm font-semibold rounded-full shadow-md shadow-red-600/20 hover:shadow-red-600/30 transition-all duration-200 active:scale-95 no-underline"
                                aria-label="Upload Video"
                            >
                                <Video className="w-4 h-4" />
                                <span className="hidden sm:inline">Upload</span>
                            </Link>

                            <button
                                className="p-2 hover:bg-zinc-800/80 rounded-full text-zinc-300 hover:text-white transition-colors relative"
                                aria-label="Notifications"
                            >
                                <Bell className="w-5 h-5" />
                                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-zinc-950 animate-pulse"></span>
                            </button>

                            {/* User Menu Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className="flex items-center gap-2 p-1 hover:bg-zinc-800 rounded-full transition-colors focus:outline-none"
                                    aria-label="User Menu"
                                >
                                    {user.avatar ? (
                                        <img
                                            src={user.avatar}
                                            alt={user.username}
                                            className="w-8 h-8 rounded-full object-cover ring-2 ring-zinc-700 hover:ring-red-500 transition-all"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center text-white font-bold text-xs ring-2 ring-zinc-700">
                                            {user.username?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                    )}
                                    <ChevronDown className="w-4 h-4 text-zinc-400 hidden sm:block" />
                                </button>

                                {showUserMenu && (
                                    <>
                                        <div
                                            className="fixed inset-0 z-40"
                                            onClick={() => setShowUserMenu(false)}
                                        />
                                        <div className="absolute right-0 mt-2 w-60 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl z-50 py-2 animate-fade-in divide-y divide-zinc-800/80">
                                            <div className="px-4 py-3">
                                                <p className="font-semibold text-sm text-zinc-100 truncate">
                                                    {user.username}
                                                </p>
                                                <p className="text-xs text-zinc-400 truncate">
                                                    {user.email || `@${user.username}`}
                                                </p>
                                            </div>

                                            <div className="py-1">
                                                <Link
                                                    to="/studio"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                                >
                                                    <LayoutDashboard className="w-4 h-4 text-zinc-400" />
                                                    Creator Studio
                                                </Link>
                                                <Link
                                                    to="/subscriptions"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                                >
                                                    <Tv className="w-4 h-4 text-zinc-400" />
                                                    Subscriptions
                                                </Link>
                                                <Link
                                                    to="/settings"
                                                    onClick={() => setShowUserMenu(false)}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                                                >
                                                    <Settings className="w-4 h-4 text-zinc-400" />
                                                    Settings
                                                </Link>
                                            </div>

                                            <div className="py-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="flex items-center gap-3 px-4 py-2.5 text-sm w-full text-left text-red-400 hover:bg-red-500/10 transition-colors font-medium"
                                                >
                                                    <LogOut className="w-4 h-4 text-red-400" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 px-4 py-2 border border-zinc-700 hover:border-zinc-500 rounded-full text-xs sm:text-sm font-semibold text-zinc-200 hover:bg-zinc-800 transition-all duration-200 no-underline"
                        >
                            <User className="w-4 h-4 text-red-500" />
                            <span>Sign In</span>
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}

export default Navbar;