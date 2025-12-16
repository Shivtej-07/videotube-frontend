import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar() {
    const { user } = useAuth();
    const location = useLocation();
    const [collapsed, setCollapsed] = useState(false);

    // Check if the current route is active
    const isActive = (path) => {
        return location.pathname === path;
    };

    const sidebarItems = [
        { path: '/', icon: '🏠', label: 'Home' },
        { path: '/shorts', icon: '⚡', label: 'Shorts' },
        { path: '/trending', icon: '🔥', label: 'Trending' },
        { path: '/subscriptions', icon: '📺', label: 'Subscriptions' },
        { path: '/library', icon: '📚', label: 'Library' },
        { path: '/history', icon: '⏳', label: 'History' },
        { path: '/playlists', icon: '📂', label: 'Playlists' },
        { path: '/liked', icon: '👍', label: 'Liked Videos' },
        { path: '/watch-later', icon: '⏱️', label: 'Watch Later' },
        { path: '/downloads', icon: '⬇️', label: 'Downloads' },
    ];

    const userItems = [
        { path: '/your-channel', icon: '🎬', label: 'Your Channel' },
        { path: '/studio', icon: '🎥', label: 'Studio' },
        { path: '/settings', icon: '⚙️', label: 'Settings' },
    ];

    const subscriptionItems = [
        { name: 'Tech With Tim', avatar: 'https://via.placeholder.com/24', live: false },
        { name: 'Web Dev Simplified', avatar: 'https://via.placeholder.com/24', live: false },
        { name: 'Fireship', avatar: 'https://via.placeholder.com/24', live: true },
        { name: 'Traversy Media', avatar: 'https://via.placeholder.com/24', live: false },
        { name: 'Programming with Mosh', avatar: 'https://via.placeholder.com/24', live: false },
    ];

    if (collapsed) {
        return (
            <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-16 bg-gray-900 border-r border-gray-800 overflow-y-auto py-4">
                <button
                    onClick={() => setCollapsed(false)}
                    className="w-full flex justify-center py-3 hover:bg-gray-800 transition-colors"
                    aria-label="Expand sidebar"
                >
                    <span className="text-2xl">→</span>
                </button>

                {sidebarItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex flex-col items-center py-3 hover:bg-gray-800 transition-colors ${isActive(item.path) ? 'bg-gray-800 text-white' : 'text-gray-300'
                            }`}
                        title={item.label}
                    >
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-xs mt-1 truncate w-full text-center">{item.label}</span>
                    </Link>
                ))}
            </aside>
        );
    }

    return (
        <aside className="hidden sm:block fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-gray-900 border-r border-gray-800 overflow-y-auto">
            {/* Collapse Button */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800">
                <span className="text-gray-300 font-medium">Menu</span>
                <button
                    onClick={() => setCollapsed(true)}
                    className="p-1 hover:bg-gray-800 rounded transition-colors"
                    aria-label="Collapse sidebar"
                >
                    <span className="text-xl">←</span>
                </button>
            </div>

            {/* Main Navigation */}
            <div className="py-2">
                {sidebarItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center px-4 py-3 hover:bg-gray-800 transition-colors ${isActive(item.path)
                            ? 'bg-gray-800 text-white border-l-4 border-red-600'
                            : 'text-gray-300'
                            }`}
                    >
                        <span className="text-xl w-8 mr-4">{item.icon}</span>
                        <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>

            {/* User Section */}
            {user && (
                <>
                    <div className="px-4 py-3 border-t border-gray-800">
                        <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-2">
                            You
                        </h3>
                        {userItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center px-4 py-3 hover:bg-gray-800 transition-colors ${isActive(item.path) ? 'bg-gray-800 text-white' : 'text-gray-300'
                                    }`}
                            >
                                <span className="text-xl w-8 mr-4">{item.icon}</span>
                                <span className="text-sm font-medium">{item.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Subscriptions Section */}
                    <div className="px-4 py-3 border-t border-gray-800">
                        <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-2">
                            Subscriptions
                        </h3>
                        {subscriptionItems.map((channel) => (
                            <Link
                                key={channel.name}
                                to={`/channel/${channel.name.toLowerCase().replace(/\s+/g, '-')}`}
                                className="flex items-center px-4 py-2 hover:bg-gray-800 transition-colors group"
                            >
                                <div className="relative">
                                    <img
                                        src={channel.avatar}
                                        alt={channel.name}
                                        className="w-6 h-6 rounded-full mr-3"
                                    />
                                    {channel.live && (
                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                </div>
                                <span className="text-sm text-gray-300 group-hover:text-white truncate">
                                    {channel.name}
                                </span>
                                {channel.live && (
                                    <span className="ml-auto px-1.5 py-0.5 text-xs bg-red-600 text-white rounded-sm">
                                        LIVE
                                    </span>
                                )}
                            </Link>
                        ))}
                        <button className="flex items-center px-4 py-2 text-blue-400 hover:text-blue-300 text-sm font-medium w-full">
                            <span className="mr-3">🔽</span>
                            Show more
                        </button>
                    </div>
                </>
            )}

            {/* Admin Section */}
            {user?.role === 'admin' && (
                <div className="px-4 py-3 border-t border-gray-800">
                    <h3 className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-2">
                        Admin
                    </h3>
                    <Link
                        to="/admin"
                        className={`flex items-center px-4 py-3 hover:bg-gray-800 transition-colors ${isActive('/admin')
                            ? 'bg-gray-800 text-white border-l-4 border-red-600'
                            : 'text-gray-300'
                            }`}
                    >
                        <span className="text-xl w-8 mr-4">🛡️</span>
                        <span className="text-sm font-medium">Admin Dashboard</span>
                    </Link>
                    <Link
                        to="/admin/users"
                        className="flex items-center px-4 py-2 hover:bg-gray-800 transition-colors text-gray-300 pl-12"
                    >
                        <span className="text-sm font-medium">User Management</span>
                    </Link>
                    <Link
                        to="/admin/videos"
                        className="flex items-center px-4 py-2 hover:bg-gray-800 transition-colors text-gray-300 pl-12"
                    >
                        <span className="text-sm font-medium">Video Moderation</span>
                    </Link>
                    <Link
                        to="/admin/analytics"
                        className="flex items-center px-4 py-2 hover:bg-gray-800 transition-colors text-gray-300 pl-12"
                    >
                        <span className="text-sm font-medium">Analytics</span>
                    </Link>
                </div>
            )}

            {/* Footer Links */}
            <div className="px-4 py-3 border-t border-gray-800">
                <div className="text-xs text-gray-500 space-y-2">
                    <div className="flex flex-wrap gap-2">
                        <a href="#" className="hover:text-gray-400">About</a>
                        <a href="#" className="hover:text-gray-400">Press</a>
                        <a href="#" className="hover:text-gray-400">Copyright</a>
                        <a href="#" className="hover:text-gray-400">Contact</a>
                        <a href="#" className="hover:text-gray-400">Creators</a>
                        <a href="#" className="hover:text-gray-400">Advertise</a>
                        <a href="#" className="hover:text-gray-400">Developers</a>
                    </div>
                    <div className="text-xs text-gray-600 mt-4">
                        © 2024 VideoTube
                    </div>
                </div>
            </div>
        </aside>
    );
}

export default Sidebar;