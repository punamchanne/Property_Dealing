'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Building2, Eye, Calendar, TrendingUp, Plus, BarChart3, MessageSquare } from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import { Button } from '@/components/ui/button';
import { propertiesAPI } from '@/lib/api';
import Link from 'next/link';

export default function OwnerDashboardPage() {
    const [stats, setStats] = useState({
        totalProperties: 0,
        totalViews: 0,
        pendingBookings: 0,
        activeListings: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await propertiesAPI.getAll({});
            setStats({
                totalProperties: response.data.total || 0,
                totalViews: 1248, // Mock data
                pendingBookings: 5, // Mock data
                activeListings: response.data.properties?.filter((p: any) => p.status === 'available').length || 0,
            });
        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Owner Dashboard</h1>
                    <p className="text-gray-600 mt-1">Manage your properties and track performance</p>
                </div>
                <Link href="/dashboard/owner/add-property">
                    <Button className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
                        <Plus className="h-5 w-5 mr-2" />
                        Add Property
                    </Button>
                </Link>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    icon={Building2}
                    title="Total Properties"
                    value={stats.totalProperties}
                    change={12.5}
                    iconColor="text-primary-600"
                    iconBg="bg-primary-50"
                />
                <StatCard
                    icon={Eye}
                    title="Total Views"
                    value={stats.totalViews}
                    change={8.2}
                    iconColor="text-primary-800"
                    iconBg="bg-primary-100"
                />
                <StatCard
                    icon={Calendar}
                    title="Pending Bookings"
                    value={stats.pendingBookings}
                    iconColor="text-red-500"
                    iconBg="bg-red-50"
                />
                <StatCard
                    icon={TrendingUp}
                    title="Active Listings"
                    value={stats.activeListings}
                    change={15.8}
                    iconColor="text-red-700"
                    iconBg="bg-red-100"
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link href="/dashboard/owner/add-property">
                        <button className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg hover:shadow-md transition-all group">
                            <div className="p-3 bg-primary-700 rounded-lg group-hover:scale-110 transition-transform">
                                <Plus className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Add Property</p>
                                <p className="text-sm text-gray-600">Create new listing</p>
                            </div>
                        </button>
                    </Link>

                    <Link href="/dashboard/owner/properties">
                        <button className="w-full flex items-center gap-3 p-4 bg-white border border-primary-100 rounded-lg hover:shadow-md transition-all group">
                            <div className="p-3 bg-white border-2 border-primary-200 rounded-lg group-hover:bg-primary-50 transition-colors">
                                <Building2 className="h-6 w-6 text-primary-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">My Properties</p>
                                <p className="text-sm text-gray-600">Manage listings</p>
                            </div>
                        </button>
                    </Link>

                    <Link href="/dashboard/owner/analytics">
                        <button className="w-full flex items-center gap-3 p-4 bg-white border border-primary-100 rounded-lg hover:shadow-md transition-all group">
                            <div className="p-3 bg-white border-2 border-primary-200 rounded-lg group-hover:bg-primary-50 transition-colors">
                                <BarChart3 className="h-6 w-6 text-primary-600" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold text-gray-900">Analytics</p>
                                <p className="text-sm text-gray-600">View performance</p>
                            </div>
                        </button>
                    </Link>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Inquiries */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Recent Inquiries</h3>
                        <Link href="/dashboard/owner/messages">
                            <Button variant="ghost" size="sm" className="text-primary-700">
                                View All
                            </Button>
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                    <MessageSquare className="h-5 w-5 text-blue-700" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">Inquiry about Luxury Villa</p>
                                    <p className="text-sm text-gray-500">2 hours ago</p>
                                </div>
                                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full border border-primary-200">
                                    New
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Upcoming Bookings */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-900">Upcoming Bookings</h3>
                        <Link href="/dashboard/owner/bookings">
                            <Button variant="ghost" size="sm" className="text-primary-700">
                                View All
                            </Button>
                        </Link>
                    </div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Calendar className="h-5 w-5 text-orange-700" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">Property Visit - Modern Apartment</p>
                                    <p className="text-sm text-gray-500">Tomorrow, 2:00 PM</p>
                                </div>
                                <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-100">
                                    Pending
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
