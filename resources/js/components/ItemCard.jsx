import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
    const { t } = useTranslation();

    const conditionColors = {
        'NEW': 'bg-emerald-50 text-emerald-600 border-emerald-100',
        'LIKE_NEW': 'bg-blue-50 text-blue-600 border-blue-100',
        'GOOD': 'bg-amber-50 text-amber-600 border-amber-100',
        'FAIR': 'bg-gray-100 text-gray-600 border-gray-200'
    };

    return (
        <div className="group bg-white rounded-2xl md:rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 overflow-hidden flex flex-col h-full w-full min-w-0">
            <div className="aspect-square bg-gray-50 relative overflow-hidden">
                {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 text-2xl md:text-4xl">
                        🖼️
                    </div>
                )}

                {/* Condition Tag */}
                <div className="absolute top-2 left-2 md:top-4 md:left-4">
                    <span className={`px-2 md:px-3 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[8px] md:text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${conditionColors[item.condition] || 'bg-white/90 text-gray-900 border-white'}`}>
                        {item.condition.replace('_', ' ')}
                    </span>
                </div>

                {/* Quick Action Overlay - Hidden on small mobile */}
                <div className="absolute inset-0 bg-brand-600/0 group-hover:bg-brand-600/10 transition-colors duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100 hidden md:flex">
                    <Link to={`/items/${item.id}`} className="bg-white text-brand-600 font-black px-6 py-3 rounded-2xl shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:bg-brand-600 hover:text-white active:scale-95">
                        View Item →
                    </Link>
                </div>

                {/* Mobile View Button - Clickable area */}
                <Link to={`/items/${item.id}`} className="absolute inset-0 md:hidden z-10" />
            </div>

            <div className="p-3 md:p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2 md:mb-3">
                    <div className="text-[8px] md:text-[10px] font-black text-brand-600 uppercase tracking-widest bg-brand-50 px-1.5 md:px-2 py-0.5 md:py-1 rounded-md md:rounded-lg">
                        {item.category.name}
                    </div>
                </div>

                <h3 className="text-sm md:text-xl font-black text-gray-900 leading-tight mb-2 line-clamp-2 group-hover:text-brand-600 transition-colors">
                    {item.title}
                </h3>

                <div className="mt-auto pt-2 md:pt-4 flex flex-col sm:flex-row sm:items-center justify-between border-t border-gray-50 gap-2">
                    <div className="flex flex-col">
                        <span className="text-[8px] md:text-[10px] text-gray-400 font-black uppercase tracking-widest leading-none">Price</span>
                        <div className="text-lg md:text-2xl font-black text-gray-900 tracking-tighter">
                            <span className="text-[10px] md:text-sm font-bold text-gray-400 mr-0.5">RM</span>
                            {item.price.toFixed(2)}
                        </div>
                    </div>

                    <Link to={`/profile/${item.user.id}`} className="flex items-center gap-1.5 md:gap-2 group/user max-w-[100px] md:max-w-[120px]">
                        <div className="w-5 h-5 md:w-8 md:h-8 rounded-md md:rounded-lg bg-gray-100 flex items-center justify-center text-[8px] md:text-[10px] font-black text-gray-400 group-hover/user:bg-brand-600 group-hover/user:text-white transition-all shrink-0">
                            {item.user.name.charAt(0)}
                        </div>
                        <span className="text-[8px] md:text-[10px] font-bold text-gray-400 group-hover/user:text-brand-600 transition-colors truncate">
                            @{item.user.name}
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;
