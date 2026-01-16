'use client';

import { useEffect, useState } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import PropertyCard from '@/components/PropertyCard';
import { Property } from '@/types';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Heart, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function WishlistPage() {
    const { wishlist, wishlistCount } = useWishlist();
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
                setLoading(true);
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/properties`);
                const allProperties = response.data.properties;

                // Filter properties that are in wishlist
                const wishlistProperties = allProperties.filter((prop: Property) =>
                    wishlist.includes(prop._id)
                );

                setProperties(wishlistProperties);
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
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary-700 mx-auto mb-4" />
                    <p className="text-gray-600">Loading your wishlist...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <Heart className="h-8 w-8 text-primary-700 fill-primary-700" />
                        <h1 className="text-4xl font-bold text-gray-900">My Wishlist</h1>
                    </div>
                    <p className="text-gray-600 text-lg">
                        {wishlistCount === 0
                            ? 'You haven\'t saved any properties yet'
                            : `${wishlistCount} ${wishlistCount === 1 ? 'property' : 'properties'} saved`}
                    </p>
                </motion.div>

                {/* Empty State */}
                {properties.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-lg p-12 text-center"
                    >
                        <Heart className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">Your wishlist is empty</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Start exploring properties and save your favorites by clicking the heart icon on any property card.
                        </p>
                        <Link href="/explore">
                            <Button size="lg" className="bg-gradient-to-r from-primary-700 to-primary-900">
                                Explore Properties
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    /* Property Grid */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {properties.map((property, index) => (
                            <motion.div
                                key={property._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <PropertyCard property={property} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
