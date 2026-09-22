import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { Home, Flame, Zap, Tv, Folder, User } from 'lucide-react';

function Layout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    // Auto-close mobile drawer on route change
    useEffect(() => {
        setIsMobileOpen(false);
    }, [location.pathname]);

    // Toggle handlers
    const toggleSidebar = () => {
        if (window.innerWidth < 768) {
            setIsMobileOpen((prev) => !prev);
        } else {
            setIsCollapsed((prev) => !prev);
        }
    };

    const isActive = (path) => location.pathname === path;

    const mobileNavItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/shorts', label: 'Shorts', icon: Zap },
        { path: '/trending', label: 'Trending', icon: Flame },
        { path: '/subscriptions', label: 'Subs', icon: Tv },
        { path: '/library', label: 'Library', icon: Folder },
    ];

    return (
        <div className="app-layout min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans">
            {/* Header / Navbar */}
            <Navbar
                onToggleSidebar={toggleSidebar}
                isMobileOpen={isMobileOpen}
            />

            <div className="main-container flex flex-1 pt-16 relative">
                {/* Desktop & Mobile Sidebar */}
                <Sidebar
                    isCollapsed={isCollapsed}
                    isMobileOpen={isMobileOpen}
                    onCloseMobile={() => setIsMobileOpen(false)}
                    onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                />

                {/* Mobile Drawer Overlay Backdrop */}
                {isMobileOpen && (
                    <div
                        className="fixed inset-0 top-16 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                        onClick={() => setIsMobileOpen(false)}
                        aria-hidden="true"
                    />
                )}

                {/* Main Content Area */}
                <main
                    className={`content-wrapper min-h-[calc(100vh-4rem)] p-4 sm:p-6 transition-all duration-300 ${
                        isCollapsed ? 'collapsed' : 'expanded'
                    }`}
                >
                    <div className="max-w-7xl mx-auto animate-fade-in">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Bottom Navigation Bar (Modern YouTube style) */}
            <nav className="fixed bottom-0 left-0 right-0 z-30 bg-zinc-950/90 backdrop-blur-md border-t border-zinc-800/80 px-2 py-1.5 flex justify-around items-center md:hidden">
                {mobileNavItems.map((item) => {
                    const IconComponent = item.icon;
                    const active = isActive(item.path);
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 ${
                                active
                                    ? 'text-red-500 font-medium scale-105'
                                    : 'text-zinc-400 hover:text-zinc-200'
                            }`}
                        >
                            <IconComponent className={`w-5 h-5 ${active ? 'stroke-[2.5px]' : 'stroke-2'}`} />
                            <span className="text-[10px] mt-1 font-medium tracking-tight">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

export default Layout;

