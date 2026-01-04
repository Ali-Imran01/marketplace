import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const { user, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState('users'); // users or items

    useEffect(() => {
        if (!isAdmin()) {
            navigate('/');
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const [usersRes, itemsRes] = await Promise.all([
                    api.get('/admin/users'),
                    api.get('/admin/items')
                ]);
                setUsers(usersRes.data);
                setItems(itemsRes.data);
            } catch (error) {
                console.error("Failed to fetch admin data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [isAdmin, navigate]);

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user? All their listings will be removed.')) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            setUsers(users.filter(u => u.id !== userId));
        } catch (error) {
            alert("Failed to delete user");
        }
    };

    const handleDeleteItem = async (itemId) => {
        if (!window.confirm('Are you sure you want to remove this listing?')) return;
        try {
            await api.delete(`/admin/items/${itemId}`);
            setItems(items.filter(i => i.id !== itemId));
        } catch (error) {
            alert("Failed to delete item");
        }
    };

    if (loading) return <div className="p-20 text-center">Loading Authority Dashboard...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="flex justify-between items-center mb-12">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">Admin Control</h1>
                    <p className="text-gray-500 mt-2">Manage the marketplace users and content.</p>
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl">
                    <button
                        onClick={() => setTab('users')}
                        className={`px-6 py-2 rounded-lg font-bold transition-all ${tab === 'users' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setTab('items')}
                        className={`px-6 py-2 rounded-lg font-bold transition-all ${tab === 'items' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Listings
                    </button>
                </div>
            </div>

            {tab === 'users' ? (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-bold text-gray-700">Name</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-700">Email</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-700">Joined</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {users.map(u => (
                                <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{u.name}</td>
                                    <td className="px-6 py-4 text-gray-500">{u.email}</td>
                                    <td className="px-6 py-4 text-gray-400 text-sm">{new Date(u.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeleteUser(u.id)}
                                            className="text-red-500 font-bold text-sm hover:underline"
                                        >
                                            Delete User
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-sm font-bold text-gray-700">Item</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-700">Seller</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-700">Price</th>
                                <th className="px-6 py-4 text-sm font-bold text-gray-700 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {items.map(i => (
                                <tr key={i.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium">{i.title}</div>
                                        <div className="text-xs text-gray-400 uppercase tracking-tighter">{i.category?.name}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{i.user?.name}</td>
                                    <td className="px-6 py-4 font-bold text-blue-600">${parseFloat(i.price).toLocaleString()}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDeleteItem(i.id)}
                                            className="text-red-500 font-bold text-sm hover:underline"
                                        >
                                            Remove Item
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;
