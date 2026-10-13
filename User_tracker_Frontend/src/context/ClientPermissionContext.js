import React, { createContext, useState, useContext, useEffect } from 'react';
import { safeJsonParse } from '../utils/helpers';

const ClientPermissionContext = createContext();

export const ClientPermissionProvider = ({ children }) => {
    const [clientPermission, setClientPermission] = useState(null);

    useEffect(() => {
        const storedClientPermission = localStorage.getItem('clientPermission');
        if (storedClientPermission) {
            setClientPermission(safeJsonParse(storedClientPermission, []));
        }
    }, []);

    return (
        <ClientPermissionContext.Provider value={{ clientPermission, setClientPermission }}>
            {children}
        </ClientPermissionContext.Provider>
    );
};

export const useClientPermission = () => useContext(ClientPermissionContext);