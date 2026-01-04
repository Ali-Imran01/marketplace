import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const data = await login(credentials);
            if (data.debug_otp) {
                alert(`DEBUG MODE: Your OTP is ${data.debug_otp}. Please write it down.`);
            }
            const from = location.state?.from?.pathname || '/';
            navigate(from);
        } catch (err) {
            setError('The credentials provided do not match our records.');
            console.error('Login error detail:', err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#f8f9fc]">
            <div className="max-w-md w-full">
                {/* Brand Logo - Centered for Auth */}
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-brand-600 rounded-2xl flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-brand-600/30 mb-4 animate-float">
                        S
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter">
                        Second<span className="text-brand-600">Chance</span>
                    </h1>
                </div>

                <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100 border-white/50 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-600 to-indigo-400"></div>

                    <h2 className="text-2xl font-black text-gray-900 mb-2">Welcome Back</h2>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mb-8">Secure Authentication</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl text-[11px] font-bold border border-red-100 animate-shake">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Email Address</label>
                            <input
                                type="email"
                                required
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 font-bold text-gray-900 transition-all outline-none"
                                placeholder="name@example.com"
                                value={credentials.email}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">Password</label>
                            <input
                                type="password"
                                required
                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:ring-2 focus:ring-brand-500 font-bold text-gray-900 transition-all outline-none"
                                placeholder="••••••••"
                                value={credentials.password}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-600 text-white font-black py-5 rounded-2xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/20 active:scale-95 disabled:opacity-50 mt-4 group"
                        >
                            {loading ? 'Authenticating...' : (
                                <span className="flex items-center justify-center gap-2">
                                    Sign In <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </span>
                            )}
                        </button>
                    </form>

                    <div className="mt-10 text-center">
                        <p className="text-sm font-bold text-gray-400">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-brand-600 hover:underline">
                                Create Identity
                            </Link>
                        </p>
                    </div>
                </div>

                <footer className="mt-10 text-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">&copy; 2026 SecondChance Platform</p>
                </footer>
            </div>
        </div>
    );
};

export default Login;
