import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { categoryService } from '../api/categoryService';
import { itemService } from '../api/itemService';
import api from '../api/axios';

const CreateItem = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        category_id: '',
        title: '',
        description: '',
        condition: 'GOOD',
        price: '',
        images: []
    });

    const [imagePreviews, setImagePreviews] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const catRes = await categoryService.getAll();
                setCategories(catRes.data.data || []);

                if (isEdit) {
                    const itemRes = await itemService.getById(id);
                    const item = itemRes.data.data;
                    setFormData({
                        category_id: item.category.id,
                        title: item.title,
                        description: item.description,
                        condition: item.condition,
                        price: item.price,
                        images: []
                    });
                    // In edit mode, we might want to skip images if not changing them
                    // but for this studio flow, let's keep it consistent
                }
            } catch (err) {
                console.error("Failed to fetch data:", err);
                setError("Could not load necessary data.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEdit]);

    const handleNext = () => setStep(s => s + 1);
    const handleBack = () => setStep(s => s - 1);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData({ ...formData, images: files });

        // Generate previews
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleSubmit = async (e) => {
        if (e) e.preventDefault();
        setIsPublishing(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'images') {
                formData.images.forEach(img => data.append('images[]', img));
            } else {
                data.append(key, formData[key]);
            }
        });

        if (isEdit) data.append('_method', 'PUT');

        try {
            if (isEdit) {
                await api.post(`/items/${id}`, data);
            } else {
                await itemService.create(data);
            }
            navigate(isEdit ? '/listings' : '/');
        } catch (error) {
            console.error("Failed to save item", error);
            alert("Error saving item.");
        } finally {
            setIsPublishing(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1: // Visual Studio
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="text-center">
                            <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-4">Visual Studio</h2>
                            <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Step 01 — Capture the Essence</p>
                        </div>

                        <div className="relative group/studio">
                            {/* Studio Glow Effect */}
                            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-600/20 to-indigo-600/20 rounded-[4rem] blur-2xl opacity-0 group-hover/studio:opacity-100 transition-opacity duration-1000"></div>

                            <input
                                type="file"
                                multiple
                                onChange={handleImageChange}
                                className="hidden"
                                id="file-upload"
                                accept="image/*"
                            />
                            <label
                                htmlFor="file-upload"
                                className={`relative cursor-pointer block border-4 border-dashed rounded-[3.5rem] p-12 md:p-20 text-center transition-all duration-700 overflow-hidden
                                    ${imagePreviews.length > 0
                                        ? 'border-brand-600/50 bg-brand-50/10 dark:bg-brand-900/10'
                                        : 'border-gray-100 dark:border-gray-800 hover:border-brand-400 dark:hover:border-brand-600 hover:bg-gray-50/50 dark:hover:bg-gray-800/30'}`}
                            >
                                {imagePreviews.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {imagePreviews.map((url, i) => (
                                            <div key={i} className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative group/preview">
                                                <img src={url} alt="Preview" className="w-full h-full object-cover transition-transform duration-700 group-hover/preview:scale-110" />
                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/preview:opacity-100 transition-opacity"></div>
                                            </div>
                                        ))}
                                        <div className="aspect-square rounded-3xl border-4 border-dashed border-brand-200 dark:border-brand-900 flex items-center justify-center text-brand-400 hover:text-brand-600 transition-colors">
                                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="w-24 h-24 bg-brand-600 text-white rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-brand-600/40 relative z-10">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-3">Drop into the Studio</h3>
                                        <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">High quality photos sell 3x faster</p>
                                    </>
                                )}
                            </label>
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={formData.images.length === 0 && !isEdit}
                            className="w-full bg-brand-600 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-brand-600/30 hover:bg-brand-700 transition-all active:scale-95 disabled:opacity-50 text-xl group"
                        >
                            <span>Initialize Identity</span>
                            <svg className="w-6 h-6 inline-block ml-3 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                );
            case 2: // Item DNA
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="text-center">
                            <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-4">Item DNA</h2>
                            <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Step 02 — Defining Characteristics</p>
                        </div>

                        <div className="space-y-8">
                            {/* Title Input */}
                            <div className="relative group">
                                <label className="absolute -top-2 left-8 bg-white dark:bg-gray-900 px-3 text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.2em] z-10 transition-colors group-focus-within:text-brand-500">Product Designation</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Rare 1970s Film Projector"
                                    className="w-full p-8 pt-10 rounded-[2.5rem] bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-brand-600/20 dark:focus:border-brand-600/20 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-black text-2xl placeholder:text-gray-200 dark:placeholder:text-gray-700 dark:text-white"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            {/* Category Grid */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 ml-4">Classification</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setFormData({ ...formData, category_id: cat.id })}
                                            className={`p-6 rounded-3xl border-2 text-left transition-all relative overflow-hidden group
                                                ${formData.category_id === cat.id
                                                    ? 'bg-brand-600 text-white border-brand-600 shadow-xl shadow-brand-600/30'
                                                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-300 border-gray-100 dark:border-gray-800 hover:border-brand-200 dark:hover:border-brand-800'}`}
                                        >
                                            <span className="font-black tracking-tight relative z-10">{cat.name}</span>
                                            <div className={`absolute -right-2 -bottom-2 w-12 h-12 rounded-full transition-all duration-500 ${formData.category_id === cat.id ? 'bg-white/10 scale-150' : 'bg-brand-50 dark:bg-brand-900/20 group-hover:scale-125'}`}></div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Condition selection */}
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-4 ml-4">Integrity Level</label>
                                <div className="flex flex-wrap gap-3">
                                    {['NEW', 'LIKE_NEW', 'GOOD', 'FAIR'].map(cond => (
                                        <button
                                            key={cond}
                                            onClick={() => setFormData({ ...formData, condition: cond })}
                                            className={`px-6 py-4 rounded-2xl border-2 font-black transition-all text-xs uppercase tracking-widest
                                                ${formData.condition === cond
                                                    ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 border-brand-600 dark:border-brand-600'
                                                    : 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-gray-800 hover:border-brand-100 dark:hover:border-brand-900'}`}
                                        >
                                            {cond.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={!formData.title || !formData.category_id}
                            className="w-full bg-brand-600 text-white font-black py-6 rounded-[2rem] shadow-2xl shadow-brand-600/30 hover:bg-brand-700 transition-all active:scale-95 disabled:opacity-50 text-xl group"
                        >
                            <span>Build Proposition</span>
                            <svg className="w-6 h-6 inline-block ml-3 transition-transform group-hover:translate-x-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7" /></svg>
                        </button>
                    </div>
                );
            case 3: // The Proposition
                return (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="text-center">
                            <h2 className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter leading-none mb-4">The Proposition</h2>
                            <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-[0.2em] text-[10px]">Step 03 — Narrative & Valuation</p>
                        </div>

                        <div className="space-y-8">
                            <div className="relative group">
                                <label className="absolute -top-2 left-8 bg-white dark:bg-gray-900 px-3 text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.2em] z-10">Item Backstory</label>
                                <textarea
                                    placeholder="Where did it come from? Why are you passing it on?"
                                    rows="6"
                                    className="w-full p-8 pt-10 rounded-[2.5rem] bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-brand-600/20 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-semibold leading-relaxed placeholder:text-gray-200 dark:placeholder:text-gray-700 dark:text-white"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>

                            <div className="relative group">
                                <label className="absolute -top-2 left-8 bg-white dark:bg-gray-900 px-3 text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.2em] z-10">Market Valuation (RM)</label>
                                <div className="relative">
                                    <span className="absolute left-8 top-1/2 -translate-y-1/2 text-4xl font-black text-gray-200 dark:text-gray-700 transition-colors group-focus-within:text-brand-600/30">RM</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full p-8 pl-24 rounded-[2.5rem] bg-gray-50 dark:bg-gray-800/50 border-2 border-transparent focus:border-brand-600/20 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all font-black text-5xl placeholder:text-gray-200 dark:placeholder:text-gray-700 dark:text-white"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={isPublishing || !formData.price || !formData.description}
                            className="w-full bg-gray-900 dark:bg-white text-white dark:text-black font-black py-8 rounded-[2.5rem] shadow-2xl hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 text-2xl flex items-center justify-center gap-4 group"
                        >
                            {isPublishing ? (
                                <span className="flex items-center gap-3">
                                    <div className="w-6 h-6 border-4 border-white/30 dark:border-black/30 border-t-white dark:border-t-black rounded-full animate-spin"></div>
                                    Syncing with Blockchain...
                                </span>
                            ) : (
                                <>
                                    <span>{isEdit ? 'Authorize Update' : 'Launch into Marketplace'}</span>
                                    <svg className="w-8 h-8 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                </>
                            )}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-24">
            <div className="max-w-2xl mx-auto mb-16">
                <div className="flex items-center gap-8">
                    {step > 1 && (
                        <button onClick={handleBack} className="w-16 h-16 rounded-[2rem] bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-400 hover:text-brand-600 hover:shadow-2xl transition-all active:scale-90 shadow-sm">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    <div className="flex-grow flex flex-col gap-4">
                        <div className="flex justify-between items-end px-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] font-black text-brand-600 dark:text-brand-400 uppercase tracking-[0.4em] mb-1">SecondChance Matrix</span>
                                <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-[0.1em]">Studio Listing Flow</h4>
                            </div>
                            <span className="text-[12px] font-black text-gray-400 dark:text-gray-500 tabular-nums">Sequence 0{step} / 03</span>
                        </div>
                        <div className="bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden relative shadow-inner">
                            <div
                                className="bg-gradient-to-r from-brand-600 to-indigo-600 h-full transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) relative"
                                style={{ width: `${(step / 3) * 100}%` }}
                            >
                                <div className="absolute top-0 right-0 w-12 h-full bg-white/20 skew-x-[30deg] translate-x-4 animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="brand-card p-8 md:p-16 relative overflow-hidden bg-white/80 dark:bg-gray-900/80 backdrop-blur-3xl border-gray-100 dark:border-gray-800 shadow-[0_32px_128px_-32px_rgba(0,0,0,0.1)]">
                {/* Decorative background elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

                {renderStep()}
            </div>

            <div className="mt-12 text-center text-[10px] font-black text-gray-300 dark:text-gray-700 uppercase tracking-[0.5em]">
                Protected by SecondChance Studio Protocol v2.4
            </div>
        </div>
    );
};

export default CreateItem;
