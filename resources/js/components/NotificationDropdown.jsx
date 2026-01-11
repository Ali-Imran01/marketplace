import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import notificationService from '../api/notificationService';
import { useAuth } from '../context/AuthContext';

const NotificationDropdown = () => {
    const { isAuthenticated, isVerified, user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        if (!isAuthenticated || !isVerified) return;
        try {
            const res = await notificationService.getAll();
            setNotifications(res.data.notifications.data);
            setUnreadCount(res.data.unread_count);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        if (isAuthenticated && isVerified) {
            fetchNotifications();

            // Listen for private notifications
            const channel = window.Echo.private(`App.Models.User.${user.id}`)
                .notification((notification) => {
                    console.log("New notification received", notification);
                    setNotifications(prev => [
                        {
                            id: notification.id,
                            data: notification,
                            created_at: new Date().toISOString(),
                            read_at: null
                        },
                        ...prev
                    ]);
                    setUnreadCount(prev => prev + 1);
                });

            return () => {
                window.Echo.leave(`App.Models.User.${user.id}`);
            };
        }
    }, [isAuthenticated, isVerified, user?.id]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleRead = async (notification) => {
        if (!notification.read_at) {
            await notificationService.markRead(notification.id);
            setUnreadCount(prev => Math.max(0, prev - 1));
        }

        setIsOpen(false);

        // Navigate based on type
        if (notification.data.type === 'new_message') {
            navigate(`/chat/${notification.data.transaction_id}`);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                aria-label="Notifications"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-[10px] font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full border-2 border-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
                        <span className="font-bold text-gray-800">Notifications</span>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => notificationService.markAllRead().then(fetchNotifications)}
                                className="text-xs text-blue-600 font-bold hover:underline"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length > 0 ? (
                            notifications.map(n => (
                                <div
                                    key={n.id}
                                    onClick={() => handleRead(n)}
                                    className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-blue-50/50 transition-colors ${!n.read_at ? 'bg-blue-50/20' : ''}`}
                                >
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs font-bold">
                                            {n.data.sender_name?.charAt(0) || 'N'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-900">{n.data.sender_name}</p>
                                            <p className="text-xs text-gray-500 line-clamp-1">{n.data.content}</p>
                                            <span className="text-[10px] text-gray-400 mt-1 block">
                                                {new Date(n.created_at).toLocaleString()}
                                            </span>
                                        </div>
                                        {!n.read_at && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-gray-400 italic">
                                No new alerts for now.
                            </div>
                        )}
                    </div>
                    <div className="p-3 bg-gray-50 text-center border-t">
                        <span className="text-xs text-gray-500 font-medium">Safe & Secure Marketplace</span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
