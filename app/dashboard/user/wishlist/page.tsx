'use client';

import { useState, useEffect } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { propertiesAPI } from '@/lib/api';
import { Property } from '@/types';
import PropertyCard from '@/components/PropertyCard';
import { Loader2, Heart, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function WishlistPage() {
    const { wishlist } = useWishlist();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWishlistProperties = async () => {
            if (wishlist.length === 0) {
                setProperties([]);
                setLoading(false);
                return;
            }

            try {
                // Fetch property details for each ID in the wishlist
                // In a real production app, you'd want a backend endpoint that accepts an array of IDs
                // to avoid N+1 requests, e.g., POST /properties/batch { ids: [...] }
                // For now, consistent with current API structure:
                const promises = wishlist.map((id) =>
                    propertiesAPI.getById(id).catch(() => null)
                );

                const responses = await Promise.all(promises);

                // Filter out null responses and extract data
                const fetchedProperties = responses
                    .filter((res) => res && res.data)
                    .map((res) => res!.data);

                // Deduplicate properties based on _id to prevent key errors
                const uniqueProperties = Array.from(new Map(fetchedProperties.map((item) => [item._id, item])).values());

                setProperties(uniqueProperties);
            } catch (error) {
                console.error('Error fetching wishlist properties:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchWishlistProperties();
    }, [wishlist]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-[#C62828]" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
                    <p className="text-gray-500 mt-1">Properties you've saved for later</p>
                </div>
                <div className="bg-[#F3D6D6]/50 px-4 py-2 rounded-lg border border-[#C62828]/20">
                    <span className="text-[#C62828] font-medium">{properties.length} Saved</span>
                </div>
            </div>

            {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {properties.filter(p => p && p._id).map((property, index) => (
                        <motion.div
                            key={`wishlist-${property._id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                        >
                            <PropertyCard property={property} />
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 bg-white rounded-xl border border-dashed border-[#C62828]/30">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F3D6D6]/50 mb-4">
                        <Heart className="h-8 w-8 text-[#C62828]" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                        Start exploring properties and save the ones you love to your wishlist.
                    </p>
                    <Link href="/explore">
                        <Button className="bg-[#C62828] hover:bg-[#A81E1E]">
                            <Search className="mr-2 h-4 w-4" />
                            Explore Properties
                        </Button>
                    </Link>
                </div>
            )}
        </div>
    );
}
