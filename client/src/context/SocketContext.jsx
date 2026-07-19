import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Use window.location.hostname to avoid issues with different environments
        const backendUrl = `http://${window.location.hostname}:7000`;
        
        // Connect with polling first as it's more stable for handshakes
        const socketInstance = io(backendUrl, {
            transports: ['polling', 'websocket'],
            reconnectionAttempts: 10,
            reconnectionDelay: 3000,
            timeout: 20000,
        });
        
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
            console.log('Real-time connection established:', socketInstance.id);
        });

        socketInstance.on('connect_error', (err) => {
            // This will only log once if it fails, then wait for reconnection
            console.warn('Real-time connection pending... (Server might be starting up)');
        });

        socketInstance.on('disconnect', (reason) => {
            if (reason === 'io server disconnect') {
                // the disconnection was initiated by the server, you need to reconnect manually
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
