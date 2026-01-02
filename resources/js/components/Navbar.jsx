import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { t, i18n } = useTranslation();

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        localStorage.setItem('language', lng);
    };

    return (
        <nav className="bg-white shadow-sm sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-bold text-blue-600">
                            SecondChance
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button onClick={() => changeLanguage('en')} className={`text-sm ${i18n.language === 'en' ? 'font-bold' : ''}`}>EN</button>
                        <button onClick={() => changeLanguage('bm')} className={`text-sm ${i18n.language === 'bm' ? 'font-bold' : ''}`}>BM</button>
                        <Link to="/transactions" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                            My Orders
                        </Link>
                        <Link to="/items/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-sm shadow-blue-200">
                            Sell
                        </Link>
                        <Link to="/login" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
