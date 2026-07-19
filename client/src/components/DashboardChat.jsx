import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { fetchActiveChats, fetchChatHistory, sendChatMessage, addMessage } from "../Features/chatSlice";
import { useSocket } from "../context/SocketContext";
import { Search, Send, MessageSquare } from "lucide-react";

const DashboardChat = () => {
    const dispatch = useDispatch();
    const socket = useSocket();
    const { user } = useSelector(state => state.auth);
    const { activeChats, messages } = useSelector(state => state.chat);
    
    const [selectedGuest, setSelectedGuest] = useState(null);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        dispatch(fetchActiveChats());
    }, [dispatch]);

    useEffect(() => {
        if (selectedGuest) {
            dispatch(fetchChatHistory(selectedGuest._id));
            // Mark as read
            const token = sessionStorage.getItem("token");
            axios.post("/api/chat/mark-read", { roleOrUserId: selectedGuest._id }, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(() => dispatch(fetchActiveChats()));
        }
    }, [selectedGuest, dispatch]);

    useEffect(() => {
        if (messages.length > 0) {
            scrollToBottom();
        }
    }, [messages]);

    useEffect(() => {
        if (!socket || !user) return;

        // Join room based on user ID and role
        const role = user.role === 'admin' ? 'admin' : user.responsibility?.toLowerCase() || 'staff';
        socket.emit('join_room', { userId: user._id, role });

        const handleReceiveMessage = (data) => {
            // Update active chats list
            dispatch(fetchActiveChats());
            
            // If the message is from the currently selected guest, add it to view
            const senderId = typeof data.sender === 'object' ? data.sender._id : data.sender;
            if (selectedGuest && senderId === selectedGuest._id) {
                dispatch(addMessage(data));
            }
        };

        socket.on('receive_message', handleReceiveMessage);

        return () => {
            socket.off('receive_message', handleReceiveMessage);
        };
    }, [socket, user, selectedGuest, dispatch]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim() || !selectedGuest) return;

        try {
            const res = await dispatch(sendChatMessage({
                receiverId: selectedGuest._id,
                message: input
            })).unwrap();

            socket.emit("send_message", res);
            dispatch(addMessage(res));
            setInput("");
            dispatch(fetchActiveChats()); // refresh list to bump to top
        } catch (err) {
            console.error("Error sending message", err);
        }
    };

    return (
        <div className="admin-main-content" style={{ height: 'calc(100vh - 80px)', padding: '20px' }}>
            <div className="premium-card" style={{ display: 'flex', height: '100%', overflow: 'hidden' }}>
                {/* Sidebar */}
                <div style={{ width: '300px', borderRight: '1px solid var(--admin-border)', display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)' }}>
                        <h2 style={{ color: 'var(--admin-text)', fontSize: '20px', margin: 0 }}>Guest Chats</h2>
                    </div>
                    <div style={{ padding: '15px' }}>
                        <div className="admin-search-bar" style={{ background: 'var(--admin-bg)', border: '1px solid var(--admin-border)' }}>
                            <Search size={16} color="var(--admin-text-muted)" />
                            <input type="text" placeholder="Search guests..." style={{ color: 'var(--admin-text)', width: '100%', background: 'transparent', border: 'none', outline: 'none' }} />
                        </div>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {activeChats.length === 0 ? (
                            <p style={{ textAlign: 'center', color: 'var(--admin-text-muted)', padding: '20px' }}>No active chats.</p>
                        ) : (
                            activeChats.map(chat => (
                                <div 
                                    key={chat.user._id} 
                                    onClick={() => setSelectedGuest(chat.user)}
                                    style={{
                                        padding: '15px 20px', 
                                        borderBottom: '1px solid var(--admin-border)',
                                        cursor: 'pointer',
                                        background: selectedGuest?._id === chat.user._id ? 'var(--admin-bg)' : 'transparent',
                                        display: 'flex',
                                        gap: '15px',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dfa974', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {chat.user.name.charAt(0)}
                                    </div>
                                    <div style={{ flex: 1, overflow: 'hidden' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                            <span style={{ fontWeight: '600', color: 'var(--admin-text)', fontSize: '14px' }}>{chat.user.name}</span>
                                            {chat.unread && <span style={{ width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span>}
                                        </div>
                                        <div style={{ color: 'var(--admin-text-muted)', fontSize: '12px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                            {chat.lastMessage}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'var(--admin-bg)', position: 'relative' }}>
                    {selectedGuest ? (
                        <>
                            <div style={{ padding: '20px', borderBottom: '1px solid var(--admin-border)', background: 'var(--admin-sidebar)', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#dfa974', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', boxShadow: '0 4px 10px rgba(223, 169, 116, 0.3)' }}>
                                    {selectedGuest.name.charAt(0)}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ margin: 0, color: 'var(--admin-text)', fontSize: '16px', fontWeight: '700' }}>{selectedGuest.name}</h3>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        <div style={{ width: '8px', height: '8px', background: '#22c55e', borderRadius: '50%' }}></div>
                                        <span style={{ color: 'var(--admin-text-muted)', fontSize: '11px', fontWeight: '500' }}>Active Now</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div style={{ flex: 1, padding: '20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                {messages.length === 0 ? (
                                    <div style={{ textAlign: 'center', color: 'var(--admin-text-muted)', marginTop: '50px' }}>
                                        <MessageSquare size={40} style={{ opacity: 0.5, marginBottom: '10px' }} />
                                        <p>Start chatting with {selectedGuest.name}</p>
                                    </div>
                                ) : (
                                    messages.map((msg, idx) => {
                                        const isMe = msg.sender?._id === user._id || msg.sender === user._id;
                                        return (
                                            <div key={idx} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '70%' }}>
                                                <div style={{ 
                                                    background: isMe ? '#85f242' : 'var(--admin-sidebar)', 
                                                    color: isMe ? '#1a2e05' : 'var(--admin-text)',
                                                    padding: '12px 16px',
                                                    borderRadius: '15px',
                                                    borderBottomRightRadius: isMe ? '4px' : '15px',
                                                    borderBottomLeftRadius: !isMe ? '4px' : '15px',
                                                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                                }}>
                                                    {msg.message}
                                                </div>
                                                <div style={{ fontSize: '10px', color: 'var(--admin-text-muted)', marginTop: '5px', textAlign: isMe ? 'right' : 'left' }}>
                                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            <div style={{ padding: '20px', background: 'var(--admin-sidebar)', borderTop: '1px solid var(--admin-border)' }}>
                                <form onSubmit={handleSend} style={{ display: 'flex', gap: '10px' }}>
                                    <input 
                                        type="text" 
                                        placeholder={`Message ${selectedGuest.name}...`}
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        style={{ flex: 1, padding: '12px 20px', borderRadius: '10px', border: '1px solid var(--admin-border)', background: 'var(--admin-bg)', color: 'var(--admin-text)', outline: 'none' }}
                                    />
                                    <button type="submit" disabled={!input.trim()} style={{ background: '#85f242', color: '#1a2e05', border: 'none', borderRadius: '10px', width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: input.trim() ? 'pointer' : 'not-allowed', opacity: input.trim() ? 1 : 0.5 }}>
                                        <Send size={18} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--admin-text-muted)' }}>
                            <MessageSquare size={60} style={{ opacity: 0.2, marginBottom: '20px' }} />
                            <h3>Select a chat to start messaging</h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DashboardChat;
