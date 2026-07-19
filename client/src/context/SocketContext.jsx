import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/apiConfig';

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    const isProduction = window.location.hostname !== "localhost";

    useEffect(() => {
        // Connect with polling first as it's more stable for handshakes
        const socketInstance = io(SOCKET_URL, {
            transports: ['polling', 'websocket'],
            reconnectionAttempts: isProduction ? 2 : 10,
            reconnectionDelay: 3000,
            timeout: 20000,
            autoConnect: !isProduction, // Don't auto-connect on production (Vercel limitation)
        });
        
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('Real-time connection established:', socketInstance.id);
        });

        socketInstance.on('connect_error', (err) => {
            if (isProduction) {
                console.warn('Socket.io is limited on serverless platforms. Real-time features work locally.');
            } else {
                console.warn('Real-time connection pending... (Server might be starting up)');
            }
        });

        socketInstance.on('disconnect', (reason) => {
            if (reason === 'io server disconnect') {
                socketInstance.connect();
            }
            console.log('Real-time connection closed:', reason);
        });

        // Clean up connection on unmount
        return () => {
            if (socketInstance) {
                socketInstance.disconnect();
            }
        };
    }, []);

    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    );
};

