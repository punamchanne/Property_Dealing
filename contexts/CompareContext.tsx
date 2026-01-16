'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CompareContextType {
    compareList: string[];
    addToCompare: (propertyId: string) => boolean;
    removeFromCompare: (propertyId: string) => void;
    isInCompare: (propertyId: string) => boolean;
    clearCompare: () => void;
    compareCount: number;
    maxCompare: number;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

const MAX_COMPARE = 4; // Maximum properties to compare

export function CompareProvider({ children }: { children: ReactNode }) {
    const [compareList, setCompareList] = useState<string[]>([]);

    // Load compare list from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('compareList');
        if (saved) {
            setCompareList(JSON.parse(saved));
        }
    }, []);

    // Save compare list to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('compareList', JSON.stringify(compareList));
    }, [compareList]);

    const addToCompare = (propertyId: string): boolean => {
        if (compareList.length >= MAX_COMPARE) {
            return false; // Cannot add more
        }

        if (!compareList.includes(propertyId)) {
            setCompareList((prev) => [...prev, propertyId]);
            return true;
        }
        return false;
    };

    const removeFromCompare = (propertyId: string) => {
        setCompareList((prev) => prev.filter((id) => id !== propertyId));
    };

    const isInCompare = (propertyId: string) => {
        return compareList.includes(propertyId);
    };

    const clearCompare = () => {
        setCompareList([]);
    };

    return (
        <CompareContext.Provider
            value={{
                compareList,
                addToCompare,
                removeFromCompare,
                isInCompare,
                clearCompare,
                compareCount: compareList.length,
                maxCompare: MAX_COMPARE,
            }}
        >
            {children}
        </CompareContext.Provider>
    );
}

export function useCompare() {
    const context = useContext(CompareContext);
    if (context === undefined) {
        throw new Error('useCompare must be used within a CompareProvider');
    }
    return context;
}
