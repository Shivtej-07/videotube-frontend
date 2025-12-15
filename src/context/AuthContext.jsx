import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            try {
                // Check if we have a valid session
                const response = await api.get('/users/current-user');
                if (response.data?.data) {
                    setUser(response.data.data);
                }
            } catch (err) {
                // Not logged in or session expired
                console.log("No active session");
            } finally {
                setLoading(false);
            }
        };

        checkUser();
    }, []);

    const login = async (data) => {
        // This function assumes the caller has already performed the API login call 
        // and just passes user data, OR we can make the API call here.
        // Let's make the API call here to be self-contained, or just update state.
        // Actually, for flexibility, let's let the component do the API call usually, 
        // but updating the state here is key. 
        // Let's fetch the current user again to ensure we have the full profile.

        // If data is passed (the user object), use it.
        // Otherwise fetch it.
        if (data) {
            setUser(data);
        } else {
            const response = await api.get('/users/current-user');
            setUser(response.data.data);
        }
    };

    const logout = async () => {
        try {
            await api.post('/users/logout');
            setUser(null);
        } catch (err) {
            console.error("Logout failed", err);
            // Force logout on frontend anyway
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
