'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { propertiesAPI } from '@/lib/api';
import { Property } from '@/types';
import { Search, SlidersHorizontal, X, MapPin, Home, DollarSign, Maximize2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function ExploreContent() {
    const searchParams = useSearchParams();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    // Filter states
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        type: searchParams.get('type') || '',
        priceMin: '',
        priceMax: '',
        city: '',
        bedrooms: '',
        priceType: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const [pagination, setPagination] = useState({
        page: 1,
        limit: 12,
        total: 0,
        pages: 0,
    });

    const propertyTypes = ['Apartment', 'Villa', 'House', 'Plot', 'Commercial', 'Office Space', 'Warehouse'];
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Pune', 'Kolkata', 'Ahmedabad'];
    const bedroomOptions = ['1', '2', '3', '4', '5+'];

    useEffect(() => {
        loadProperties();
    }, [filters, pagination.page]);

    const loadProperties = async () => {
        setLoading(true);
        try {
            const params: any = {
                page: pagination.page,
                limit: pagination.limit,
                sortBy: filters.sortBy,
                sortOrder: filters.sortOrder,
            };

            if (filters.search) params.search = filters.search;
            if (filters.type) params.type = filters.type;
            if (filters.priceMin) params.minPrice = filters.priceMin;
            if (filters.priceMax) params.maxPrice = filters.priceMax;
            if (filters.city) params.city = filters.city;
            if (filters.bedrooms) params.bedrooms = filters.bedrooms === '5+' ? 5 : filters.bedrooms;
            if (filters.priceType) params.priceType = filters.priceType;

            const response = await propertiesAPI.getAll(params);
            setProperties(response.data.properties);
            setPagination({
                ...pagination,
                total: response.data.total,
                pages: response.data.pages,
            });
        } catch (error) {
            console.error('Error loading properties:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (key: string, value: string) => {
        setFilters({ ...filters, [key]: value });
        setPagination({ ...pagination, page: 1 });
    };

    const clearFilters = () => {
        setFilters({
            search: '',
            type: '',
            priceMin: '',
            priceMax: '',
            city: '',
            bedrooms: '',
            priceType: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
        });
        setPagination({ ...pagination, page: 1 });
    };

    const hasActiveFilters = filters.type || filters.priceMin || filters.priceMax || filters.city || filters.bedrooms || filters.priceType;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#8A1C1C] to-[#C62828] text-white py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl font-bold mb-4">Explore Properties</h1>
                    <p className="text-white/90 text-lg">Find your perfect property from our extensive collection</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Search and Filter Bar */}
                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Search Input */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search by location, property name..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="pl-10 h-12 border-gray-300 focus:border-[#C62828] focus:ring-[#C62828]/20 rounded-xl"
                            />
                        </div>

                        {/* Filter Toggle Button */}
                        <Button
                            onClick={() => setShowFilters(!showFilters)}
                            variant="outline"
                            className="h-12 px-6 border-gray-300 hover:border-[#C62828] hover:text-[#C62828]"
                        >
                            <SlidersHorizontal className="h-5 w-5 mr-2" />
                            Filters
                            {hasActiveFilters && (
                                <span className="ml-2 bg-[#C62828] text-white text-xs px-2 py-0.5 rounded-full">
                                    Active
                                </span>
                            )}
                        </Button>

                        {/* Sort Dropdown */}
                        <select
                            value={`${filters.sortBy}-${filters.sortOrder}`}
                            onChange={(e) => {
                                const [sortBy, sortOrder] = e.target.value.split('-');
                                setFilters({ ...filters, sortBy, sortOrder });
                            }}
                            className="h-12 px-4 border border-gray-300 rounded-xl focus:border-[#C62828] focus:ring-[#C62828]/20"
                        >
                            <option value="createdAt-desc">Newest First</option>
                            <option value="createdAt-asc">Oldest First</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                            <option value="views-desc">Most Viewed</option>
                        </select>
                    </div>

                    {/* Advanced Filters */}
                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="pt-6 mt-6 border-t border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        {/* Property Type */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Home className="inline h-4 w-4 mr-1" />
                                                Property Type
                                            </label>
                                            <select
                                                value={filters.type}
                                                onChange={(e) => handleFilterChange('type', e.target.value)}
                                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-[#C62828] focus:ring-[#C62828]/20"
                                            >
                                                <option value="">All Types</option>
                                                {propertyTypes.map((type) => (
                                                    <option key={type} value={type}>{type}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* City */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <MapPin className="inline h-4 w-4 mr-1" />
                                                City
                                            </label>
                                            <select
                                                value={filters.city}
                                                onChange={(e) => handleFilterChange('city', e.target.value)}
                                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-[#C62828] focus:ring-[#C62828]/20"
                                            >
                                                <option value="">All Cities</option>
                                                {cities.map((city) => (
                                                    <option key={city} value={city}>{city}</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Bedrooms */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Maximize2 className="inline h-4 w-4 mr-1" />
                                                Bedrooms
                                            </label>
                                            <select
                                                value={filters.bedrooms}
                                                onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-[#C62828] focus:ring-[#C62828]/20"
                                            >
                                                <option value="">Any</option>
                                                {bedroomOptions.map((bed) => (
                                                    <option key={bed} value={bed}>{bed} BHK</option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Price Type */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <DollarSign className="inline h-4 w-4 mr-1" />
                                                Listing Type
                                            </label>
                                            <select
                                                value={filters.priceType}
                                                onChange={(e) => handleFilterChange('priceType', e.target.value)}
                                                className="w-full h-10 px-3 border border-gray-300 rounded-lg focus:border-[#C62828] focus:ring-[#C62828]/20"
                                            >
                                                <option value="">All</option>
                                                <option value="sale">For Sale</option>
                                                <option value="rent">For Rent</option>
                                            </select>
                                        </div>

                                        {/* Min Price */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Min Price (₹)
                                            </label>
                                            <Input
                                                type="number"
                                                placeholder="Min"
                                                value={filters.priceMin}
                                                onChange={(e) => handleFilterChange('priceMin', e.target.value)}
                                                className="h-10 border-gray-300 focus:border-[#C62828] rounded-xl"
                                            />
                                        </div>

                                        {/* Max Price */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Max Price (₹)
                                            </label>
                                            <Input
                                                type="number"
                                                placeholder="Max"
                                                value={filters.priceMax}
                                                onChange={(e) => handleFilterChange('priceMax', e.target.value)}
                                                className="h-10 border-gray-300 focus:border-[#C62828] rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    {/* Clear Filters Button */}
                                    {hasActiveFilters && (
                                        <div className="mt-4 flex justify-end">
                                            <Button
                                                onClick={clearFilters}
                                                variant="ghost"
                                                className="text-[#C62828] hover:text-[#A81E1E] hover:bg-[#F3D6D6]/30"
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Clear All Filters
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Results Count */}
                <div className="mb-6 flex items-center justify-between">
                    <p className="text-gray-600">
                        Showing <span className="font-semibold text-gray-900">{properties.length}</span> of{' '}
                        <span className="font-semibold text-gray-900">{pagination.total}</span> properties
                    </p>
                </div>

                {/* Properties Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : properties.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <PropertyCard key={property._id} property={property} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {pagination.pages > 1 && (
                            <div className="mt-12 flex justify-center gap-2">
                                <Button
                                    onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                                    disabled={pagination.page === 1}
                                    variant="outline"
                                    className="border-gray-300"
                                >
                                    Previous
                                </Button>

                                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        onClick={() => setPagination({ ...pagination, page })}
                                        variant={pagination.page === page ? 'default' : 'outline'}
                                        className={pagination.page === page ? 'bg-[#C62828] hover:bg-[#A81E1E]' : 'border-gray-300'}
                                    >
                                        {page}
                                    </Button>
                                ))}

                                <Button
                                    onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                                    disabled={pagination.page === pagination.pages}
                                    variant="outline"
                                    className="border-gray-300"
                                >
                                    Next
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-10 bg-white rounded-2xl">
                        <Home className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                        <p className="text-gray-600 mb-6">Try adjusting your filters or search criteria</p>
                        <Button
                            onClick={clearFilters}
                            className="bg-[#C62828] hover:bg-[#A81E1E]"
                        >
                            Clear Filters
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ExplorePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#C62828] border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <ExploreContent />
        </Suspense>
    );
}
