import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { transactionService } from '../api/transactionService';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Transactions = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('buying'); // 'buying' or 'selling'

    const fetchTransactions = async () => {
        try {
            const response = await transactionService.getAll();
            setTransactions(response.data.data);
        } catch (error) {
            console.error("Failed to fetch transactions", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [user]);

    const handleUpdateStatus = async (id, status) => {
        if (status === 'CANCELLED' && !window.confirm("Are you sure you want to cancel this order?")) return;

        try {
            await transactionService.update(id, status);
            fetchTransactions();
        } catch (error) {
            console.error("Failed to update status", error);
            alert("An error occurred. Please try again later.");
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'REQUESTED': return { color: 'bg-amber-100 text-amber-700', label: 'Requested' };
            case 'ACCEPTED': return { color: 'bg-brand-50 text-brand-600', label: 'Accepted' };
            case 'ITEM_SENT': return { color: 'bg-indigo-100 text-indigo-700', label: 'In Transit' };
            case 'RECEIVED': return { color: 'bg-emerald-100 text-emerald-700', label: 'Received' };
            case 'COMPLETED': return { color: 'bg-brand-accent/20 text-brand-accent', label: 'Completed' };
            case 'REJECTED': return { color: 'bg-rose-100 text-rose-700', label: 'Rejected' };
            case 'CANCELLED': return { color: 'bg-gray-100 text-gray-500', label: 'Cancelled' };
            default: return { color: 'bg-gray-100 text-gray-800', label: status };
        }
    };

    const getProgress = (status) => {
        const stages = ['REQUESTED', 'ACCEPTED', 'ITEM_SENT', 'COMPLETED'];
        if (status === 'REJECTED' || status === 'CANCELLED') return -1;
        const index = stages.indexOf(status);
        if (index === -1) return 0;
        return ((index + 1) / stages.length) * 100;
    };

    const filteredTransactions = transactions.filter(txn => {
        if (activeTab === 'buying') return txn.buyer.id === user.id;
        return txn.seller.id === user.id;
    });

    if (loading) return <div className="max-w-7xl mx-auto px-4 py-32 text-center animate-pulse text-gray-400 font-black uppercase tracking-[0.3em]">Synchronizing Activity...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-1 bg-brand-600 rounded-full"></span>
                        <span className="text-brand-600 font-black uppercase tracking-[0.3em] text-[10px]">Operations Center</span>
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-none">Marketplace Activity</h1>
                </div>

                <div className="bg-gray-100/50 p-2 rounded-[1.5rem] flex gap-2 backdrop-blur-sm border border-gray-100">
                    <button
                        onClick={() => setActiveTab('buying')}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'buying' ? 'bg-white text-brand-600 shadow-xl shadow-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {t('Buying')}
                    </button>
                    <button
                        onClick={() => setActiveTab('selling')}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'selling' ? 'bg-white text-brand-600 shadow-xl shadow-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        {t('Selling')}
                    </button>
                </div>
            </div>

            <div className="grid gap-8">
                {filteredTransactions.length > 0 ? (
                    filteredTransactions.map(txn => {
                        const isSeller = txn.seller.id === user.id;
                        const progress = getProgress(txn.status);
                        const statusInfo = getStatusInfo(txn.status);

                        return (
                            <div key={txn.id} className="brand-card group overflow-hidden">
                                <div className="p-10">
                                    <div className="flex flex-col xl:flex-row justify-between gap-12">
                                        {/* Product Context */}
                                        <div className="flex gap-8 items-start flex-1">
                                            <div className="w-32 h-32 bg-gray-50 rounded-[2rem] overflow-hidden shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform duration-700 border border-gray-100">
                                                {txn.item.images[0] ? (
                                                    <img src={txn.item.images[0]} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-200 gap-2">
                                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0 pt-2">
                                                <div className="flex flex-wrap items-center gap-2 mb-4">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl ${isSeller ? 'bg-orange-50 text-orange-600' : 'bg-brand-50 text-brand-600'}`}>
                                                        {isSeller ? 'Outgoing Sale' : 'Inbound Purchase'}
                                                    </span>
                                                    <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-xl ${statusInfo.color} shadow-sm border border-white/50`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                                <h3 className="text-2xl font-black text-gray-900 truncate mb-1 tracking-tight">{txn.item.title}</h3>
                                                <div className="flex items-baseline gap-1 mb-6">
                                                    <span className="text-gray-300 font-bold text-sm">RM</span>
                                                    <span className="text-3xl font-black text-brand-600 tracking-tighter">{txn.offered_price.toLocaleString()}</span>
                                                </div>

                                                <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/50 border border-gray-100 inline-flex group/user cursor-pointer">
                                                    <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-brand-600/20 group-hover/user:scale-110 transition-transform">
                                                        {(isSeller ? txn.buyer.name : txn.seller.name).charAt(0)}
                                                    </div>
                                                    <div className="text-xs">
                                                        <span className="text-gray-400 font-bold uppercase tracking-widest mr-2">{isSeller ? 'Target:' : 'Source:'}</span>
                                                        <span className="text-gray-900 font-black">{isSeller ? txn.buyer.name : txn.seller.name}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Controls */}
                                        <div className="flex flex-col justify-between items-stretch xl:items-end gap-8 xl:min-w-[280px]">
                                            <div className="flex gap-3">
                                                <Link
                                                    to={`/chat/${txn.id}`}
                                                    state={{ receiverId: isSeller ? txn.buyer.id : txn.seller.id }}
                                                    className="flex-1 xl:flex-none inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gray-900 text-white text-sm font-black hover:bg-black transition-all shadow-xl shadow-gray-300/50 active:scale-95 group/msg"
                                                >
                                                    <svg className="w-5 h-5 group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                                                    Secure Chat
                                                </Link>
                                                <Link to={`/items/${txn.item.id}`} className="w-14 h-14 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-600 hover:bg-brand-50 hover:border-brand-100 transition-all active:scale-95">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                                </Link>
                                            </div>

                                            <div className="flex flex-col gap-3">
                                                {/* Action Logic with Branded Buttons */}
                                                {isSeller && txn.status === 'REQUESTED' && (
                                                    <div className="flex gap-2">
                                                        <button onClick={() => handleUpdateStatus(txn.id, 'ACCEPTED')} className="flex-1 px-8 py-4 rounded-2xl bg-emerald-500 text-white text-xs font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 active:scale-95">Approve Listing</button>
                                                        <button onClick={() => handleUpdateStatus(txn.id, 'REJECTED')} className="px-6 py-4 rounded-2xl bg-white border-2 border-rose-100 text-rose-500 hover:bg-rose-50 transition-all">Reject</button>
                                                    </div>
                                                )}
                                                {isSeller && txn.status === 'ACCEPTED' && (
                                                    <button onClick={() => handleUpdateStatus(txn.id, 'ITEM_SENT')} className="w-full px-8 py-4 rounded-2xl bg-brand-600 text-white text-xs font-black uppercase tracking-widest hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/30 active:scale-95">Dispatch Item</button>
                                                )}

                                                {!isSeller && (txn.status === 'REQUESTED' || txn.status === 'ACCEPTED') && (
                                                    <button onClick={() => handleUpdateStatus(txn.id, 'CANCELLED')} className="w-full px-8 py-4 rounded-2xl bg-white border-2 border-gray-100 text-gray-400 text-xs font-black uppercase tracking-widest hover:border-rose-100 hover:text-rose-500 transition-all">Withdraw Offer</button>
                                                )}
                                                {!isSeller && txn.status === 'ITEM_SENT' && (
                                                    <button onClick={() => handleUpdateStatus(txn.id, 'COMPLETED')} className="w-full px-8 py-4 rounded-2xl bg-brand-600 text-white text-xs font-black uppercase tracking-widest hover:bg-brand-700 transition-all shadow-xl shadow-brand-600/30 active:scale-95">Finalize Receipt</button>
                                                )}
                                                {!isSeller && txn.status === 'COMPLETED' && (
                                                    <Link to={`/reviews/${txn.id}`} className="w-full px-8 py-4 rounded-2xl bg-brand-accent text-white text-xs font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-xl shadow-brand-accent/30 text-center">Identity Endorsement ⭐️</Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Intelligence Bar */}
                                    {progress >= 0 && (
                                        <div className="mt-12 pt-8 border-t border-gray-50">
                                            <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                                                <div
                                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-brand-600 to-indigo-400 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1)"
                                                    style={{ width: `${progress}%` }}
                                                >
                                                    <div className="absolute top-0 right-0 w-8 h-full bg-white/20 skew-x-12 translate-x-4 animate-pulse"></div>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-4 mt-6">
                                                {['Request', 'Agreement', 'Transit', 'Archived'].map((label, idx) => (
                                                    <div key={label} className="text-center group/step">
                                                        <div className={`text-[9px] font-black uppercase tracking-widest mb-1 transition-all duration-500 ${progress >= (idx + 1) * 25 ? 'text-brand-600' : 'text-gray-300'}`}>
                                                            {label}
                                                        </div>
                                                        <div className={`w-2 h-2 rounded-full mx-auto transition-all duration-500 ${progress >= (idx + 1) * 25 ? 'bg-brand-600 scale-125' : 'bg-gray-200'}`}></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center py-40 brand-card border-none bg-gray-50/50">
                        <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 flex items-center justify-center mx-auto mb-10 text-6xl border border-gray-100">🔭</div>
                        <h3 className="text-4xl font-black text-gray-900 tracking-tighter mb-4 leading-none">Vacuum of Activity</h3>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] max-w-xs mx-auto mb-12">
                            {activeTab === 'buying' ? "No purchase narratives discovered yet. Seek new items in the collective." : "No sales trajectories initiated. Curate your first listing today."}
                        </p>
                        <Link to="/" className="inline-block px-12 py-5 bg-black text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl">
                            Browse Collection →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
