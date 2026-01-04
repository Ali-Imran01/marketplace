import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const { user, logout, isAdmin, isVerified } = useAuth();
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Hide Navbar on certain pages
    const hideOn = ['/login', '/register', '/verify-email'];
    if (hideOn.includes(location.pathname)) return null;

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinkClass = (path) => `
        flex items-center gap-4 px-4 py-4 rounded-2xl transition-all duration-500 font-bold group relative whitespace-nowrap
        ${location.pathname === path
            ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/20'
            : 'text-gray-400 hover:text-brand-600 hover:bg-brand-50'}
        ${isCollapsed ? 'justify-center px-0 w-14 mx-auto' : ''}
    `;

    return (
        <aside className={`${isCollapsed ? 'w-24' : 'w-80'} bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen z-50 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1)`}>
            {/* Toggle Button */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-5 top-12 bg-white border border-gray-100 rounded-full w-10 h-10 flex items-center justify-center shadow-xl text-gray-400 hover:text-brand-600 z-50 transition-all hover:scale-110 active:scale-90 group/toggle"
            >
                <svg className={`w-5 h-5 transition-transform duration-700 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <div className={`py-12 px-6 ${isCollapsed ? 'px-2' : ''} flex flex-col h-full overflow-y-auto overflow-x-hidden scrollbar-hide`}>
                {/* Brand Logo */}
                <Link to="/" className={`flex items-center gap-3 mb-16 px-2 transition-all duration-500 ${isCollapsed ? 'justify-center mb-20 px-0' : ''}`}>
                    <div className="w-12 h-12 bg-brand-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-brand-600/40 shrink-0 transform transition-transform">
                        S
                    </div>
                    {!isCollapsed && (
                        <span className="text-2xl font-black text-gray-900 tracking-tighter whitespace-nowrap animate-in fade-in slide-in-from-left-2 duration-500">
                            Second<span className="text-brand-600">Chance</span>
                        </span>
                    )}
                </Link>

                <nav className="space-y-3 flex-grow w-full">
                    {!isCollapsed && <label className="block px-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.25em] mb-4">Marketplace</label>}

                    <Link to="/" className={navLinkClass('/')} title="Discover">
                        <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                        {!isCollapsed && <span>Discover</span>}
                        {isCollapsed && location.pathname === '/' && <div className="absolute right-0 w-1 h-6 bg-brand-600 rounded-l-full"></div>}
                    </Link>

                    {user && (
                        <>
                            <Link to="/transactions" className={navLinkClass('/transactions')} title="My Orders">
                                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                                {!isCollapsed && <span>My Orders</span>}
                                {isCollapsed && location.pathname === '/transactions' && <div className="absolute right-0 w-1 h-6 bg-brand-600 rounded-l-full"></div>}
                            </Link>
                            <Link to="/listings" className={navLinkClass('/listings')} title="My Listings">
                                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                {!isCollapsed && <span>My Listings</span>}
                                {isCollapsed && location.pathname === '/listings' && <div className="absolute right-0 w-1 h-6 bg-brand-600 rounded-l-full"></div>}
                            </Link>

                            <div className="py-6">
                                <Link to="/items/create" className={`flex items-center gap-4 px-4 py-5 rounded-3xl bg-brand-600 text-white hover:bg-brand-700 transition-all duration-500 font-black shadow-2xl shadow-brand-600/30 active:scale-95 group/btn ${isCollapsed ? 'justify-center p-0 w-16 h-16 mx-auto rounded-full' : ''}`} title="Sell Item">
                                    <svg className="w-7 h-7 shrink-0 transition-transform group-hover/btn:rotate-90 duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                    {!isCollapsed && <span className="whitespace-nowrap">Sell Item</span>}
                                </Link>
                            </div>
                        </>
                    )}

                    {!user && (
                        <div className="py-4">
                            <Link to="/login" className={`flex items-center gap-3 px-4 py-4 rounded-2xl border-2 border-brand-600 text-brand-600 hover:bg-brand-50 transition-all duration-300 font-black active:scale-95 ${isCollapsed ? 'justify-center p-0 w-14 h-14 mx-auto' : ''}`} title="Login">
                                {!isCollapsed ? 'Sign In / Join' : 'ID'}
                            </Link>
                        </div>
                    )}

                    <div className="pt-10 space-y-3">
                        {!isCollapsed && <label className="block px-4 text-[10px] font-black text-gray-300 uppercase tracking-[0.25em] mb-4">System</label>}
                        <Link to="/settings" className={navLinkClass('/settings')} title="Settings">
                            <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                            {!isCollapsed && <span>Settings</span>}
                            {isCollapsed && location.pathname === '/settings' && <div className="absolute right-0 w-1 h-6 bg-brand-600 rounded-l-full"></div>}
                        </Link>
                        {isAdmin() && (
                            <Link to="/admin" className={navLinkClass('/admin')} title="Admin Panel">
                                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                {!isCollapsed && <span>Moderation</span>}
                            </Link>
                        )}
                        {user && (
                            <button onClick={handleLogout} className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-500 font-bold active:scale-95 shrink-0 group ${isCollapsed ? 'justify-center px-0 w-14 mx-auto' : ''}`} title="Logout">
                                <svg className="w-6 h-6 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                {!isCollapsed && <span className="whitespace-nowrap">Sign Out</span>}
                            </button>
                        )}
                    </div>
                </nav>

                <div className={`mt-auto pt-10 border-t border-gray-50 flex flex-col items-center gap-8 ${isCollapsed ? 'px-0' : '-mx-2'}`}>
                    {/* Language Switcher */}
                    <div className={`bg-gray-100 p-1.5 rounded-2xl flex transition-all duration-500 ${isCollapsed ? 'flex-col gap-1 w-12' : 'gap-1'}`}>
                        <button
                            onClick={() => changeLanguage('en')}
                            className={`px-3 py-2 text-[10px] font-black rounded-xl transition-all ${i18n.language === 'en' ? 'bg-white text-brand-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            EN
                        </button>
                        <button
                            onClick={() => changeLanguage('bm')}
                            className={`px-3 py-2 text-[10px] font-black rounded-xl transition-all ${i18n.language === 'bm' ? 'bg-white text-brand-600 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                        >
                            BM
                        </button>
                    </div>

                    {user && (
                        <div className={`flex items-center gap-4 w-full p-4 rounded-3xl bg-gray-50 border border-transparent transition-all duration-500 hover:border-brand-100 hover:bg-white group/user ${isCollapsed ? 'justify-center border-none bg-transparent p-0' : ''}`}>
                            <div className="w-12 h-12 rounded-2xl bg-brand-100 flex items-center justify-center text-brand-600 font-black text-xl shrink-0 border-2 border-white shadow-xl shadow-brand-100 transition-transform group-hover/user:scale-105">
                                {user.name.charAt(0)}
                            </div>
                            {!isCollapsed && (
                                <div className="flex-1 overflow-hidden">
                                    <p className="text-sm font-black text-gray-900 truncate">{user.name}</p>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest truncate">{user.role}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Navbar;
