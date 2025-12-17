import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

function Layout() {
    return (
        <div className="app-layout">
            <Navbar />
            <div className="main-container">
                <Sidebar />
                <main className="content-wrapper">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Bottom Navigation - YouTube Style */}
            <div className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-gray-800/50 py-1 flex justify-around items-center sm:hidden z-20 h-12">
                <Link to="/" className="flex flex-col items-center justify-center w-full h-full text-white">
                    <svg className="w-6 h-6 mb-1" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                    <span className="text-[10px]">Home</span>
                </Link>
                <Link to="/shorts" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-white">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="text-[10px]">Shorts</span>
                </Link>
                <Link to="/publish" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-white">
                    <div className="w-9 h-9 rounded-full border border-gray-500 flex items-center justify-center">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                </Link>
                <Link to="/subscriptions" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-white">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                    <span className="text-[10px]">Subs</span>
                </Link>
                <Link to="/library" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-white">
                    <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path></svg>
                    <span className="text-[10px]">You</span>
                </Link>
            </div>
        </div>
    );
}

export default Layout;
