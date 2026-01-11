import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import TopHeader from './components/TopHeader';
import Home from './pages/Home';
import ItemDetail from './pages/ItemDetail';
import Transactions from './pages/Transactions';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
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
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const [isCollapsed, setIsCollapsed] = React.useState(false);

    return (
        <AuthProvider>
            <ThemeProvider>
                <Router>
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col lg:flex-row overflow-x-hidden relative transition-colors duration-500">
                        <Navbar
                            isOpen={isMenuOpen}
                            setIsOpen={setIsMenuOpen}
                            isCollapsed={isCollapsed}
                            setIsCollapsed={setIsCollapsed}
                        />
                        <div className={`flex-grow flex flex-col min-h-screen w-full min-w-0 overflow-x-hidden relative transition-all duration-700 ease-in-out ${isCollapsed ? 'lg:ml-24' : 'lg:ml-80'}`}>
                            {/* Note: Margin now dynamically updates based on isCollapsed state */}
                            <TopHeader onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
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
                            <footer className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-6 text-center text-gray-500 dark:text-gray-400 text-sm transition-colors">
                                &copy; {new Date().getFullYear()} SecondChance. Built with Care.
                            </footer>
                        </div>
                    </div>
                </Router>
            </ThemeProvider>
        </AuthProvider>
    );
};

export default App;
