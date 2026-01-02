import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../api/categoryService';
import { itemService } from '../api/itemService';

const CreateItem = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        category_id: '',
        title: '',
        description: '',
        condition: 'GOOD',
        price: '',
        images: []
    });

    useEffect(() => {
        categoryService.getAll().then(res => setCategories(res.data.data));
    }, []);

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

        try {
            await itemService.create(data);
            navigate('/');
        } catch (error) {
            console.error("Failed to create item", error);
            alert("Error creating item. Please check all fields.");
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">What are you selling?</h2>
                        <div className="grid grid-cols-2 gap-3">
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => { setFormData({ ...formData, category_id: cat.id }); handleNext(); }}
                                    className={`p-4 rounded-xl border text-center transition-all ${formData.category_id === cat.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Tell us more</h2>
                        <input
                            type="text"
                            placeholder="Title (e.g. iPhone 13 Pro)"
                            className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Description"
                            rows="4"
                            className="w-full p-4 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                        <button onClick={handleNext} disabled={!formData.title || !formData.description} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl disabled:opacity-50">Continue</button>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Condition & Price</h2>
                        <div className="flex gap-2">
                            {['NEW', 'LIKE_NEW', 'GOOD', 'FAIR'].map(cond => (
                                <button
                                    key={cond}
                                    onClick={() => setFormData({ ...formData, condition: cond })}
                                    className={`flex-1 py-3 rounded-lg border text-xs font-bold ${formData.condition === cond ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-500 border-gray-200'}`}
                                >
                                    {cond.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <div className="relative">
                            <span className="absolute left-4 top-4 font-bold text-gray-400">RM</span>
                            <input
                                type="number"
                                placeholder="0.00"
                                className="w-full p-4 pl-12 rounded-xl border border-gray-200 outline-none focus:ring-2 focus:ring-blue-500"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            />
                        </div>
                        <button onClick={handleNext} disabled={!formData.price} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl disabled:opacity-50">Continue</button>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold">Add Photos</h2>
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center">
                            <input
                                type="file"
                                multiple
                                onChange={(e) => setFormData({ ...formData, images: Array.from(e.target.files) })}
                                className="hidden"
                                id="file-upload"
                            />
                            <label htmlFor="file-upload" className="cursor-pointer">
                                <div className="text-gray-400 mb-2">
                                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <div className="text-sm font-medium text-gray-600">Click to upload photos</div>
                            </label>
                            {formData.images.length > 0 && (
                                <div className="mt-4 text-xs text-blue-600 font-bold">{formData.images.length} files selected</div>
                            )}
                        </div>
                        <button onClick={handleSubmit} disabled={loading} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center">
                            {loading ? 'Publishing...' : 'Publish Listing'}
                        </button>
                    </div>
                );
            default: return null;
        }
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-12">
            <div className="mb-8 flex items-center gap-4">
                {step > 1 && (
                    <button onClick={handleBack} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}
                <div className="flex-grow bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-blue-600 h-full transition-all duration-300"
                        style={{ width: `${(step / 4) * 100}%` }}
                    ></div>
                </div>
                <div className="text-sm font-bold text-gray-400">Step {step}/4</div>
            </div>
            {renderStep()}
        </div>
    );
};

export default CreateItem;
