"use client"; // Add this line at the top
import React, { createContext, useState, useContext, useEffect } from 'react';

const ClientPermissionContext = createContext();

export const ClientPermissionProvider = ({ children }) => {
    const [clientPermission, setClientPermission] = useState(null);

    useEffect(() => {
        const storedClientPermission = localStorage.getItem('clientPermission');
        if (storedClientPermission) {
            setClientPermission(JSON.parse(storedClientPermission));
        }
    }, []);

    return (
        <ClientPermissionContext.Provider value={{ clientPermission, setClientPermission }}>
            {children}
        </ClientPermissionContext.Provider>
    );
};

export const useClientPermission = () => useContext(ClientPermissionContext);