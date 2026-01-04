import React from 'react';
import { useAuth } from '../context/AuthContext';
import { userService } from '../api/userService';
import { useTranslation } from 'react-i18next';

const MyProfile = () => {
    const { user, login } = useAuth();
    const { t } = useTranslation();
    const [formData, setFormData] = React.useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        password_confirmation: '',
    });
    const [loading, setLoading] = React.useState(false);
    const [message, setMessage] = React.useState({ type: '', text: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await userService.updateProfile(formData);
            setMessage({ type: 'success', text: 'Identity updated successfully.' });
            setFormData(prev => ({ ...prev, password: '', password_confirmation: '' }));
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Update sequence failed.';
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-16 px-4">
            <div className="flex flex-col gap-12">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-1 bg-brand-600 rounded-full"></span>
                        <span className="text-brand-600 font-black uppercase tracking-[0.3em] text-[10px]">Security & Identity</span>
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-none">Account Settings</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Visual Card */}
                    <div className="w-full lg:w-1/3">
                        <div className="brand-card p-10 flex flex-col items-center text-center sticky top-12">
                            <div className="w-32 h-32 bg-brand-100 rounded-[2.5rem] flex items-center justify-center text-brand-600 text-5xl font-black shadow-2xl shadow-brand-100 border-8 border-white mb-6">
                                {user?.name.charAt(0)}
                            </div>
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight mb-1">{user?.name}</h2>
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-6">{user?.role}</p>

                            <div className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center gap-2">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Secure Protocol</span>
                            </div>
                        </div>
                    </div>

                    {/* Form Component */}
                    <div className="flex-1">
                        <div className="brand-card p-10">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                {message.text && (
                                    <div className={`p-6 rounded-[1.5rem] text-sm font-black uppercase tracking-widest ${message.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'} animate-in fade-in zoom-in-95 duration-300`}>
                                        {message.text}
                                    </div>
                                )}

                                <div className="space-y-6">
                                    <div className="grid gap-6">
                                        <div className="relative">
                                            <label className="absolute -top-2 left-6 bg-white px-2 text-[10px] font-black text-brand-600 uppercase tracking-widest z-10">Display Name</label>
                                            <input
                                                type="text"
                                                className="w-full p-6 pt-8 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white outline-none transition-all font-black text-xl text-gray-900"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                required
                                            />
                                        </div>

                                        <div className="relative opacity-60">
                                            <label className="absolute -top-2 left-6 bg-white px-2 text-[10px] font-black text-gray-400 uppercase tracking-widest z-10">Email Identifier</label>
                                            <input
                                                type="email"
                                                className="w-full p-6 pt-8 rounded-2xl bg-gray-50 border-none outline-none font-bold text-lg text-gray-500 cursor-not-allowed"
                                                value={formData.email}
                                                disabled
                                            />
                                        </div>
                                    </div>

                                    <div className="py-6 flex items-center gap-4">
                                        <div className="flex-grow h-px bg-gray-100"></div>
                                        <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">Security Protocol</span>
                                        <div className="flex-grow h-px bg-gray-100"></div>
                                    </div>

                                    <div className="grid gap-6">
                                        <div className="relative">
                                            <label className="absolute -top-2 left-6 bg-white px-2 text-[10px] font-black text-brand-600 uppercase tracking-widest z-10">New Access Key</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full p-6 pt-8 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white outline-none transition-all font-black text-xl placeholder:text-gray-200"
                                                value={formData.password}
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>

                                        <div className="relative">
                                            <label className="absolute -top-2 left-6 bg-white px-2 text-[10px] font-black text-brand-600 uppercase tracking-widest z-10">Confirm Access Key</label>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="w-full p-6 pt-8 rounded-2xl bg-gray-50 border-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white outline-none transition-all font-black text-xl placeholder:text-gray-200"
                                                value={formData.password_confirmation}
                                                onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full bg-brand-600 text-white font-black py-6 rounded-[1.5rem] shadow-2xl shadow-brand-600/30 hover:bg-brand-700 transition-all active:scale-95 disabled:opacity-50 text-xl group"
                                >
                                    {loading ? 'Processing...' : (
                                        <span className="flex items-center justify-center gap-3">
                                            Apply Changes
                                            <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                        </span>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;
