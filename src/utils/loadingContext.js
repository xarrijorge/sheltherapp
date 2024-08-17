import React, { createContext, useState, useContext } from 'react';

// Create the LoadingContext
const LoadingContext = createContext();

// Custom hook to use the LoadingContext
export const useLoading = () => useContext(LoadingContext);

// Provider component
export const LoadingProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <LoadingContext.Provider value={{ isLoading, setIsLoading }}>
            {children}
        </LoadingContext.Provider>
    );
};