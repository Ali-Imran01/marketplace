import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { itemService } from '../api/itemService';
import { transactionService } from '../api/transactionService';
import { useAuth } from '../context/AuthContext';

const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const [requested, setRequested] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await itemService.getById(id);
                setItem(response.data.data);
            } catch (error) {
                console.error("Failed to fetch item", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    const handleInterested = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setRequesting(true);
        try {
            const res = await transactionService.create({
                item_id: item.id,
                offered_price: item.price
            });
            // Redirect to chat for this transaction
            navigate(`/chat/${res.data.data.id}`, { state: { receiverId: item.user.id } });
        } catch (error) {
            console.error("Failed to initiate interest", error);
            alert("Error: Transaction might already exist. Check your Orders.");
        } finally {
            setRequesting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="animate-pulse flex flex-col md:flex-row gap-12">
                    <div className="w-full md:w-3/5 aspect-[4/3] bg-gray-100 rounded-[2.5rem]"></div>
                    <div className="flex-1 space-y-6 pt-4">
                        <div className="h-4 bg-gray-100 rounded-full w-1/4"></div>
                        <div className="h-16 bg-gray-100 rounded-[1.5rem] w-full"></div>
                        <div className="h-8 bg-gray-100 rounded-full w-1/3"></div>
                        <div className="h-32 bg-gray-100 rounded-[2rem] w-full"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">Item not found</h2>
                <button onClick={() => navigate('/')} className="text-brand-600 font-black hover:bg-brand-50 px-6 py-3 rounded-xl transition-all">
                    ← Back to Discover
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col lg:flex-row gap-16">
                {/* Visuals Column */}
                <div className="w-full lg:w-3/5 group">
                    <div className="relative aspect-[4/3] bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-gray-200/50 border border-gray-100">
                        {item.images && item.images.length > 0 ? (
                            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <span className="font-black uppercase tracking-[0.2em] text-xs">No Visual Available</span>
                            </div>
                        )}
                        <div className="absolute top-6 left-6">
                            <span className="bg-white/90 backdrop-blur-md text-brand-600 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl border border-white/50">
                                {item.condition.replace('_', ' ')}
                            </span>
                        </div>
                    </div>

                    {/* Meta Info */}
                    <div className="mt-8 sm:mt-10 grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                        <div className="bg-gray-100/30 p-4 sm:p-6 rounded-3xl border border-gray-100/50">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Category</p>
                            <p className="font-black text-gray-900 text-sm sm:text-base truncate">{item.category.name}</p>
                        </div>
                        <div className="bg-gray-100/30 p-4 sm:p-6 rounded-3xl border border-gray-100/50">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Status</p>
                            <p className="font-black text-emerald-500 text-sm sm:text-base">Available</p>
                        </div>
                        <div className="bg-gray-100/30 p-4 sm:p-6 rounded-3xl border border-gray-100/50 col-span-2 sm:col-span-1">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Location</p>
                            <p className="font-black text-gray-900 text-sm sm:text-base truncate">Kuala Lumpur</p>
                        </div>
                    </div>
                </div>

                {/* Content Column */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="w-8 h-1 bg-brand-600 rounded-full"></span>
                            <span className="text-brand-600 font-black uppercase tracking-[0.3em] text-[10px]">Product Identity</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[0.9] tracking-tighter mb-6 break-words">
                            {item.title}
                        </h1>
                        <div className="flex items-baseline gap-2">
                            <span className="text-gray-400 font-bold text-xl sm:text-2xl tracking-tighter">RM</span>
                            <span className="text-5xl sm:text-6xl font-black text-brand-600 tracking-tighter leading-none">
                                {item.price.toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="brand-card p-6 sm:p-10 mb-8 flex-grow">
                        <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.25em] mb-6 flex items-center gap-3">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                            Narrative
                        </h2>
                        <p className="text-gray-700 leading-relaxed text-base sm:text-lg font-medium whitespace-pre-wrap">
                            {item.description}
                        </p>
                    </div>

                    <div className="grid gap-4">
                        {user && user.id === item.user.id ? (
                            <Link
                                to={`/items/${item.id}/edit`}
                                className="w-full bg-gray-900 text-white font-black py-6 rounded-3xl hover:bg-black transition-all shadow-2xl text-center active:scale-95"
                            >
                                Edit Selection →
                            </Link>
                        ) : (
                            <>
                                {requested ? (
                                    <div className="bg-emerald-50 text-emerald-600 p-6 rounded-3xl border border-emerald-100 text-center font-black uppercase tracking-widest text-sm shadow-xl shadow-emerald-500/10">
                                        Identity Shared! Check Chat.
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleInterested}
                                        disabled={requesting}
                                        className="w-full bg-brand-600 text-white font-black py-6 rounded-3xl hover:bg-brand-700 transition-all shadow-2xl shadow-brand-600/30 active:scale-95 disabled:opacity-50 text-xl group"
                                    >
                                        {requesting ? 'Processing...' : (
                                            <span className="flex items-center justify-center gap-3">
                                                I'm Interested
                                                <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                                            </span>
                                        )}
                                    </button>
                                )}
                                <button className="w-full bg-white text-gray-500 font-bold py-5 rounded-3xl border border-gray-100 hover:bg-gray-50 transition-all active:scale-95">
                                    Inquiry & Questions
                                </button>
                            </>
                        )}
                    </div>

                    {/* Seller Profile Card */}
                    <div className="mt-12 p-6 rounded-[2rem] bg-gray-50/50 border border-gray-100 flex items-center gap-6 group/seller">
                        <Link to={`/profile/${item.user.id}`} className="w-16 h-16 bg-brand-100 rounded-2xl flex items-center justify-center text-brand-600 text-2xl font-black shadow-xl shadow-brand-100 border-4 border-white transform transition-transform group-hover/seller:scale-110">
                            {item.user.name.charAt(0)}
                        </Link>
                        <div className="flex-1">
                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-0.5">Curated By</p>
                            <Link to={`/profile/${item.user.id}`} className="text-xl font-black text-gray-900 hover:text-brand-600 transition-colors">{item.user.name}</Link>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-1.5 h-1.5 bg-brand-accent rounded-full animate-pulse"></div>
                                <span className="text-[10px] text-gray-400 font-black uppercase tracking-tighter">Verified Curator</span>
                            </div>
                        </div>
                        <Link to={`/profile/${item.user.id}`} className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-gray-400 hover:text-brand-600 hover:shadow-xl transition-all border border-gray-100">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;
