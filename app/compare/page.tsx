'use client';

import { useEffect, useState } from 'react';
import { useCompare } from '@/contexts/CompareContext';
import { Property } from '@/types';
import axios from 'axios';
import { motion } from 'framer-motion';
import { GitCompare, Loader2, X, MapPin, Bed, Bath, Maximize, Check, Minus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';

export default function ComparePage() {
    const { compareList, removeFromCompare, clearCompare, compareCount } = useCompare();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCompareProperties = async () => {
            if (compareList.length === 0) {
                setProperties([]);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/properties`);
                const allProperties = response.data.properties;

                const compareProperties = allProperties.filter((prop: Property) =>
                    compareList.includes(prop._id)
                );

                setProperties(compareProperties);
            } catch (error) {
                console.error('Error fetching compare properties:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCompareProperties();
    }, [compareList]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-12 w-12 animate-spin text-primary-700 mx-auto mb-4" />
                    <p className="text-gray-600">Loading comparison...</p>
                </div>
            </div>
        );
    }

    const features = [
        { key: 'price', label: 'Price', format: (val: number) => formatPrice(val) },
        { key: 'bedrooms', label: 'Bedrooms', icon: Bed },
        { key: 'bathrooms', label: 'Bathrooms', icon: Bath },
        { key: 'area', label: 'Area', format: (val: any) => `${val.value} ${val.unit}` },
        { key: 'propertyType', label: 'Type' },
        { key: 'priceType', label: 'For' },
        { key: 'status', label: 'Status' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <GitCompare className="h-8 w-8 text-primary-700" />
                                <h1 className="text-4xl font-bold text-gray-900">Compare Properties</h1>
                            </div>
                            <p className="text-gray-600 text-lg">
                                {compareCount === 0
                                    ? 'Add properties to compare'
                                    : `Comparing ${compareCount} ${compareCount === 1 ? 'property' : 'properties'}`}
                            </p>
                        </div>
                        {compareCount > 0 && (
                            <Button
                                variant="outline"
                                onClick={clearCompare}
                                className="border-2 border-red-500 text-red-500 hover:bg-red-50"
                            >
                                Clear All
                            </Button>
                        )}
                    </div>
                </motion.div>

                {/* Empty State */}
                {properties.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-white rounded-2xl shadow-lg p-12 text-center"
                    >
                        <GitCompare className="h-24 w-24 text-gray-300 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-gray-900 mb-3">No properties to compare</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            Start exploring properties and add them to compare by clicking the compare icon on property cards.
                        </p>
                        <Link href="/explore">
                            <Button size="lg" className="bg-gradient-to-r from-primary-700 to-primary-900">
                                Explore Properties
                            </Button>
                        </Link>
                    </motion.div>
                ) : (
                    /* Comparison Table */
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b-2 border-gray-200">
                                        <th className="p-4 text-left bg-gray-50 font-bold text-gray-900 sticky left-0 z-10">
                                            Feature
                                        </th>
                                        {properties.map((property) => (
                                            <th key={property._id} className="p-4 min-w-[300px]">
                                                <div className="relative">
                                                    <button
                                                        onClick={() => removeFromCompare(property._id)}
                                                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                                                    >
                                                        <X className="h-4 w-4" />
                                                    </button>
                                                    <div className="relative h-48 rounded-lg overflow-hidden mb-3">
                                                        {property.images && property.images.length > 0 ? (
                                                            <Image
                                                                src={property.images[0].url}
                                                                alt={property.title}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                                <span className="text-gray-400">No Image</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <h3 className="font-bold text-lg text-gray-900 mb-1">{property.title}</h3>
                                                    <div className="flex items-center gap-1 text-gray-600 text-sm">
                                                        <MapPin className="h-3 w-3" />
                                                        <span className="line-clamp-1">{property.location.address}</span>
                                                    </div>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {features.map((feature, index) => (
                                        <tr key={feature.key} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                            <td className="p-4 font-semibold text-gray-900 sticky left-0 z-10 bg-inherit">
                                                <div className="flex items-center gap-2">
                                                    {feature.icon && <feature.icon className="h-4 w-4 text-primary-700" />}
                                                    {feature.label}
                                                </div>
                                            </td>
                                            {properties.map((property) => {
                                                const value = (property as any)[feature.key];
                                                let displayValue = value;

                                                if (feature.format && value) {
                                                    displayValue = feature.format(value);
                                                } else if (typeof value === 'boolean') {
                                                    displayValue = value ? (
                                                        <Check className="h-5 w-5 text-green-600" />
                                                    ) : (
                                                        <Minus className="h-5 w-5 text-gray-400" />
                                                    );
                                                } else if (!value) {
                                                    displayValue = <Minus className="h-5 w-5 text-gray-400" />;
                                                }

                                                return (
                                                    <td key={property._id} className="p-4 text-center">
                                                        <div className="flex items-center justify-center">
                                                            {displayValue}
                                                        </div>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ))}

                                    {/* Amenities Row */}
                                    <tr className="bg-white">
                                        <td className="p-4 font-semibold text-gray-900 sticky left-0 z-10 bg-white">
                                            Amenities
                                        </td>
                                        {properties.map((property) => (
                                            <td key={property._id} className="p-4">
                                                <div className="flex flex-wrap gap-1 justify-center">
                                                    {property.amenities && property.amenities.length > 0 ? (
                                                        property.amenities.slice(0, 3).map((amenity, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-2 py-1 bg-primary-50 text-primary-700 rounded-full text-xs"
                                                            >
                                                                {amenity}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <Minus className="h-5 w-5 text-gray-400" />
                                                    )}
                                                </div>
                                            </td>
                                        ))}
                                    </tr>

                                    {/* Action Row */}
                                    <tr className="bg-gray-50">
                                        <td className="p-4 font-semibold text-gray-900 sticky left-0 z-10 bg-gray-50">
                                            Actions
                                        </td>
                                        {properties.map((property) => (
                                            <td key={property._id} className="p-4">
                                                <Link href={`/property/${property._id}`}>
                                                    <Button className="w-full bg-gradient-to-r from-primary-700 to-primary-900">
                                                        View Details
                                                    </Button>
                                                </Link>
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
