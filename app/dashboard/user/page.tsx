'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar, Eye, TrendingUp, Building2 } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import { useWishlist } from '@/contexts/WishlistContext';
import PropertyCard from '@/components/PropertyCard';
import { propertiesAPI } from '@/lib/api';
import { Property } from '@/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function UserDashboardPage() {
    const { wishlist } = useWishlist();
    const [recentProperties, setRecentProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRecentProperties();
    }, []);

    const loadRecentProperties = async () => {
        try {
            const response = await propertiesAPI.getAll({ limit: 4 });
            setRecentProperties(response.data.properties || []);
        } catch (error) {
            console.error('Error loading properties:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            {/* Welcome Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome Back!</h1>
                <p className="text-gray-600 mt-1">Here's what's happening with your property search</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Heart}
                    title="Wishlist"
                    value={wishlist.length}
                    iconColor="text-red-600"
                    iconBg="bg-red-100"
                />
                <StatCard
                    icon={Calendar}
                    title="Upcoming Visits"
                    value={0}
                    iconColor="text-primary-600"
                    iconBg="bg-primary-50"
                />
                <StatCard
                    icon={Eye}
                    title="Properties Viewed"
                    value={12}
                    iconColor="text-red-700"
                    iconBg="bg-red-50"
                />
                <StatCard
                    icon={TrendingUp}
                    title="Saved Searches"
                    value={3}
                    iconColor="text-primary-800"
                    iconBg="bg-primary-100"
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/explore">
                        <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg hover:shadow-md transition-all group">
                            <div className="p-3 bg-primary-700 rounded-lg group-hover:scale-110 transition-transform">
                                <Building2 className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Browse Properties</p>
                                <p className="text-sm text-gray-600">Find your dream home</p>
                            </div>
                        </button>
                    </Link>

                    <Link href="/dashboard/user/wishlist">
                        <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-lg hover:shadow-md transition-all group">
                            <div className="p-3 bg-red-600 rounded-lg group-hover:scale-110 transition-transform">
                                <Heart className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">View Wishlist</p>
                                <p className="text-sm text-gray-600">{wishlist.length} saved properties</p>
                            </div>
                        </button>
                    </Link>

                    <Link href="/dashboard/user/bookings">
                        <button className="w-full flex items-center gap-3 p-4 bg-white border border-primary-100 rounded-lg hover:shadow-md transition-all group">
                            <div className="p-3 bg-white border-2 border-primary-200 rounded-lg group-hover:bg-primary-50 transition-colors">
                                <Calendar className="h-6 w-6 text-primary-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">My Bookings</p>
                                <p className="text-sm text-gray-600">Schedule visits</p>
                            </div>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Recommended Properties */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Recommended for You</h2>
                        <p className="text-sm text-gray-600 mt-1">Based on your preferences</p>
                    </div>
                    <Link href="/explore">
                        <Button variant="outline" className="border-primary-700 text-primary-700 hover:bg-primary-50">
                            View All
                        </Button>
                    </Link>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="w-12 h-12 border-4 border-primary-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading properties...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {recentProperties.map((property, index) => (
                            <motion.div
                                key={property._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <PropertyCard property={property} />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
