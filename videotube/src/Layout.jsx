import React from 'react';
import { Outlet } from 'react-router-dom';
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
        </div>
    );
}

export default Layout;
