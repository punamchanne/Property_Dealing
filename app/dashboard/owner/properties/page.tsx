'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Building2,
    MapPin
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { propertiesAPI } from '@/lib/api';
import { Property } from '@/types';
import { formatPrice } from '@/lib/utils';
import { toast } from 'sonner';
import Link from 'next/link';

export default function OwnerPropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        loadProperties();
    }, []);

    const loadProperties = async () => {
        try {
            setLoading(true);
            const response = await propertiesAPI.getMyProperties();
            setProperties(response.data.properties);
        } catch (error) {
            console.error('Error loading properties:', error);
            toast.error('Failed to load your properties');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this property?')) return;

        try {
            await propertiesAPI.delete(id);
            toast.success('Property deleted successfully');
            loadProperties();
        } catch (error) {
            toast.error('Failed to delete property');
        }
    };

    const filteredProperties = properties.filter((property) =>
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.location.city?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getStatusBadge = (status: string, approved: boolean) => {
        if (!approved) return <span className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 text-xs font-medium rounded-full">Pending Approval</span>;
        if (status === 'sold') return <span className="px-2 py-1 bg-gray-100 text-gray-700 border border-gray-200 text-xs font-medium rounded-full">Sold</span>;
        // Active: Reverted to Green as requested
        return <span className="px-2 py-1 bg-green-100 text-green-700 border border-green-200 text-xs font-medium rounded-full">Active</span>;
    };

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
                    <p className="text-gray-500 mt-1">Manage your listed properties</p>
                </div>
                <Link href="/dashboard/owner/add-property">
                    <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Property
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-50">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-primary-300" />
                    <Input
                        type="search"
                        placeholder="Search your properties..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 border-primary-100 focus:border-primary-300 focus:ring-primary-200"
                    />
                </div>
            </div>

            {/* Properties Table */}
            <div className="bg-white rounded-xl shadow-sm border border-primary-100 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-500">Loading properties...</p>
                    </div>
                ) : filteredProperties.length === 0 ? (
                    <div className="p-12 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-50 mb-4">
                            <Building2 className="h-8 w-8 text-primary-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties found</h3>
                        <p className="text-gray-500 mb-6">You haven't listed any properties yet.</p>
                        <Link href="/dashboard/owner/add-property">
                            <Button className="bg-primary-600 hover:bg-primary-700">
                                List Your First Property
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-primary-50 border-b border-primary-100">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Property</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Price</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-primary-900">Status</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-primary-900">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-primary-50">
                                {filteredProperties.map((property, index) => (
                                    <motion.tr
                                        key={property._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="hover:bg-primary-50/30 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {property.images && property.images[0] ? (
                                                    <img
                                                        src={property.images[0].url}
                                                        alt={property.title}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                                        <Building2 className="h-6 w-6 text-primary-300" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-medium text-gray-900 truncate max-w-[200px]">{property.title}</p>
                                                    <div className="flex items-center text-xs text-gray-500 mt-0.5">
                                                        <MapPin className="h-3 w-3 mr-1" />
                                                        {property.location.city}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-gray-600">{property.type}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-primary-700">{formatPrice(property.price)}</p>
                                            <p className="text-xs text-gray-500 capitalize">{property.priceType}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            {getStatusBadge(property.status, property.approved)}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/dashboard/owner/edit-property/${property._id}`}>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-600 hover:text-primary-700 hover:bg-primary-50">
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50"
                                                    onClick={() => handleDelete(property._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
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
