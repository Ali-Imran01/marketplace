import React from 'react';
import { useLocation } from 'react-router-dom';
import NotificationDropdown from './NotificationDropdown';

const TopHeader = ({ onMenuToggle }) => {
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
        <header className="sticky top-0 z-40 w-full px-4 sm:px-6 lg:px-10 py-4 lg:py-6 flex items-center justify-between pointer-events-none bg-transparent">
            {/* Mobile Menu Trigger & Page Context */}
            <div className="flex items-center gap-4 pointer-events-auto">
                <button
                    onClick={onMenuToggle}
                    className="lg:hidden w-12 h-12 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl flex items-center justify-center text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 transition-all active:scale-95"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>

                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="hidden sm:block w-1.5 h-6 bg-brand-600 rounded-full shadow-lg shadow-brand-600/40"></div>
                        <h2 className="text-lg lg:text-xl font-black text-gray-900 dark:text-white tracking-tight whitespace-nowrap transition-colors">
                            {getPageTitle(location.pathname)}
                        </h2>
                    </div>
                    <p className="hidden sm:block text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] ml-4">
                        SecondChance Platform / {location.pathname === '/' ? 'Home' : location.pathname.split('/')[1]}
                    </p>
                </div>
            </div>

            {/* Actions (Notifications) */}
            <div className="pointer-events-auto bg-white/50 dark:bg-gray-900/50 backdrop-blur-md p-2 rounded-2xl border border-white/50 dark:border-gray-800/50 shadow-xl shadow-gray-200/20 dark:shadow-none transition-colors">
                <NotificationDropdown />
            </div>
        </header>
    );
};

export default TopHeader;
