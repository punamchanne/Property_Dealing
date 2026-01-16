'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Users,
    Clock,
    TrendingUp,
    Plus,
    CheckCircle,
    FileText,
} from 'lucide-react';
import StatCard from '@/components/admin/StatCard';
import { Button } from '@/components/ui/button';
import { propertiesAPI } from '@/lib/api';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalProperties: 0,
        activeUsers: 0,
        pendingApprovals: 0,
        totalMeetings: 0,
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
                activeUsers: 156, // Mock data
                pendingApprovals: response.data.properties?.filter((p: any) => !p.approved).length || 0,
                totalMeetings: 42, // Mock data
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
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="text-gray-600 mt-1">Welcome back, Admin! Here's what's happening today.</p>
                </div>
                <Button className="bg-gradient-to-r from-primary-700 to-primary-900 text-white">
                    <Plus className="h-5 w-5 mr-2" />
                    Add Property
                </Button>
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
                    icon={Users}
                    title="Active Users"
                    value={stats.activeUsers}
                    change={8.2}
                    iconColor="text-primary-700"
                    iconBg="bg-primary-100"
                />
                <StatCard
                    icon={Clock}
                    title="Pending Approvals"
                    value={stats.pendingApprovals}
                    change={-3.1}
                    iconColor="text-red-500"
                    iconBg="bg-red-50"
                />
                <StatCard
                    icon={TrendingUp}
                    title="Total Meetings"
                    value={stats.totalMeetings}
                    change={15.8}
                    iconColor="text-primary-800"
                    iconBg="bg-primary-50"
                />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <button className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary-50 to-primary-100 rounded-lg hover:shadow-md transition-all group">
                        <div className="p-3 bg-primary-700 rounded-lg group-hover:scale-110 transition-transform">
                            <Plus className="h-6 w-6 text-white" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">Add Property</p>
                            <p className="text-sm text-gray-600">Create new listing</p>
                        </div>
                    </button>

                    <button className="flex items-center gap-3 p-4 bg-white border border-primary-100 rounded-lg hover:shadow-md transition-all group">
                        <div className="p-3 bg-white border-2 border-primary-200 rounded-lg group-hover:bg-primary-50 transition-colors">
                            <CheckCircle className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">Approve Listings</p>
                            <p className="text-sm text-gray-600">{stats.pendingApprovals} pending</p>
                        </div>
                    </button>

                    <button className="flex items-center gap-3 p-4 bg-white border border-primary-100 rounded-lg hover:shadow-md transition-all group">
                        <div className="p-3 bg-white border-2 border-primary-200 rounded-lg group-hover:bg-primary-50 transition-colors">
                            <FileText className="h-6 w-6 text-primary-600" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-gray-900">View Reports</p>
                            <p className="text-sm text-gray-600">Analytics & insights</p>
                        </div>
                    </button>
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Properties */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Properties</h3>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white border border-primary-50 rounded-lg hover:bg-primary-50 transition-colors">
                                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                    <Building2 className="h-6 w-6 text-primary-700" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">Luxury Villa in Mumbai</p>
                                    <p className="text-sm text-gray-500">2 hours ago</p>
                                </div>
                                <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-100">
                                    Pending
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Users */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-xl p-6 shadow-md border border-gray-100"
                >
                    <h3 className="text-lg font-bold text-gray-900 mb-4">New Users</h3>
                    <div className="space-y-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 bg-white border border-primary-50 rounded-lg hover:bg-primary-50 transition-colors">
                                <div className="w-12 h-12 bg-white border-2 border-primary-100 rounded-full flex items-center justify-center font-bold text-primary-700">
                                    U{i}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">User Name {i}</p>
                                    <p className="text-sm text-gray-500">user{i}@example.com</p>
                                </div>
                                <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full border border-primary-200">
                                    Active
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
