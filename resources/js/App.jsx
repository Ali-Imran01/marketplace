import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ItemDetail from './pages/ItemDetail';
import Transactions from './pages/Transactions';
import CreateItem from './pages/CreateItem';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Navbar />
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/items/create" element={<CreateItem />} />
                        <Route path="/items/:id" element={<ItemDetail />} />
                        <Route path="/transactions" element={<Transactions />} />
                    </Routes>
                </main>
                <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} SecondChance. Built with Care.
                </footer>
            </div>
        </Router>
    );
};

export default App;
