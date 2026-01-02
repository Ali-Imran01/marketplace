import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { transactionService } from '../api/transactionService';
import { Link } from 'react-router-dom';

const Transactions = () => {
    const { t } = useTranslation();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await transactionService.getAll();
                setTransactions(response.data.data);
            } catch (error) {
                console.error("Failed to fetch transactions", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'REQUESTED': return 'bg-yellow-100 text-yellow-800';
            case 'ACCEPTED': return 'bg-blue-100 text-blue-800';
            case 'ITEM_SENT': return 'bg-purple-100 text-purple-800';
            case 'RECEIVED': return 'bg-indigo-100 text-indigo-800';
            case 'COMPLETED': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) {
        return <div className="max-w-7xl mx-auto px-4 py-12 text-center">Loading transactions...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-8">My Transactions</h1>

            <div className="space-y-4">
                {transactions.length > 0 ? (
                    transactions.map(txn => (
                        <div key={txn.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                    {txn.item.images[0] && <img src={txn.item.images[0]} alt="" className="w-full h-full object-cover" />}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">{txn.item.title}</h3>
                                    <p className="text-sm text-gray-500">RM {txn.offered_price.toFixed(2)}</p>
                                    <p className="text-xs text-blue-600 mt-1 uppercase font-semibold">
                                        {txn.seller.name === 'You' ? 'Selling' : 'Buying'}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(txn.status)}`}>
                                    {txn.status}
                                </span>
                                <Link to={`/items/${txn.item.id}`} className="text-sm text-blue-600 hover:underline">
                                    View Item
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200 text-gray-400">
                        No transactions yet.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Transactions;
