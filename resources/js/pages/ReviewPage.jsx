import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { reviewService } from '../api/reviewService';

const ReviewPage = () => {
    const { transactionId } = useParams();
    const navigate = useNavigate();
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await reviewService.create({
                transaction_id: transactionId,
                rating,
                comment
            });
            navigate('/transactions');
        } catch (error) {
            console.error("Failed to submit review", error);
            alert("An error occurred. Please try again later.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-20">
            <div className="flex flex-col gap-4 mb-12 text-center">
                <div className="flex items-center justify-center gap-2">
                    <span className="w-8 h-1 bg-brand-600 rounded-full"></span>
                    <span className="text-brand-600 font-black uppercase tracking-[0.3em] text-[10px]">Quality Validation</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-black text-gray-900 tracking-tighter leading-none">Share Your Verdict</h1>
                <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] max-w-xs mx-auto">Validate the narrative of your recent exchange.</p>
            </div>

            <div className="brand-card p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-50"></div>

                <form onSubmit={handleSubmit} className="relative z-10 space-y-12">
                    <div className="flex flex-col items-center gap-8">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Scale of Satisfaction</label>
                        <div className="flex justify-center gap-4">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className={`text-6xl transition-all hover:scale-125 hover:rotate-6 active:scale-95 ${rating >= star ? 'text-brand-accent drop-shadow-[0_10px_10px_rgba(255,215,0,0.3)]' : 'text-gray-100'}`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                        <div className="text-2xl font-black text-gray-900 tracking-tighter">
                            {rating === 5 ? 'Superior' : rating === 4 ? 'Exceptional' : rating === 3 ? 'Standard' : rating === 2 ? 'Subpar' : 'Critical'}
                        </div>
                    </div>

                    <div className="relative">
                        <label className="absolute -top-2 left-6 bg-white px-2 text-[10px] font-black text-brand-600 uppercase tracking-widest z-10">Detailed Validation</label>
                        <textarea
                            rows="6"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            className="w-full p-8 rounded-[2rem] bg-gray-50 border-none focus:ring-4 focus:ring-brand-500/10 focus:bg-white outline-none transition-all font-semibold leading-relaxed placeholder:text-gray-200 text-lg"
                            placeholder="Describe the condition and encounter..."
                        ></textarea>
                    </div>

                    <div className="grid gap-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-brand-600 text-white font-black py-6 rounded-[1.5rem] shadow-2xl shadow-brand-600/30 hover:bg-brand-700 transition-all active:scale-95 disabled:opacity-50 text-xl group"
                        >
                            {submitting ? 'Archiving...' : (
                                <span className="flex items-center justify-center gap-3">
                                    Commit Validation
                                    <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                </span>
                            )}
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/transactions')}
                            className="w-full py-4 text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-gray-500 transition-colors"
                        >
                            Abort Process
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewPage;
