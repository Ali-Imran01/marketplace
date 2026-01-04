import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import TopHeader from './components/TopHeader';
import Home from './pages/Home';
import ItemDetail from './pages/ItemDetail';
import Transactions from './pages/Transactions';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import CreateItem from './pages/CreateItem';
import ReviewPage from './pages/ReviewPage';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import Chat from './pages/Chat';
import MyListings from './pages/MyListings';
import UserProfile from './pages/UserProfile';
import MyProfile from './pages/MyProfile';
import VerifyEmail from './pages/VerifyEmail';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <div className="min-h-screen bg-gray-50 flex">
                    <Navbar />
                    <div className="flex-grow flex flex-col min-h-screen relative">
                        <TopHeader />
                        <main className="flex-grow">
                            <Routes>
                                {/* Public Routes */}
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/items/:id" element={<ItemDetail />} />
                                <Route path="/profile/:id" element={<UserProfile />} />

                                {/* Verification Gate Route (Auth only, but unverified) */}
                                <Route path="/verify-email" element={
                                    <ProtectedRoute>
                                        <VerifyEmail />
                                    </ProtectedRoute>
                                } />

                                {/* Fully Protected Routes (Auth + Verified) */}
                                <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
                                <Route path="/chat/:transactionId" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                                <Route path="/items/create" element={<ProtectedRoute><CreateItem /></ProtectedRoute>} />
                                <Route path="/items/edit/:id" element={<ProtectedRoute><CreateItem /></ProtectedRoute>} />
                                <Route path="/transactions" element={<ProtectedRoute><Transactions /></ProtectedRoute>} />
                                <Route path="/reviews/:transactionId" element={<ProtectedRoute><ReviewPage /></ProtectedRoute>} />
                                <Route path="/listings" element={<ProtectedRoute><MyListings /></ProtectedRoute>} />
                                <Route path="/settings" element={<ProtectedRoute><MyProfile /></ProtectedRoute>} />
                            </Routes>
                        </main>
                        <footer className="bg-white border-t py-6 text-center text-gray-500 text-sm">
                            &copy; {new Date().getFullYear()} SecondChance. Built with Care.
                        </footer>
                    </div>
                </div>
            </Router>
        </AuthProvider>
    );
};

export default App;
