import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="aspect-square bg-gray-200 relative">
                {item.images && item.images.length > 0 ? (
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                    </div>
                )}
                <div className="absolute top-2 right-2">
                    <span className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-semibold text-gray-700">
                        {item.condition}
                    </span>
                </div>
            </div>
            <div className="p-4">
                <div className="text-xs text-blue-600 font-semibold mb-1 uppercase tracking-wider">
                    {item.category.name}
                </div>
                <h3 className="text-lg font-bold text-gray-900 truncate mb-1">
                    {item.title}
                </h3>
                <div className="text-xl font-bold text-blue-600">
                    RM {item.price.toFixed(2)}
                </div>
                <div className="mt-3">
                    <Link to={`/items/${item.id}`} className="block w-full text-center bg-blue-50 text-blue-600 font-semibold py-2 rounded-lg hover:bg-blue-600 hover:text-white transition-colors duration-200">
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ItemCard;
