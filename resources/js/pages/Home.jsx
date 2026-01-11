import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { itemService } from '../api/itemService';
import { categoryService } from '../api/categoryService';
import ItemCard from '../components/ItemCard';
import { Link } from 'react-router-dom';

const Home = () => {
    const { t } = useTranslation();
    const [items, setItems] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        minPrice: '',
        maxPrice: '',
        conditions: []
    });

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [itemsRes, catRes] = await Promise.all([
                    itemService.getAll({
                        category_id: selectedCategory,
                        search: searchQuery,
                        min_price: filters.minPrice,
                        max_price: filters.maxPrice,
                        conditions: filters.conditions.join(',')
                    }),
                    categoryService.getAll()
                ]);
                setItems(itemsRes.data.data);
                setCategories(catRes.data.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        const timeoutId = setTimeout(fetchData, 500);
        return () => clearTimeout(timeoutId);
    }, [selectedCategory, searchQuery, filters]);

    const isSearching = searchQuery.length > 0;

    const [showFilters, setShowFilters] = useState(false);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className={`bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900 text-white overflow-hidden relative transition-all duration-700 ease-in-out ${isSearching ? 'py-12' : 'py-24'}`}>
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-200 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10 px-6">
                    {!isSearching && (
                        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                            <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/10">
                                {t('The Future of Sustainable Shopping 🌍')}
                            </div>
                            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9] break-words">
                                Your Items. <br className="hidden sm:block" />
                                <span className="text-brand-accent">Second</span> Chance.
                            </h1>
                            <p className="text-lg md:text-2xl text-brand-100 mb-12 max-w-2xl mx-auto font-medium leading-relaxed px-4">
                                Join the circular economy. Sell what you don't need, find hidden gems, and build a greener community.
                            </p>
                        </div>
                    )}

                    <div className={`relative w-full max-w-2xl mx-auto group transition-all duration-700 ${isSearching ? 'scale-100 lg:scale-105' : ''}`}>
                        <input
                            type="text"
                            placeholder="Search listings..."
                            className="w-full pl-14 lg:pl-16 pr-8 py-5 lg:py-6 rounded-2xl lg:rounded-[2rem] bg-white text-gray-900 text-base lg:text-lg shadow-2xl shadow-brand-900/40 outline-none focus:ring-8 focus:ring-brand-accent/30 transition-all placeholder:text-gray-400 font-semibold"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute left-5 lg:left-6 top-5 lg:top-6 text-brand-600 group-focus-within:scale-110 transition-transform">
                            <svg className="w-6 h-6 lg:w-8 lg:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    {!isSearching && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 items-center justify-center">
                            <div className="mt-12 flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
                                <Link to="/items/create" className="bg-brand-accent text-white font-black px-8 lg:px-10 py-4 lg:py-5 rounded-xl lg:rounded-2xl hover:bg-[#0da271] transition-all hover:scale-105 shadow-2xl shadow-brand-accent/30 active:scale-95 text-center">
                                    Start Selling Now
                                </Link>
                                <a href="#browse" className="bg-white/10 backdrop-blur-md text-white border-2 border-white/20 font-bold px-8 lg:px-10 py-4 lg:py-5 rounded-xl lg:rounded-2xl hover:bg-white/20 transition-all active:scale-95 text-center">
                                    View Marketplace
                                </a>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* How it Works - Hidden during search */}
            {!isSearching && (
                <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden animate-in fade-in duration-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
                            <div>
                                <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">How it works</h2>
                                <p className="text-gray-500 font-medium mt-2">Simple three-step process to get started.</p>
                            </div>
                            <div className="h-1 flex-1 bg-gray-100 dark:bg-gray-800 rounded-full hidden md:block max-w-lg">
                                <div className="h-full w-1/3 bg-brand-600 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-16 relative">
                            <div className="relative group">
                                <div className="w-20 h-20 bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400 rounded-3xl flex items-center justify-center mb-8 text-3xl font-black group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 shadow-xl shadow-brand-100 dark:shadow-none group-hover:shadow-brand-600/30 group-hover:-translate-y-2">1</div>
                                <h3 className="text-2xl font-black mb-4 dark:text-white">Snap & List</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Take a photo and describe your item. Our "SecondChance" studio makes it look premium.</p>
                            </div>
                            <div className="relative group">
                                <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-3xl flex items-center justify-center mb-8 text-3xl font-black group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-xl shadow-emerald-100 dark:shadow-none group-hover:shadow-emerald-600/30 group-hover:-translate-y-2">2</div>
                                <h3 className="text-2xl font-black mb-4 dark:text-white">Secure Match</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Our platform connects you with verified buyers in your local community instantly.</p>
                            </div>
                            <div className="relative group">
                                <div className="w-20 h-20 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-3xl flex items-center justify-center mb-8 text-3xl font-black group-hover:bg-amber-600 group-hover:text-white transition-all duration-500 shadow-xl shadow-amber-100 dark:shadow-none group-hover:shadow-amber-600/30 group-hover:-translate-y-2">3</div>
                                <h3 className="text-2xl font-black mb-4 dark:text-white">Exchange</h3>
                                <p className="text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Meet in a safe local spot, swap the item, and build your community reputation via reviews.</p>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Browse Section */}
            <main id="browse" className={`max-w-7xl mx-auto px-4 md:px-8 w-full transition-all duration-700 ${isSearching ? 'py-12' : 'py-24'}`}>
                <div className="flex flex-col relative w-full items-center">
                    {/* Discovery Header - Categories & Filter Control */}
                    <div className="w-full flex flex-col md:flex-row items-center justify-between mb-12 gap-6">
                        <div className="flex overflow-x-auto pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 gap-3 scrollbar-hide flex-grow max-w-full">
                            <button
                                onClick={() => setSelectedCategory(null)}
                                className={`px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shrink-0 ${selectedCategory === null ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/30' : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                            >
                                All Inventory
                            </button>
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id)}
                                    className={`px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shrink-0 ${selectedCategory === cat.id ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/30' : 'bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        {/* Filter Toggle Button - Positioned to the right */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center gap-3 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shrink-0 border-2 ${showFilters ? 'bg-brand-600 text-white border-brand-600 shadow-xl shadow-brand-600/20' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:border-brand-600'} group/filter-btn`}
                        >
                            <svg className={`w-4 h-4 transition-transform duration-500 ${showFilters ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            <span>{showFilters ? 'APPLY FILTERS' : 'Studio Filters'}</span>
                        </button>
                    </div>

                    {/* Listings Display - Perfectly Centered Grid */}
                    <div className="w-full flex justify-center">
                        <div className="w-full max-w-6xl">
                            {loading ? (
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8 justify-center">
                                    {[...Array(8)].map((_, i) => (
                                        <div key={i} className="bg-gray-100 dark:bg-gray-900 animate-pulse rounded-2xl md:rounded-[2.5rem] aspect-square md:aspect-[4/5] w-full max-w-[280px]"></div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8 justify-center justify-items-center mx-auto w-fit">
                                    {items.length > 0 ? (
                                        items.map(item => <ItemCard key={item.id} item={item} />)
                                    ) : (
                                        <div className="col-span-full w-full max-w-lg mx-auto text-center py-24 md:py-40 bg-gray-50/50 dark:bg-gray-900/20 border-4 border-dashed border-gray-100 dark:border-gray-800 rounded-[2rem] md:rounded-[3rem] px-6">
                                            <div className="w-16 h-16 md:w-24 md:h-24 bg-white dark:bg-gray-800 rounded-2xl md:rounded-3xl flex items-center justify-center text-4xl md:text-5xl mx-auto mb-6 shadow-xl shadow-gray-200/50 dark:shadow-none">🔍</div>
                                            <h3 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">End of Inventory</h3>
                                            <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 mt-2 font-medium">No items match your exact studio parameters.<br />Try broadening your horizons!</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>

            {/* Portal-based Filter Drawer */}
            {createPortal(
                <div className={`fixed inset-0 z-[200] transition-opacity duration-700 ${showFilters ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-md" onClick={() => setShowFilters(false)} />

                    {/* Drawer Panel */}
                    <aside
                        className={`absolute top-0 right-0 h-full w-80 sm:w-96 lg:w-[450px] bg-white dark:bg-gray-900 shadow-2xl transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${showFilters ? 'translate-x-0' : 'translate-x-full'}`}
                        style={{ right: 0, left: 'auto' }}
                    >
                        <div className="h-full flex flex-col p-8 md:p-12 overflow-y-auto">
                            <div className="flex items-center justify-between mb-12">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-4">
                                    <div className="w-12 h-12 bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 rounded-2xl flex items-center justify-center">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                        </svg>
                                    </div>
                                    Studio Filters
                                </h3>
                                <button onClick={() => setShowFilters(false)} className="p-3 text-gray-400 hover:text-brand-600 transition-all hover:rotate-90">
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {searchQuery && (
                                <div className="flex items-center gap-6 bg-brand-50/50 dark:bg-brand-900/10 px-8 py-6 rounded-[2.5rem] border border-brand-100 dark:border-brand-900/50 mb-12 animate-in fade-in zoom-in duration-500">
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-widest leading-none mb-2">Results for</span>
                                        <span className="text-lg font-black text-gray-900 dark:text-white tracking-tight leading-none italic truncate block">"{searchQuery}"</span>
                                    </div>
                                    <div className="h-8 w-px bg-brand-200/50 dark:bg-brand-800 shrink-0"></div>
                                    <span className="text-[11px] font-black text-brand-600 dark:text-brand-400 leading-none">{items.length} matched</span>
                                </div>
                            )}

                            {/* Price Filter */}
                            <div className="mb-12">
                                <label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Price Orbit (RM)</label>
                                <div className="flex gap-4">
                                    <div className="relative flex-1">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">RM</span>
                                        <input
                                            type="number"
                                            placeholder="Min"
                                            className="w-full pl-12 pr-5 py-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-transparent dark:text-white text-base font-bold outline-none focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-brand-500/20 transition-all"
                                            value={filters.minPrice}
                                            onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                        />
                                    </div>
                                    <div className="relative flex-1">
                                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 font-bold">RM</span>
                                        <input
                                            type="number"
                                            placeholder="Max"
                                            className="w-full pl-12 pr-5 py-5 rounded-2xl bg-gray-50 dark:bg-gray-800 border-transparent dark:text-white text-base font-bold outline-none focus:bg-white dark:focus:bg-gray-700 focus:ring-4 focus:ring-brand-500/20 transition-all"
                                            value={filters.maxPrice}
                                            onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Condition Filter */}
                            <div className="mb-12">
                                <label className="block text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">Item Integrity</label>
                                <div className="grid grid-cols-1 gap-4">
                                    {['NEW', 'LIKE_NEW', 'GOOD', 'FAIR'].map(cond => (
                                        <label key={cond} className={`flex items-center gap-5 p-5 rounded-3xl cursor-pointer transition-all border-2 ${filters.conditions.includes(cond) ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-500 dark:border-brand-500 text-brand-700 dark:text-brand-400 shadow-xl shadow-brand-500/10' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-brand-200 text-gray-500 dark:text-gray-400'}`}>
                                            <input
                                                type="checkbox"
                                                className="w-7 h-7 rounded-xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-brand-600 focus:ring-brand-500 transition-all"
                                                checked={filters.conditions.includes(cond)}
                                                onChange={(e) => {
                                                    const newConds = e.target.checked
                                                        ? [...filters.conditions, cond]
                                                        : filters.conditions.filter(c => c !== cond);
                                                    setFilters({ ...filters, conditions: newConds });
                                                }}
                                            />
                                            <span className="text-base font-black tracking-tight">
                                                {cond.replace('_', ' ')}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto pt-10">
                                <button
                                    onClick={() => { setSearchQuery(''); setSelectedCategory(null); setFilters({ minPrice: '', maxPrice: '', conditions: [] }); }}
                                    className="w-full py-6 text-[12px] font-black text-gray-400 hover:text-red-500 transition-all uppercase tracking-widest border-t-2 border-gray-50 dark:border-gray-800 flex items-center justify-center gap-3 group"
                                >
                                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    Reset Studio Parameters
                                </button>
                            </div>
                        </div>
                    </aside>
                </div>,
                document.body
            )}
        </div>
    );
};

export default Home;
