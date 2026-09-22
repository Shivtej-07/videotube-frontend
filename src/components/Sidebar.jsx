import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Home,
    Zap,
    Flame,
    Tv,
    Folder,
    History,
    ListVideo,
    ThumbsUp,
    Clock,
    Download,
    UserCheck,
    Video,
    Settings,
    Shield,
    ChevronLeft,
    ChevronRight,
    X,
} from 'lucide-react';

function Sidebar({ isCollapsed, isMobileOpen, onCloseMobile, onToggleCollapse }) {
    const { user } = useAuth();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const mainItems = [
        { path: '/', icon: Home, label: 'Home' },
        { path: '/shorts', icon: Zap, label: 'Shorts' },
        { path: '/trending', icon: Flame, label: 'Trending' },
        { path: '/subscriptions', icon: Tv, label: 'Subscriptions' },
        { path: '/library', icon: Folder, label: 'Library' },
        { path: '/history', icon: History, label: 'History' },
        { path: '/playlists', icon: ListVideo, label: 'Playlists' },
        { path: '/liked', icon: ThumbsUp, label: 'Liked Videos' },
        { path: '/watch-later', icon: Clock, label: 'Watch Later' },
        { path: '/downloads', icon: Download, label: 'Downloads' },
    ];

    const userItems = [
        { path: '/studio', icon: Video, label: 'Studio' },
        { path: '/settings', icon: Settings, label: 'Settings' },
    ];

    // Responsive class logic
    const desktopClasses = `fixed left-0 top-16 h-[calc(100vh-4rem)] bg-zinc-950 border-r border-zinc-800/70 overflow-y-auto transition-all duration-300 z-40 hidden md:block ${
        isCollapsed ? 'w-18' : 'w-64'
    }`;

    const mobileClasses = `fixed left-0 top-16 h-[calc(100vh-4rem)] w-72 bg-zinc-950 border-r border-zinc-800/80 overflow-y-auto z-50 md:hidden transition-transform duration-300 shadow-2xl ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
    }`;

    // Helper to render links
    const renderLink = (item, isMini = false) => {
        const IconComponent = item.icon;
        const active = isActive(item.path);

        if (isMini) {
            return (
                <Link
                    key={item.path}
                    to={item.path}
                    className={`flex flex-col items-center py-3.5 px-1 hover:bg-zinc-800/60 transition-colors group relative ${
                        active ? 'text-red-500 font-semibold' : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                    title={item.label}
                >
                    <IconComponent className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                    <span className="text-[10px] mt-1.5 truncate max-w-full text-center tracking-tight">
                        {item.label}
                    </span>
                    {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-red-500 rounded-r-full" />
                    )}
                </Link>
            );
        }

        return (
            <Link
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={`flex items-center px-4 py-3 rounded-xl mx-2 my-0.5 text-sm font-medium transition-all duration-200 group ${
                    active
                        ? 'bg-red-500/10 text-red-500 font-semibold'
                        : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                }`}
            >
                <IconComponent
                    className={`w-5 h-5 mr-4 transition-transform duration-200 group-hover:scale-110 ${
                        active ? 'text-red-500 stroke-[2.5px]' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                />
                <span className="truncate">{item.label}</span>
            </Link>
        );
    };

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className={desktopClasses}>
                {/* Desktop Collapse Toggle */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/60">
                    {!isCollapsed && <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Navigation</span>}
                    <button
                        onClick={onToggleCollapse}
                        className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-lg transition-colors ml-auto"
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                    </button>
                </div>

                {/* Main Navigation */}
                <div className="py-2">
                    {mainItems.map((item) => renderLink(item, isCollapsed))}
                </div>

                {/* User Section */}
                {!isCollapsed && user && (
                    <div className="pt-3 mt-3 border-t border-zinc-800/60">
                        <h3 className="px-6 pb-2 text-[11px] uppercase text-zinc-500 font-bold tracking-wider">
                            Studio & Account
                        </h3>
                        {userItems.map((item) => renderLink(item, false))}
                    </div>
                )}

                {/* Admin Section */}
                {!isCollapsed && user?.role === 'admin' && (
                    <div className="pt-3 mt-3 border-t border-zinc-800/60">
                        <h3 className="px-6 pb-2 text-[11px] uppercase text-zinc-500 font-bold tracking-wider text-amber-500">
                            Admin Moderation
                        </h3>
                        <Link
                            to="/admin"
                            onClick={onCloseMobile}
                            className={`flex items-center px-4 py-3 rounded-xl mx-2 text-sm font-medium transition-colors ${
                                isActive('/admin')
                                    ? 'bg-amber-500/10 text-amber-500 font-semibold'
                                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
                            }`}
                        >
                            <Shield className="w-5 h-5 mr-4 text-amber-500" />
                            <span>Admin Dashboard</span>
                        </Link>
                    </div>
                )}
            </aside>

            {/* Mobile Sliding Drawer Sidebar */}
            <aside className={mobileClasses}>
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
                    <span className="text-sm font-bold text-zinc-100">Menu</span>
                    <button
                        onClick={onCloseMobile}
                        className="p-1.5 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="py-2">
                    {mainItems.map((item) => renderLink(item, false))}
                </div>

                {user && (
                    <div className="pt-3 mt-3 border-t border-zinc-800/60">
                        <h3 className="px-6 pb-2 text-[11px] uppercase text-zinc-500 font-bold tracking-wider">
                            You
                        </h3>
                        {userItems.map((item) => renderLink(item, false))}
                    </div>
                )}

                {user?.role === 'admin' && (
                    <div className="pt-3 mt-3 border-t border-zinc-800/60">
                        <h3 className="px-6 pb-2 text-[11px] uppercase text-zinc-500 font-bold tracking-wider text-amber-500">
                            Admin
                        </h3>
                        <Link
                            to="/admin"
                            onClick={onCloseMobile}
                            className="flex items-center px-4 py-3 rounded-xl mx-2 text-sm font-medium text-amber-500 hover:bg-amber-500/10 transition-colors"
                        >
                            <Shield className="w-5 h-5 mr-4" />
                            <span>Admin Dashboard</span>
                        </Link>
                    </div>
                )}
            </aside>
        </>
    );
}

export default Sidebar;