import React, {createContext, useContext, useState} from 'react';

type PageType = "home" | "contact" | "cv" | "whatsapp";

interface NavigationContextType {
    currentPage: PageType;
    setCurrentPage: (page: PageType) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({children}: { children: React.ReactNode }) => {
    const [currentPage, setCurrentPage] = useState<PageType>("home");

    return (
        <NavigationContext.Provider value={{currentPage, setCurrentPage}}>
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = () => {
    const context = useContext(NavigationContext);
    if (!context) throw new Error("useNavigation must be used within a NavigationProvider");
    return context;
};