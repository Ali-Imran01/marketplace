import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const VerifyEmail = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', content: '' });
    const [timer, setTimer] = useState(60);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
    }, [user, navigate]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(prev => prev - 1), 1000);
            return () => clearInterval(interval);
        }
    }, [timer]);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) return;

        setLoading(true);
        try {
            const res = await api.post('/verify-otp', { email: user.email, otp });
            setMessage({ type: 'success', content: res.data.message });

            // Update user state locally
            const updatedUser = { ...user, email_verified_at: new Date().toISOString() };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setTimeout(() => navigate('/'), 2000);
        } catch (error) {
            setMessage({
                type: 'error',
                content: 'Verification failed. Please check the code and try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        try {
            const res = await api.post('/resend-otp', { email: user.email });
            if (res.data.debug_otp) {
                alert(`DEBUG MODE: Your new OTP is ${res.data.debug_otp}`);
            }
            setMessage({ type: 'success', content: 'New code sent to your email!' });
            setTimer(60);
        } catch (error) {
            setMessage({ type: 'error', content: 'Failed to resend code. Please try again later.' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 bg-[#f8f9fc]">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-12 relative overflow-hidden text-center">
                    <div className="absolute top-0 left-0 w-full h-2 bg-brand-600"></div>

                    <div className="w-24 h-24 bg-brand-50 text-brand-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 text-4xl shadow-xl shadow-brand-100 animate-pulse">
                        📧
                    </div>

                    <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Check your mail</h1>
                    <p className="text-gray-400 font-bold text-[11px] uppercase tracking-widest mb-10">
                        We've sent a code to <br />
                        <span className="text-brand-600 lowercase">{user?.email}</span>
                    </p>

                    {message.content && (
                        <div className={`mb-8 p-4 rounded-2xl text-[11px] font-black uppercase tracking-widest border animate-bounce ${message.type === 'success'
                            ? 'bg-emerald-50 border-emerald-100 text-emerald-600'
                            : 'bg-red-50 border-red-100 text-red-600'
                            }`}>
                            {message.content}
                        </div>
                    )}

                    <form onSubmit={handleVerify}>
                        <div className="mb-10">
                            <input
                                type="text"
                                maxLength="6"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                className="w-full text-center text-5xl font-black tracking-[0.5em] py-6 bg-gray-50 border-none rounded-3xl focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all placeholder:text-gray-200 text-brand-600"
                                required
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length !== 6}
                            className="w-full bg-brand-600 text-white font-black py-5 rounded-2xl hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/30 disabled:opacity-50 disabled:shadow-none active:scale-95"
                        >
                            {loading ? 'Validating...' : 'Verify Identity →'}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-gray-50">
                        <p className="text-[11px] font-bold text-gray-400 mb-4">Didn't receive the code?</p>
                        {timer > 0 ? (
                            <div className="inline-flex items-center gap-2 px-6 py-2 bg-gray-50 rounded-full text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <span className="w-1.5 h-1.5 bg-brand-600 rounded-full animate-ping"></span>
                                Resend in {timer}s
                            </div>
                        ) : (
                            <button
                                onClick={handleResend}
                                className="text-xs font-black text-brand-600 hover:text-brand-700 uppercase tracking-widest transition-colors hover:underline"
                            >
                                Send New Code
                            </button>
                        )}
                    </div>
                </div>

                <footer className="mt-10 text-center">
                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.3em]">&copy; 2026 SecondChance Platform</p>
                </footer>
            </div>
        </div>
    );
};

export default VerifyEmail;
