import React, { useEffect, useState } from 'react';
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

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-900 text-white py-24 px-4 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-200 rounded-full blur-3xl"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <div className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-white/10">
                        The Future of Sustainable Shopping 🌍
                    </div>
                    <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter leading-[0.9]">
                        Your Items. <br />
                        <span className="text-brand-accent">Second</span> Chance.
                    </h1>
                    <p className="text-xl md:text-2xl text-brand-100 mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
                        Join the circular economy. Sell what you don't need, find hidden gems, and build a greener community.
                    </p>

                    <div className="relative max-w-2xl mx-auto group">
                        <input
                            type="text"
                            placeholder="Search listings..."
                            className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-white text-gray-900 text-lg shadow-2xl shadow-brand-900/40 outline-none focus:ring-8 focus:ring-brand-accent/30 transition-all placeholder:text-gray-400 font-semibold"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute left-6 top-6 text-brand-600 group-focus-within:scale-110 transition-transform">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <div className="mt-12 flex flex-wrap justify-center gap-6">
                        <Link to="/items/create" className="bg-brand-accent text-white font-black px-10 py-5 rounded-2xl hover:bg-[#0da271] transition-all hover:scale-105 shadow-2xl shadow-brand-accent/30 active:scale-95">
                            Start Selling Now
                        </Link>
                        <a href="#browse" className="bg-white/10 backdrop-blur-md text-white border-2 border-white/20 font-bold px-10 py-5 rounded-2xl hover:bg-white/20 transition-all active:scale-95">
                            View Marketplace
                        </a>
                    </div>
                </div>
            </section>

            {/* How it Works */}
            <section className="py-24 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-8">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tight">How it works</h2>
                            <p className="text-gray-500 font-medium mt-2">Simple three-step process to get started.</p>
                        </div>
                        <div className="h-1 flex-1 bg-gray-100 rounded-full hidden md:block max-w-lg">
                            <div className="h-full w-1/3 bg-brand-600 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-16 relative">
                        <div className="relative group">
                            <div className="w-20 h-20 bg-brand-50 text-brand-600 rounded-3xl flex items-center justify-center mb-8 text-3xl font-black group-hover:bg-brand-600 group-hover:text-white transition-all duration-500 shadow-xl shadow-brand-100 group-hover:shadow-brand-600/30 group-hover:-translate-y-2">1</div>
                            <h3 className="text-2xl font-black mb-4">Snap & List</h3>
                            <p className="text-gray-500 leading-relaxed font-medium">Take a photo and describe your item. Our "SecondChance" studio makes it look premium.</p>
                        </div>
                        <div className="relative group">
                            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mb-8 text-3xl font-black group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-xl shadow-emerald-100 group-hover:shadow-emerald-600/30 group-hover:-translate-y-2">2</div>
                            <h3 className="text-2xl font-black mb-4">Secure Match</h3>
                            <p className="text-gray-500 leading-relaxed font-medium">Our platform connects you with verified buyers in your local community instantly.</p>
                        </div>
                        <div className="relative group">
                            <div className="w-20 h-20 bg-amber-50 text-amber-600 rounded-3xl flex items-center justify-center mb-8 text-3xl font-black group-hover:bg-amber-600 group-hover:text-white transition-all duration-500 shadow-xl shadow-amber-100 group-hover:shadow-amber-600/30 group-hover:-translate-y-2">3</div>
                            <h3 className="text-2xl font-black mb-4">Exchange</h3>
                            <p className="text-gray-500 leading-relaxed font-medium">Meet in a safe local spot, swap the item, and build your community reputation via reviews.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Browse Section */}
            <main id="browse" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar / Filter Section */}
                    <aside className="w-full lg:w-72 flex-shrink-0">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/40 sticky top-28">
                            <h3 className="font-black text-gray-900 mb-8 flex items-center gap-3">
                                <div className="w-8 h-8 bg-brand-50 text-brand-600 rounded-xl flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                                    </svg>
                                </div>
                                Studio Filters
                            </h3>

                            {/* Price Filter */}
                            <div className="mb-10">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Price Orbit (RM)</label>
                                <div className="flex gap-3">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all"
                                        value={filters.minPrice}
                                        onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        className="w-full px-4 py-3 rounded-xl bg-gray-50 border-transparent text-sm font-bold outline-none focus:bg-white focus:ring-2 focus:ring-brand-500 transition-all"
                                        value={filters.maxPrice}
                                        onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                                    />
                                </div>
                            </div>

                            {/* Condition Filter */}
                            <div className="mb-10">
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Item Integrity</label>
                                <div className="space-y-2">
                                    {['NEW', 'LIKE_NEW', 'GOOD', 'FAIR'].map(cond => (
                                        <label key={cond} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all border ${filters.conditions.includes(cond) ? 'bg-brand-50 border-brand-100 text-brand-700' : 'bg-white border-transparent hover:bg-gray-50 text-gray-500'}`}>
                                            <input
                                                type="checkbox"
                                                className="w-5 h-5 rounded-lg border-gray-200 text-brand-600 focus:ring-brand-500"
                                                checked={filters.conditions.includes(cond)}
                                                onChange={(e) => {
                                                    const newConds = e.target.checked
                                                        ? [...filters.conditions, cond]
                                                        : filters.conditions.filter(c => c !== cond);
                                                    setFilters({ ...filters, conditions: newConds });
                                                }}
                                            />
                                            <span className="text-sm font-bold tracking-tight">
                                                {cond.replace('_', ' ')}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={() => { setSearchQuery(''); setSelectedCategory(null); setFilters({ minPrice: '', maxPrice: '', conditions: [] }); }}
                                className="w-full py-4 text-[10px] font-black text-gray-400 hover:text-red-500 transition-all uppercase tracking-widest border-t border-gray-50 mt-4"
                            >
                                Clear All Parameters
                            </button>
                        </div>
                    </aside>

                    {/* Listings Section */}
                    <div className="flex-1">
                        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                            <div className="w-full overflow-hidden">
                                <div className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide">
                                    <button
                                        onClick={() => setSelectedCategory(null)}
                                        className={`px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedCategory === null ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/30 font-black' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        All Inventory
                                    </button>
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setSelectedCategory(cat.id)}
                                            className={`px-6 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${selectedCategory === cat.id ? 'bg-brand-600 text-white shadow-xl shadow-brand-600/30' : 'bg-white border border-gray-100 text-gray-500 hover:bg-gray-50'}`}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-gray-100 animate-pulse rounded-[2.5rem] aspect-[4/5]"></div>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                                {items.length > 0 ? (
                                    items.map(item => <ItemCard key={item.id} item={item} />)
                                ) : (
                                    <div className="col-span-full text-center py-40 bg-gray-50/50 border-4 border-dashed border-gray-100 rounded-[3rem]">
                                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center text-5xl mx-auto mb-6 shadow-xl shadow-gray-200/50">🔍</div>
                                        <h3 className="text-2xl font-black text-gray-900">End of Inventory</h3>
                                        <p className="text-gray-500 mt-2 font-medium">No items match your exact studio parameters.<br />Try broadening your horizons!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;
