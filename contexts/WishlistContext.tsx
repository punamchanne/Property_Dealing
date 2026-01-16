'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
    wishlist: string[];
    addToWishlist: (propertyId: string) => void;
    removeFromWishlist: (propertyId: string) => void;
    isInWishlist: (propertyId: string) => boolean;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlist, setWishlist] = useState<string[]>([]);

    // Load wishlist from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('wishlist');
        if (saved) {
            setWishlist(JSON.parse(saved));
        }
    }, []);

    // Save wishlist to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const addToWishlist = (propertyId: string) => {
        setWishlist((prev) => {
            if (!prev.includes(propertyId)) {
                return [...prev, propertyId];
            }
            return prev;
        });
    };

    const removeFromWishlist = (propertyId: string) => {
        setWishlist((prev) => prev.filter((id) => id !== propertyId));
    };

    const isInWishlist = (propertyId: string) => {
        return wishlist.includes(propertyId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlist,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                wishlistCount: wishlist.length,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
