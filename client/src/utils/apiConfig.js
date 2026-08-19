/**
 * Smart API Base URL Detection
 * Yeh code automatically check karega ke aap local pe hain ya live.
 */
const getApiBaseUrl = () => {
    // 1. Pehle check karega ke kya Environment variable mein URL set hai?
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL.replace(/\/$/, "");
    }

    // 2. Agar variable nahi milta (Development mode), toh empty string
    // so Vite proxy ("/api") is used locally
    return "";
};

export const API_BASE_URL = getApiBaseUrl();

// Socket.io URL - production mein backend URL, local mein localhost:7000
export const SOCKET_URL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace(/\/$/, "")
    : `http://${window.location.hostname}:7000`;
