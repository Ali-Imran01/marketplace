import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { itemService } from '../api/itemService';
import { Link } from 'react-router-dom';

const MyListings = () => {
    const { t } = useTranslation();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyItems();
    }, []);

    const fetchMyItems = async () => {
        setLoading(true);
        try {
            const res = await itemService.getMyItems();
            setItems(res.data.data);
        } catch (error) {
            console.error("Failed to fetch my items", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            await itemService.update(id, { status: newStatus });
            setItems(items.map(item => item.id === id ? { ...item, status: newStatus } : item));
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update status.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this listing?")) return;

        try {
            await itemService.delete(id);
            setItems(items.filter(item => item.id !== id));
        } catch (error) {
            console.error("Failed to delete item", error);
            alert("Failed to delete item.");
        }
    };

    const getStatusInfo = (status) => {
        switch (status) {
            case 'AVAILABLE': return { color: 'bg-emerald-50 text-emerald-600 border-emerald-100', label: 'Active' };
            case 'RESERVED': return { color: 'bg-amber-50 text-amber-600 border-amber-100', label: 'Reserved' };
            case 'SOLD': return { color: 'bg-gray-100/50 text-gray-400 border-gray-100', label: 'Sold' };
            default: return { color: 'bg-gray-50 text-gray-500 border-transparent', label: status };
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                        <span className="w-8 h-1 bg-brand-600 rounded-full"></span>
                        <span className="text-brand-600 font-black uppercase tracking-[0.3em] text-[10px]">Curation Hub</span>
                    </div>
                    <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-none">Your Collection</h1>
                </div>

                <Link to="/items/create" className="w-[240px] bg-brand-600 text-white font-black py-5 rounded-3xl hover:bg-brand-700 transition-all shadow-2xl shadow-brand-600/30 flex items-center justify-center gap-3 active:scale-95 group">
                    <svg className="w-6 h-6 transition-transform group-hover:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                    New Placement
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="aspect-[4/3] bg-gray-50 animate-pulse rounded-[2.5rem] border border-gray-100"></div>
                    ))}
                </div>
            ) : items.length === 0 ? (
                <div className="text-center py-40 brand-card border-none bg-gray-50/50">
                    <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl shadow-gray-200/50 flex items-center justify-center mx-auto mb-10 text-6xl border border-gray-100">📦</div>
                    <h3 className="text-4xl font-black text-gray-900 tracking-tighter mb-4 leading-none">Quiet Archive</h3>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] max-w-xs mx-auto mb-12">
                        You have no active placements in the collection. Initiate your narrative now.
                    </p>
                    <Link to="/items/create" className="inline-block px-12 py-5 bg-black text-white rounded-[2.5rem] font-black uppercase tracking-widest text-xs hover:scale-105 transition-all shadow-2xl">
                        Create Placement →
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {items.map(item => {
                        const statusInfo = getStatusInfo(item.status);
                        return (
                            <div key={item.id} className="brand-card group overflow-hidden h-full flex flex-col">
                                <div className="relative aspect-[4/3] bg-gray-50 overflow-hidden">
                                    {item.images && item.images[0] ? (
                                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-200 gap-2">
                                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                        </div>
                                    )}
                                    <div className="absolute top-6 right-6">
                                        <div className={`${statusInfo.color} border backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black tracking-[0.2em] uppercase shadow-xl transition-all`}>
                                            {statusInfo.label}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-8 flex-grow">
                                    <div className="flex justify-between items-start gap-4 mb-4">
                                        <div className="flex-1">
                                            <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{item.category.name}</p>
                                            <h3 className="text-2xl font-black text-gray-900 leading-tight mb-2 truncate group-hover:text-brand-600 transition-colors uppercase italic">{item.title}</h3>
                                        </div>
                                        <div className="text-2xl font-black text-brand-600 tracking-tighter flex items-center">
                                            <span className="text-[10px] font-bold text-gray-300 mr-1 mt-1">RM</span>
                                            {item.price.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mt-8">
                                        <Link to={`/items/${item.id}`} className="px-5 py-2.5 bg-gray-50 text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-gray-100 transition-all active:scale-95">
                                            Observe
                                        </Link>
                                        <Link to={`/items/${item.id}/edit`} className="px-5 py-2.5 bg-brand-50 text-brand-600 hover:bg-brand-600 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-lg shadow-brand-600/5">
                                            Refine
                                        </Link>

                                        {item.status === 'AVAILABLE' && (
                                            <button onClick={() => handleStatusChange(item.id, 'RESERVED')} className="px-5 py-2.5 bg-amber-50 text-amber-600 hover:bg-amber-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
                                                Hold
                                            </button>
                                        )}
                                        {item.status === 'RESERVED' && (
                                            <button onClick={() => handleStatusChange(item.id, 'AVAILABLE')} className="px-5 py-2.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
                                                Activate
                                            </button>
                                        )}
                                        {item.status !== 'SOLD' && (
                                            <button onClick={() => handleStatusChange(item.id, 'SOLD')} className="px-5 py-2.5 bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all active:scale-95">
                                                Sold
                                            </button>
                                        )}

                                        <button onClick={() => handleDelete(item.id)} className="ml-auto w-10 h-10 rounded-xl flex items-center justify-center text-gray-300 hover:text-rose-500 hover:bg-rose-50 transition-all active:scale-90">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};

export default MyListings;
