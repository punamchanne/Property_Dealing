'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { propertiesAPI } from '@/lib/api';
import { Property } from '@/types';
import { formatPrice } from '@/lib/utils';
import PropertyImageGallery from '@/components/PropertyImageGallery';
import { motion } from 'framer-motion';
import {
    MapPin, Bed, Bath, Maximize2, Heart, Share2, Calendar, Phone, Mail,
    Building2, CheckCircle2, ArrowLeft, Eye, Home, User, ChevronLeft, ChevronRight
} from 'lucide-react';

export default function PropertyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isAuthenticated, user } = useAuth();
    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        if (params.id) {
            loadProperty(params.id as string);
        }
    }, [params.id]);

    const loadProperty = async (id: string) => {
        try {
            const response = await propertiesAPI.getById(id);
            setProperty(response.data.property);
        } catch (error) {
            console.error('Error loading property:', error);
        } finally {
            setLoading(false);
        }
    };

    const handlePrevImage = () => {
        if (property) {
            setCurrentImageIndex((prev) =>
                prev === 0 ? property.images.length - 1 : prev - 1
            );
        }
    };

    const handleNextImage = () => {
        if (property) {
            setCurrentImageIndex((prev) =>
                prev === property.images.length - 1 ? 0 : prev + 1
            );
        }
    };

    const handleScheduleVisit = () => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }
        // TODO: Implement meeting scheduling
        alert('Meeting scheduling feature coming soon!');
    };

    const handleContactOwner = () => {
        if (!isAuthenticated) {
            router.push('/auth/login');
            return;
        }
        // TODO: Implement contact owner
        alert('Contact owner feature coming soon!');
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#C62828] border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Not Found</h2>
                    <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
                    <Link href="/explore">
                        <Button className="bg-[#C62828] hover:bg-[#A81E1E]">
                            Browse Properties
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Button */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-[#C62828] transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Back to listings
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Advanced Image Gallery with 2D/3D/360° Views */}
                        <PropertyImageGallery
                            images={property.images.map((img: any) => ({
                                url: img.url || img,
                                roomType: img.roomType || 'other',
                                viewType: img.viewType || '2d',
                                caption: img.caption,
                                isPrimary: img.isPrimary
                            }))}
                            propertyTitle={property.title}
                        />

                        {/* Property Details */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="h-5 w-5" />
                                        <span>{property.location.address}, {property.location.city}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-3xl font-bold text-[#C62828]">
                                        {formatPrice(property.price)}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        {property.priceType === 'rent' && '/ month'}
                                    </div>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-gray-200">
                                {property.bedrooms && (
                                    <div className="text-center">
                                        <Bed className="h-6 w-6 text-[#C62828] mx-auto mb-2" />
                                        <div className="font-semibold text-gray-900">{property.bedrooms}</div>
                                        <div className="text-sm text-gray-600">Bedrooms</div>
                                    </div>
                                )}
                                {property.bathrooms && (
                                    <div className="text-center">
                                        <Bath className="h-6 w-6 text-[#C62828] mx-auto mb-2" />
                                        <div className="font-semibold text-gray-900">{property.bathrooms}</div>
                                        <div className="text-sm text-gray-600">Bathrooms</div>
                                    </div>
                                )}
                                {property.area && (
                                    <div className="text-center">
                                        <Maximize2 className="h-6 w-6 text-[#C62828] mx-auto mb-2" />
                                        <div className="font-semibold text-gray-900">{property.area.value}</div>
                                        <div className="text-sm text-gray-600">{property.area.unit}</div>
                                    </div>
                                )}
                                <div className="text-center">
                                    <Eye className="h-6 w-6 text-[#C62828] mx-auto mb-2" />
                                    <div className="font-semibold text-gray-900">{property.views || 0}</div>
                                    <div className="text-sm text-gray-600">Views</div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mt-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-3">Description</h2>
                                <p className="text-gray-600 leading-relaxed">{property.description}</p>
                            </div>

                            {/* Amenities */}
                            {property.amenities && property.amenities.length > 0 && (
                                <div className="mt-6">
                                    <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {property.amenities.map((amenity, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                                                <span className="text-gray-700">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Location Map Placeholder */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Location</h2>
                            <div className="bg-gray-200 rounded-lg h-64 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                    <p className="text-gray-600">Map integration coming soon</p>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {property.location.address}, {property.location.city}, {property.location.state}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-8 space-y-6">
                            {/* Contact Card */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Property Owner</h3>

                                <div className="space-y-3 mb-6">
                                    <Button
                                        onClick={handleScheduleVisit}
                                        className="w-full h-12 bg-[#C62828] hover:bg-[#A81E1E] text-white font-semibold shadow-md hover:shadow-lg transition-all"
                                    >
                                        <Calendar className="h-5 w-5 mr-2" />
                                        Schedule Visit
                                    </Button>

                                    <Button
                                        onClick={handleContactOwner}
                                        variant="outline"
                                        className="w-full h-12 border-2 border-[#C62828] text-[#C62828] hover:bg-red-50 font-semibold bg-transparent"
                                    >
                                        <Phone className="h-5 w-5 mr-2" />
                                        Contact Owner
                                    </Button>
                                </div>

                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="bg-gray-200 rounded-full p-3">
                                            <User className="h-6 w-6 text-gray-600" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">Property Owner</div>
                                            <div className="text-sm text-gray-600">Verified Seller</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Property Info */}
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-4">Property Information</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Property Type</span>
                                        <span className="font-semibold text-gray-900">{property.type}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status</span>
                                        <span className="font-semibold text-green-600 capitalize">{property.status}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Listed</span>
                                        <span className="font-semibold text-gray-900">
                                            {new Date(property.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Property ID</span>
                                        <span className="font-semibold text-gray-900 text-sm">
                                            #{property._id.slice(-8).toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div >
            </div >
        </div >
    );
}
