import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { userService } from '../api/userService';
import { itemService } from '../api/itemService';
import ItemCard from '../components/ItemCard';

const UserProfile = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const [profileRes, itemsRes] = await Promise.all([
                    userService.getProfile(id),
                    itemService.getAll({ user_id: id })
                ]);
                setProfile(profileRes.data.data);
                setItems(itemsRes.data.data);
            } catch (error) {
                console.error("Failed to fetch profile", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return <div className="max-w-7xl mx-auto p-32 text-center animate-pulse text-gray-400 font-black uppercase tracking-[0.3em]">Profiling Identity...</div>;

    if (!profile) return (
        <div className="text-center py-40">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl shadow-inner">👤</div>
            <h2 className="text-3xl font-black text-gray-900 tracking-tighter">Identity Expired</h2>
            <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2">The requested curator could not be found.</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            {/* High-End Profile Header */}
            <div className="brand-card p-12 mb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-40"></div>
                <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-end gap-12">
                    <div className="w-40 h-40 bg-brand-100 rounded-[3rem] shadow-2xl shadow-brand-100 border-8 border-white flex items-center justify-center text-brand-600 text-6xl font-black transform transition-transform hover:rotate-3">
                        {profile.name.charAt(0)}
                    </div>
                    <div className="flex-grow text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start gap-3 mb-4">
                            <span className="w-8 h-1 bg-brand-600 rounded-full"></span>
                            <span className="text-brand-600 font-black uppercase tracking-[0.3em] text-[10px]">Verified Curator</span>
                        </div>
                        <h1 className="text-6xl lg:text-7xl font-black text-gray-900 tracking-tighter leading-[0.8] mb-4">{profile.name}</h1>
                        <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-[10px]">Active Narrative Since {profile.joined_at}</p>

                        <div className="mt-10 flex flex-wrap justify-center lg:justify-start gap-10">
                            <div className="text-center lg:text-left">
                                <div className="text-3xl font-black text-brand-accent tracking-tighter flex items-center justify-center lg:justify-start gap-2">
                                    <span className="text-xl">★</span> {profile.avg_rating}
                                </div>
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Trust Score</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-3xl font-black text-gray-900 tracking-tighter">{profile.review_count}</div>
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Validations</div>
                            </div>
                            <div className="text-center lg:text-left">
                                <div className="text-3xl font-black text-gray-900 tracking-tighter">{items.length}</div>
                                <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Availabilities</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-12 gap-16">
                {/* Active Placements */}
                <div className="lg:col-span-8">
                    <div className="mb-12 flex items-center justify-between border-b border-gray-100 pb-6">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Current Selection</h2>
                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{items.length} Entries</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        {items.length > 0 ? (
                            items.map(item => <ItemCard key={item.id} item={item} />)
                        ) : (
                            <div className="col-span-full py-20 text-center bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
                                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">The archive is currently empty.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Validation Feed */}
                <div className="lg:col-span-4">
                    <div className="mb-12 flex items-center justify-between border-b border-gray-100 pb-6">
                        <h2 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">Feedbacks</h2>
                    </div>
                    <div className="space-y-8">
                        {profile.reviews && profile.reviews.length > 0 ? (
                            profile.reviews.map(review => (
                                <div key={review.id} className="brand-card p-8 border-none bg-gray-50/50 group/rev">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="flex gap-1 text-brand-accent text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <span key={i} className={i < review.rating ? 'opacity-100' : 'opacity-20'}>★</span>
                                            ))}
                                        </div>
                                        <span className="text-[9px] text-gray-300 font-black uppercase tracking-widest">{review.date}</span>
                                    </div>
                                    <p className="text-gray-900 text-lg font-bold leading-tight mb-8 tracking-tight">"{review.comment}"</p>
                                    <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                                        <div className="w-10 h-10 bg-white rounded-xl shadow-lg shadow-gray-200/50 flex items-center justify-center text-[10px] font-black text-brand-600 border border-gray-50 transition-transform group-hover/rev:scale-110">
                                            {review.buyer_name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest leading-none mb-1">{review.buyer_name}</p>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none italic truncate max-w-[150px]">Acquired {review.item_title}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center bg-gray-50/50 rounded-[3rem] border border-dashed border-gray-200">
                                <p className="text-gray-400 font-black uppercase tracking-widest text-xs">No validation entry found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
