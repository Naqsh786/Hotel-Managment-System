import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../context/SocketContext";
import axios from "axios";
import { fetchChatHistory, sendChatMessage, addMessage } from "../Features/chatSlice";
import { MessageSquare, X, Send, User, Lock } from "lucide-react";
import "./FloatingChat.css";

const FloatingChat = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null); // 'admin', 'manager', 'receptionist'
    const [input, setInput] = useState("");
    
    const { user, token } = useSelector(state => state.auth);
    const { messages } = useSelector(state => state.chat);
    
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const socket = useSocket();
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen && selectedRole && token) {
            dispatch(fetchChatHistory(selectedRole));
            // Mark as read
            axios.post("/api/chat/mark-read", { roleOrUserId: selectedRole }, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }
    }, [isOpen, selectedRole, dispatch, token]);

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    useEffect(() => {
        if (!socket || !user) return;

        socket.emit('join_room', { userId: user._id });

        const handleReceiveMessage = (data) => {
            const senderId = typeof data.sender === 'object' ? data.sender._id : data.sender;
            const senderRole = typeof data.sender === 'object' ? data.sender.role : null;
            const senderResponsibility = typeof data.sender === 'object' ? data.sender.responsibility : null;

            // Check if message is for the currently selected role or from them
            if (isOpen && selectedRole) {
                const isFromSelectedRole = senderRole === selectedRole || senderResponsibility?.toLowerCase() === selectedRole;
                const isFromMe = senderId === user._id;

                if (isFromMe || isFromSelectedRole) {
                    dispatch(addMessage(data));
                }
            } else {
                dispatch(addMessage(data));
            }
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket, user, isOpen, selectedRole, dispatch]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedRole) return;

        try {
            const res = await dispatch(sendChatMessage({
                receiverRole: selectedRole,
                message: input
            })).unwrap();

            socket.emit("send_message", res);
            dispatch(addMessage(res));
            setInput("");
        } catch (err) {
            console.error("Error sending message", err);
        }
    };

    // If staff or admin, don't show the floating guest widget. They have it in dashboard.
    if (user && user.role !== "user") return null;

    return (
        <div className={`floating-chat-container ${isOpen ? "open" : ""}`}>
            {isOpen && (
                <div className="chat-window-premium">
                    {!token ? (
                        <div className="chat-auth-view">
                            <div className="chat-header">
                                <h3>Sona Chat Support</h3>
                                <button className="close-btn" onClick={() => setIsOpen(false)}><X size={18} /></button>
                            </div>
                            <div className="auth-content">
                                <Lock size={40} color="#dfa974" style={{ marginBottom: '15px' }} />
                                <h4>Members Only</h4>
                                <p>Please log in to chat with our support team.</p>
                                <button className="btn-sona-primary" onClick={() => navigate('/login')}>Login to Chat</button>
                            </div>
                        </div>
                    ) : !selectedRole ? (
                        <div className="chat-role-view">
                            <div className="chat-header">
                                <h3>Who do you want to talk to?</h3>
                                <button className="close-btn" onClick={() => setIsOpen(false)}><X size={18} /></button>
                            </div>
                            <div className="role-options">
                                <button onClick={() => setSelectedRole('admin')} className="role-btn">
                                    <div className="icon"><User size={20} /></div>
                                    <div className="info">
                                        <span className="title">Admin</span>
                                        <span className="desc">General inquiries & support</span>
                                    </div>
                                </button>
                                <button onClick={() => setSelectedRole('manager')} className="role-btn">
                                    <div className="icon"><User size={20} /></div>
                                    <div className="info">
                                        <span className="title">Manager</span>
                                        <span className="desc">Management & complaints</span>
                                    </div>
                                </button>
                                <button onClick={() => setSelectedRole('receptionist')} className="role-btn">
                                    <div className="icon"><User size={20} /></div>
                                    <div className="info">
                                        <span className="title">Receptionist</span>
                                        <span className="desc">Bookings & room info</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="chat-active-view">
                            <div className="chat-header with-back">
                                <div className="flex items-center gap-10">
                                    <button className="back-btn" onClick={() => setSelectedRole(null)}>&larr;</button>
                                    <div className="flex-col">
                                        <h3>Chat with {selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</h3>
                                        <span className="online-status">Online</span>
                                    </div>
                                </div>
                                <button className="close-btn" onClick={() => setIsOpen(false)}><X size={18} /></button>
                            </div>
                            
                            <div className="chat-messages">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={`message-bubble ${msg.sender?._id === user._id || msg.sender === user._id ? "sent" : "received"}`}>
                                        <div className="msg-text">{msg.message}</div>
                                        <div className="msg-time">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <form className="chat-input-area" onSubmit={handleSend}>
                                <input 
                                    type="text" 
                                    placeholder="Type your message..." 
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                />
                                <button type="submit" disabled={!input.trim()} className="send-btn">
                                    <Send size={18} />
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            )}
            
            <button className="chat-toggle" onClick={() => setIsOpen(!isOpen)}>
                {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
            </button>
        </div>
    );
};

export default FloatingChat;
