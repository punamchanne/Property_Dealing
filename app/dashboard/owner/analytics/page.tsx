'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { propertiesAPI } from '@/lib/api';
import { Property } from '@/types';
import StatCard from '@/components/admin/StatCard';
import { Eye, TrendingUp, Users, Calendar } from 'lucide-react';
import { Loader2 } from 'lucide-react';

export default function OwnerAnalyticsPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            // In a real app, you'd calculate these on the backend
            // for now, we fetch properties and aggregate client-side
            const response = await propertiesAPI.getMyProperties();
            setProperties(response.data.properties);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            </div>
        );
    }

    // Calculate stats
    const totalViews = properties.reduce((acc, curr) => acc + (curr.views || 0), 0);
    const totalProperties = properties.length;
    const activeProperties = properties.filter(p => p.status === 'available' && p.approved).length;
    // Mock inquiries count for now as we don't have separate inquiry API without messages logic
    const totalInquiries = Math.round(totalViews * 0.05);

    const topProperties = [...properties]
        .sort((a, b) => (b.views || 0) - (a.views || 0))
        .slice(0, 5);

    const maxViews = topProperties[0]?.views || 100;

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-500 mt-1">Performance insights for your listings</p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Eye}
                    title="Total Views"
                    value={totalViews}
                    change={12.5} // Mock change
                    iconColor="text-primary-600"
                    iconBg="bg-primary-50"
                />
                <StatCard
                    icon={Users}
                    title="Total Inquiries"
                    value={totalInquiries}
                    change={8.2}
                    iconColor="text-primary-700"
                    iconBg="bg-primary-100"
                />
                <StatCard
                    icon={TrendingUp}
                    title="Active Listings"
                    value={activeProperties}
                    iconColor="text-red-500"
                    iconBg="bg-red-50"
                />
                <StatCard
                    icon={Calendar}
                    title="Days Active"
                    value={45} // Mock
                    iconColor="text-primary-800"
                    iconBg="bg-primary-50"
                />
            </div>

            {/* Top Performing Properties Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-primary-100 p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">Top Performing Properties</h2>
                <div className="space-y-6">
                    {topProperties.map((property, index) => (
                        <div key={property._id} className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="font-medium text-gray-700 truncate max-w-[200px] md:max-w-xs">{property.title}</span>
                                <span className="text-gray-500">{property.views || 0} views</span>
                            </div>
                            <div className="relative h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((property.views || 0) / maxViews) * 100}%` }}
                                    transition={{ duration: 0.8, delay: index * 0.1 }}
                                    className="absolute h-full bg-primary-600 rounded-full"
                                />
                            </div>
                        </div>
                    ))}
                    {topProperties.length === 0 && (
                        <p className="text-center text-gray-500 py-4">No data available yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
}
