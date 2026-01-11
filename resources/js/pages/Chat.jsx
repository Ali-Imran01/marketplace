import React, { useState, useEffect, useRef } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import chatService from '../api/chatService';
import notificationService from '../api/notificationService';
import { useAuth } from '../context/AuthContext';

const Chat = () => {
    const { transactionId } = useParams();
    const location = useLocation();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [transaction, setTransaction] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [receiverId, setReceiverId] = useState(location.state?.receiverId);
    const scrollRef = useRef();

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await chatService.getMessages(transactionId);
                const data = res.data;
                setMessages(data.messages);
                setTransaction(data.transaction);

                if (!receiverId) {
                    const otherId = data.buyer_id === user.id ? data.seller_id : data.buyer_id;
                    setReceiverId(otherId);
                }

                await notificationService.markTransactionRead(transactionId);
            } catch (error) {
                console.error("Failed to load messages", error);
            } finally {
                setLoading(false);
            }
        };

        if (transactionId) {
            fetchMessages();

            // Real-time listening
            const channel = window.Echo.private(`chat.${transactionId}`)
                .listen('MessageSent', (e) => {
                    setMessages((prev) => {
                        // Check if message already exists (to avoid duplicates from local append)
                        if (prev.find(m => m.id === e.id)) return prev;
                        return [...prev, e];
                    });
                });

            return () => {
                channel.stopListening('MessageSent');
            };
        }
    }, [transactionId, user.id, receiverId]);

    useEffect(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !receiverId) return;

        try {
            const res = await chatService.sendMessage({
                transaction_id: transactionId,
                receiver_id: receiverId,
                content: newMessage
            });
            setMessages([...messages, res.data]);
            setNewMessage('');
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    if (loading) return <div className="p-20 text-center text-gray-400 font-black uppercase tracking-widest animate-pulse">Establishing Connection...</div>;

    const chatHeader = transaction ? (
        <div className="flex flex-col">
            <h2 className="font-black text-gray-900 tracking-tight leading-tight">
                {transaction.item.title}
            </h2>
            <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.2em] mt-1">
                Seller: <span className="text-brand-600 font-black">{transaction.seller.name}</span>
            </p>
        </div>
    ) : (
        <h2 className="font-black text-gray-900 tracking-tight">Chat regarding Transaction #{transactionId}</h2>
    );

    return (
        <div className="max-w-4xl mx-auto px-0 lg:px-4 lg:py-8 h-[calc(100vh-64px)] lg:h-[calc(100vh-160px)] flex flex-col">
            <div className="brand-card flex-grow flex flex-col overflow-hidden rounded-none lg:rounded-[3rem] border-none lg:border">
                <div className="px-6 sm:px-8 py-4 sm:py-6 border-b bg-white flex justify-between items-center relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-600 to-indigo-400"></div>
                    {chatHeader}
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center text-brand-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </div>
                </div>

                <div className="flex-grow overflow-y-auto p-8 space-y-6 bg-gray-50/20">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender_id === user.id ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-[75%] px-6 py-4 rounded-3xl text-sm shadow-sm transition-all hover:shadow-md ${msg.sender_id === user.id
                                ? 'bg-brand-600 text-white rounded-br-none shadow-brand-600/10'
                                : 'bg-white text-gray-800 rounded-bl-none border border-gray-100'
                                }`}>
                                <p className="font-medium leading-relaxed">{msg.content}</p>
                                <span className={`text-[9px] mt-2 block font-black uppercase tracking-widest opacity-60 ${msg.sender_id === user.id ? 'text-right' : 'text-left'
                                    }`}>
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div ref={scrollRef} />
                </div>

                <form onSubmit={handleSend} className="p-4 lg:p-6 bg-white border-t flex space-x-2 lg:space-x-3 items-center">
                    <input
                        type="text"
                        className="flex-grow px-5 py-3 lg:px-6 lg:py-4 rounded-2xl lg:rounded-2xl bg-gray-50 focus:bg-white focus:ring-4 focus:ring-brand-500/10 outline-none transition-all font-semibold text-gray-900 border-none"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-brand-600 text-white w-12 h-12 lg:w-auto lg:px-8 lg:py-4 rounded-full lg:rounded-2xl font-black shadow-xl shadow-brand-600/20 hover:bg-brand-700 transition-all active:scale-95 flex items-center justify-center lg:gap-2 group shrink-0"
                    >
                        <span className="hidden lg:inline">Send</span>
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Chat;
