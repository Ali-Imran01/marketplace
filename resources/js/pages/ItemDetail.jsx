import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { itemService } from '../api/itemService';
import { transactionService } from '../api/transactionService';

const ItemDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [requesting, setRequesting] = useState(false);
    const [requested, setRequested] = useState(false);

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const response = await itemService.getById(id);
                setItem(response.data.data);
            } catch (error) {
                console.error("Failed to fetch item", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    const handleInterested = async () => {
        setRequesting(true);
        try {
            await transactionService.create({
                item_id: item.id,
                offered_price: item.price
            });
            setRequested(true);
        } catch (error) {
            console.error("Failed to create transaction", error);
            alert("Failed to express interest. Are you logged in?");
        } finally {
            setRequesting(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="animate-pulse flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-1/2 aspect-square bg-gray-200 rounded-2xl"></div>
                    <div className="flex-1 space-y-4 py-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-10 bg-gray-200 rounded"></div>
                        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-24 bg-gray-200 rounded"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Item not found</h2>
                <button onClick={() => navigate('/')} className="text-blue-600 hover:underline">
                    Back to browse
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Images */}
                <div className="w-full md:w-1/2">
                    <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden border border-gray-100">
                        {item.images && item.images.length > 0 ? (
                            <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Image Available
                            </div>
                        )}
                    </div>
                </div>

                {/* Details */}
                <div className="flex-1">
                    <div className="mb-4">
                        <span className="text-blue-600 font-bold uppercase tracking-widest text-xs">
                            {item.category.name}
                        </span>
                        <h1 className="text-3xl font-extrabold text-gray-900 mt-1">
                            {item.title}
                        </h1>
                    </div>

                    <div className="flex items-center gap-4 mb-6">
                        <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold border border-blue-100 uppercase">
                            {item.condition}
                        </span>
                        <span className="text-2xl font-bold text-blue-600">
                            RM {item.price.toFixed(2)}
                        </span>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm mb-8">
                        <h2 className="text-sm font-bold text-gray-500 uppercase mb-3">Description</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {item.description}
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        {requested ? (
                            <div className="bg-green-50 text-green-700 p-4 rounded-xl border border-green-100 text-center font-bold">
                                Interest expressed! Seller will be notified.
                            </div>
                        ) : (
                            <button
                                onClick={handleInterested}
                                disabled={requesting}
                                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200 disabled:opacity-50"
                            >
                                {requesting ? 'Sending...' : "I'm Interested"}
                            </button>
                        )}
                        <button className="w-full bg-white text-gray-700 font-bold py-4 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
                            Ask a Question
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-100 flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                        <div>
                            <div className="font-bold text-gray-900">{item.user.name}</div>
                            <div className="text-xs text-gray-500">Seller Identity Verified</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ItemDetail;
