'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    CheckCircle,
    XCircle,
    Eye,
    Edit,
    Trash2,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { propertiesAPI } from '@/lib/api';
import { Property } from '@/types';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadProperties();
    }, [filter]);

    const loadProperties = async () => {
        try {
            setLoading(true);
            const response = await propertiesAPI.getAll({});
            let filtered = response.data.properties || [];

            if (filter === 'pending') {
                filtered = filtered.filter((p: Property) => !p.approved);
            } else if (filter === 'approved') {
                filtered = filtered.filter((p: Property) => p.approved);
            }

            setProperties(filtered);
        } catch (error) {
            console.error('Error loading properties:', error);
            toast.error('Failed to load properties');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: string) => {
        try {
            // Add API call to approve property
            toast.success('Property approved successfully');
            loadProperties();
        } catch (error) {
            toast.error('Failed to approve property');
        }
    };

    const handleReject = async (id: string) => {
        try {
            // Add API call to reject property
            toast.success('Property rejected');
            loadProperties();
        } catch (error) {
            toast.error('Failed to reject property');
        }
    };

    const filteredProperties = properties.filter((property) =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location?.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Properties Management</h1>
                <p className="text-gray-600 mt-1">Manage and approve property listings</p>
            </div>

            {/* Filters & Search */}
            <div className="bg-white rounded-xl p-6 shadow-md border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                        <Input
                            type="search"
                            placeholder="Search properties..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex gap-2">
                        {(['all', 'pending', 'approved'] as const).map((f) => (
                            <Button
                                key={f}
                                variant={filter === f ? 'default' : 'outline'}
                                onClick={() => setFilter(f)}
                                className={filter === f ? 'bg-primary-700' : ''}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-12 h-12 border-4 border-primary-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading properties...</p>
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-600">No properties found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Property</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Location</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Status</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {filteredProperties.map((property, index) => (
                                    <motion.tr
                                        key={property._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {property.images && property.images[0] && (
                                                    <img
                                                        src={property.images[0].url}
                                                        alt={property.title}
                                                        className="w-16 h-16 rounded-lg object-cover"
                                                    />
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900">{property.title}</p>
                                                    <p className="text-sm text-gray-500">ID: {property._id.slice(-8)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full border border-gray-200">
                                                {property.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">{formatPrice(property.price)}</p>
                                            <p className="text-xs text-gray-500">{property.priceType}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm text-gray-900">{property.location.city}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {property.approved ? (
                                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full border border-green-200">
                                                    Approved
                                                </span>
                                            ) : (
                                                <span className="px-2 py-1 bg-red-50 text-red-700 text-xs font-medium rounded-full border border-red-200">
                                                    Pending
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                {!property.approved && (
                                                    <>
                                                        <button
                                                            onClick={() => handleApprove(property._id)}
                                                            className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                                            title="Approve"
                                                        >
                                                            <CheckCircle className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(property._id)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Reject"
                                                        >
                                                            <XCircle className="h-5 w-5" />
                                                        </button>
                                                    </>
                                                )}
                                                <button
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="View"
                                                >
                                                    <Eye className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit className="h-5 w-5" />
                                                </button>
                                                <button
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
