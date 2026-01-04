import React from 'react';
import { useLocation } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

const TopHeader = () => {
    const location = useLocation();

    // Pages to hide the TopHeader on
    const hideOn = ['/login', '/register', '/verify-email'];
    if (hideOn.includes(location.pathname)) return null;

    const getPageTitle = (path) => {
        if (path === '/') return 'Marketplace Discovery';
        if (path.startsWith('/items/create')) return 'Create New Listing';
        if (path.startsWith('/items/edit')) return 'Update Listing';
        if (path.startsWith('/items/')) return 'Item Details';
        if (path === '/transactions') return 'Your Active Orders';
        if (path === '/listings') return 'My Listing Studio';
        if (path === '/chat') return 'Secure Messages';
        if (path === '/settings') return 'Account Settings';
        if (path === '/admin') return 'Moderation Command Center';
        if (path.startsWith('/profile/')) return 'User Profile';
        return 'Overview';
    };

    return (
        <header className="sticky top-0 z-40 px-10 py-6 flex items-center justify-between pointer-events-none">
            {/* Page Context (Title) */}
            <div className="pointer-events-auto">
                <div className="flex items-center gap-3 mb-1">
                    <div className="w-1.5 h-6 bg-brand-600 rounded-full shadow-lg shadow-brand-600/40"></div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">
                        {getPageTitle(location.pathname)}
                    </h2>
                </div>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-4">
                    SecondChance Platform / {location.pathname === '/' ? 'Home' : location.pathname.split('/')[1]}
                </p>
            </div>

            {/* Actions (Notifications) */}
            <div className="pointer-events-auto bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white/50 shadow-xl shadow-gray-200/20">
                <NotificationDropdown />
            </div>
        </header>
    );
};

export default TopHeader;
