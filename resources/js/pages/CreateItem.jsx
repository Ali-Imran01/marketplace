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
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        category_id: '',
        title: '',
        description: '',
        condition: 'GOOD',
        price: '',
        images: []
    });

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
                    setStep(2);
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
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
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-2">Identify</h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Step 01 — Classification</p>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-gray-50 rounded-3xl animate-pulse"></div>)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-4">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => { setFormData({ ...formData, category_id: cat.id }); handleNext(); }}
                                        className={`p-8 rounded-[2rem] border-2 text-left transition-all group relative overflow-hidden ${formData.category_id === cat.id
                                            ? 'bg-brand-600 text-white border-brand-600 shadow-2xl shadow-brand-600/30'
                                            : 'bg-white text-gray-900 border-gray-100 hover:border-brand-200 hover:shadow-xl hover:shadow-gray-200/50'}`}
                                    >
                                        <p className="font-black text-xl tracking-tight relative z-10">{cat.name}</p>
                                        <div className={`absolute -right-4 -bottom-4 w-16 h-16 rounded-full transition-all duration-500 ${formData.category_id === cat.id ? 'bg-white/10 scale-150' : 'bg-brand-50 group-hover:bg-brand-100 group-hover:scale-125'}`}></div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-2">Details</h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Step 02 — Narrative</p>
                        </div>

                        <div className="space-y-6">
                            <div className="relative">
                                <label className="absolute -top-2 left-6 bg-white px-2 text-[10px] font-black text-brand-600 uppercase tracking-widest z-10">Product Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Vintage Camera"
                                    className="w-full p-6 pt-8 rounded-3xl bg-gray-50 border-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white outline-none transition-all font-black text-xl placeholder:text-gray-200"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="relative">
                                <label className="absolute -top-2 left-6 bg-white px-2 text-[10px] font-black text-brand-600 uppercase tracking-widest z-10">Description</label>
                                <textarea
                                    placeholder="Tell the story of this item..."
                                    rows="6"
                                    className="w-full p-6 pt-8 rounded-3xl bg-gray-50 border-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white outline-none transition-all font-semibold leading-relaxed placeholder:text-gray-200"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                ></textarea>
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={!formData.title || !formData.description}
                            className="w-full bg-brand-600 text-white font-black py-6 rounded-3xl shadow-2xl shadow-brand-600/20 hover:bg-brand-700 transition-all active:scale-95 disabled:opacity-50 text-xl"
                        >
                            Next Chapter
                        </button>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-2">Value</h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Step 03 — Condition & Price</p>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 ml-2">Select Condition</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {['NEW', 'LIKE_NEW', 'GOOD', 'FAIR'].map(cond => (
                                        <button
                                            key={cond}
                                            onClick={() => setFormData({ ...formData, condition: cond })}
                                            className={`py-4 rounded-2xl border-2 font-black transition-all ${formData.condition === cond
                                                ? 'bg-brand-50 text-brand-600 border-brand-600'
                                                : 'bg-white text-gray-400 border-gray-100 hover:border-brand-100 hover:text-gray-600'}`}
                                        >
                                            {cond.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="relative">
                                <label className="absolute -top-2 left-6 bg-white px-2 text-[10px] font-black text-brand-600 uppercase tracking-widest z-10">Listing Price (RM)</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-gray-200">RM</span>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        className="w-full p-6 pl-20 rounded-3xl bg-gray-50 border-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white outline-none transition-all font-black text-4xl placeholder:text-gray-200"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleNext}
                            disabled={!formData.price}
                            className="w-full bg-brand-600 text-white font-black py-6 rounded-3xl shadow-2xl shadow-brand-600/20 hover:bg-brand-700 transition-all active:scale-95 disabled:opacity-50 text-xl"
                        >
                            Confirm Value
                        </button>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div>
                            <h2 className="text-4xl font-black text-gray-900 tracking-tighter leading-none mb-2">Visuals</h2>
                            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Step 04 — Media Selection</p>
                        </div>

                        <div className="relative group/upload">
                            <input
                                type="file"
                                multiple
                                onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files) })}
                                className="hidden"
                                id="file-upload"
                            />
                            <label
                                htmlFor="file-upload"
                                className="cursor-pointer block border-4 border-dashed border-gray-100 rounded-[3rem] p-16 text-center hover:border-brand-600/30 hover:bg-brand-50/30 transition-all duration-500 group"
                            >
                                <div className="w-24 h-24 bg-brand-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 text-brand-600 transition-transform group-hover:scale-110 group-hover:rotate-6">
                                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div className="text-2xl font-black text-gray-900 mb-2">Impactful Photos</div>
                                <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">Select files to upload</div>

                                {formData.images.length > 0 && (
                                    <div className="mt-6 flex justify-center gap-2">
                                        {formData.images.map((_, i) => (
                                            <div key={i} className="w-3 h-3 bg-brand-600 rounded-full animate-bounce" style={{ animationDelay: `${i * 100}ms` }}></div>
                                        ))}
                                    </div>
                                )}
                            </label>
                        </div>

                        <button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-gray-900 text-white font-black py-8 rounded-[2rem] shadow-2xl hover:bg-black transition-all active:scale-95 disabled:opacity-50 text-2xl flex items-center justify-center gap-4"
                        >
                            {loading ? (
                                <span className="flex items-center gap-3">
                                    <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Publishing...
                                </span>
                            ) : (
                                <>
                                    <span>{isEdit ? 'Update Selection' : 'Launch Listing'}</span>
                                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                                </>
                            )}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-16">
            <div className="mb-16 flex items-center gap-8">
                {step > 1 && (
                    <button onClick={handleBack} className="w-14 h-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 hover:text-brand-600 hover:shadow-xl transition-all active:scale-90">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
                <div className="flex-grow flex flex-col gap-3">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] font-black text-brand-600 uppercase tracking-[0.3em]">Marketplace Studio</span>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Workflow {step}/4</span>
                    </div>
                    <div className="bg-gray-100 h-3 rounded-full overflow-hidden relative shadow-inner">
                        <div
                            className="bg-brand-600 h-full transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) relative shadow-lg shadow-brand-600/30"
                            style={{ width: `${(step / 4) * 100}%` }}
                        >
                            <div className="absolute top-0 right-0 w-8 h-full bg-white/20 skew-x-12 translate-x-4"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="brand-card p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                {renderStep()}
            </div>
        </div>
    );
};

export default CreateItem;
