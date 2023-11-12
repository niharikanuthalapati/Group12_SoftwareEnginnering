// UserContext.js
import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const localUser = JSON.parse(localStorage.getItem('user'));
    const [user, setUser] = useState(localUser);

    const logout = () => {
        setUser(null);
        localStorage.clear();
    };

    return (
        <UserContext.Provider value={{ user, setUser, logout }}>
            {children}
        </UserContext.Provider>
    );
};