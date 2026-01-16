'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
    MapPin, Bed, Bath, Maximize, Heart, Share2, Calendar,
    Phone, Mail, ChevronLeft, ChevronRight, X, Check,
    Home, Car, Wifi, Dumbbell, Shield, Zap, Trees, Building2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Property } from '@/types';
import { propertiesAPI } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useWishlist } from '@/contexts/WishlistContext';
import { toast } from 'sonner';
import Property360Viewer from '@/components/Property360Viewer';

const amenityIcons: { [key: string]: any } = {
    'Swimming Pool': Wifi,
    'Gym': Dumbbell,
    'Parking': Car,
    'Security': Shield,
    'Power Backup': Zap,
    'Garden': Trees,
    'Club House': Building2,
    'Lift': Building2,
};

export default function PropertyDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showImageModal, setShowImageModal] = useState(false);
    const [showContactForm, setShowContactForm] = useState(false);

    useEffect(() => {
        if (params.id) {
            loadProperty(params.id as string);
        }
    }, [params.id]);

    const loadProperty = async (id: string) => {
        try {
            setLoading(true);
            const response = await propertiesAPI.getById(id);
            setProperty(response.data.property);
        } catch (error) {
            console.error('Error loading property:', error);
            toast.error('Property not found');
            router.push('/explore');
        } finally {
            setLoading(false);
        }
    };

    const handleWishlistToggle = () => {
        if (!property) return;

        if (isInWishlist(property._id)) {
            removeFromWishlist(property._id);
            toast.success('Removed from wishlist');
        } else {
            addToWishlist(property._id);
            toast.success('Added to wishlist');
        }
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: property?.title,
                text: property?.description,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            toast.success('Link copied to clipboard!');
        }
    };

    const nextImage = () => {
        if (property && property.images) {
            setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
        }
    };

    const prevImage = () => {
        if (property && property.images) {
            setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary-700 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading property details...</p>
                </div>
            </div>
        );
    }

    if (!property) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Property Not Found</h2>
                    <Link href="/explore">
                        <Button>Browse Properties</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const inWishlist = isInWishlist(property._id);

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Back Button */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-gray-600 hover:text-primary-700 transition-colors"
                    >
                        <ChevronLeft className="h-5 w-5" />
                        Back to listings
                    </button>
                </div>
            </div>

            {/* Image Gallery */}
            <div className="bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Main Image */}
                        <div className="relative h-96 md:h-[600px] rounded-2xl overflow-hidden group cursor-pointer">
                            {property.images && property.images.length > 0 ? (
                                <>
                                    <Image
                                        src={property.images[currentImageIndex].url}
                                        alt={property.title}
                                        fill
                                        className="object-cover"
                                        onClick={() => setShowImageModal(true)}
                                    />

                                    {/* Navigation Arrows */}
                                    {property.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); prevImage(); }}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <ChevronLeft className="h-6 w-6 text-gray-900" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); nextImage(); }}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/90 rounded-full hover:bg-white transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <ChevronRight className="h-6 w-6 text-gray-900" />
                                            </button>
                                        </>
                                    )}

                                    {/* Image Counter */}
                                    <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                        {currentImageIndex + 1} / {property.images.length}
                                    </div>
                                </>
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-gray-400">No images available</span>
                                </div>
                            )}
                        </div>

                        {/* Thumbnail Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {property.images && property.images.slice(0, 4).map((image, index) => (
                                <div
                                    key={index}
                                    className={`relative h-44 md:h-[290px] rounded-xl overflow-hidden cursor-pointer border-4 transition-all ${index === currentImageIndex ? 'border-primary-700' : 'border-transparent hover:border-gray-300'
                                        }`}
                                    onClick={() => setCurrentImageIndex(index)}
                                >
                                    <Image
                                        src={image.url}
                                        alt={`${property.title} - ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Property Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title & Price */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl p-6 shadow-md"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-semibold">
                                            {property.type}
                                        </span>
                                        {property.featured && (
                                            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                Featured
                                            </span>
                                        )}
                                        {property.priceType === 'rent' && (
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                                                For Rent
                                            </span>
                                        )}
                                    </div>
                                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <MapPin className="h-5 w-5" />
                                        <span>{property.location.address}, {property.location.city}</span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleWishlistToggle}
                                        className="p-3 bg-gray-100 rounded-full hover:bg-primary-50 transition-colors"
                                    >
                                        <Heart className={`h-6 w-6 ${inWishlist ? 'fill-primary-700 text-primary-700' : 'text-gray-600'}`} />
                                    </button>
                                    <button
                                        onClick={handleShare}
                                        className="p-3 bg-gray-100 rounded-full hover:bg-primary-50 transition-colors"
                                    >
                                        <Share2 className="h-6 w-6 text-gray-600" />
                                    </button>
                                </div>
                            </div>

                            <div className="border-t pt-4">
                                <div className="flex items-baseline gap-2">
                                    <span className="text-4xl font-bold text-primary-700">{formatPrice(property.price)}</span>
                                    {property.priceType === 'rent' && (
                                        <span className="text-gray-600">/month</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Key Features */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl p-6 shadow-md"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Key Features</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {property.bedrooms && (
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <Bed className="h-8 w-8 text-primary-700" />
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{property.bedrooms}</p>
                                            <p className="text-sm text-gray-600">Bedrooms</p>
                                        </div>
                                    </div>
                                )}
                                {property.bathrooms && (
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <Bath className="h-8 w-8 text-primary-700" />
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{property.bathrooms}</p>
                                            <p className="text-sm text-gray-600">Bathrooms</p>
                                        </div>
                                    </div>
                                )}
                                {property.area && (
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                        <Maximize className="h-8 w-8 text-primary-700" />
                                        <div>
                                            <p className="text-2xl font-bold text-gray-900">{property.area.value}</p>
                                            <p className="text-sm text-gray-600">{property.area.unit}</p>
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                                    <Home className="h-8 w-8 text-primary-700" />
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900">{property.type}</p>
                                        <p className="text-sm text-gray-600">Property Type</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-6 shadow-md"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                            <p className="text-gray-600 leading-relaxed">{property.description}</p>
                        </motion.div>

                        {/* Amenities */}
                        {property.amenities && property.amenities.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-white rounded-2xl p-6 shadow-md"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">Amenities</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {property.amenities.map((amenity, index) => {
                                        const Icon = amenityIcons[amenity] || Check;
                                        return (
                                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Icon className="h-5 w-5 text-primary-700" />
                                                <span className="text-gray-700">{amenity}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        )}

                        {/* 360° Tour */}
                        {property.tour360 && property.tour360.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="bg-white rounded-2xl p-6 shadow-md"
                            >
                                <h2 className="text-2xl font-bold text-gray-900 mb-4">360° Virtual Tour</h2>
                                <Property360Viewer
                                    images={property.tour360}
                                    title={property.title}
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* Right Column - Contact Card */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white rounded-2xl p-6 shadow-lg sticky top-24"
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Interested in this property?</h3>

                            <div className="space-y-3 mb-6">
                                <Button className="w-full bg-gradient-to-r from-primary-700 to-primary-900 text-white py-6 text-lg">
                                    <Calendar className="h-5 w-5 mr-2" />
                                    Schedule a Visit
                                </Button>
                                <Button variant="outline" className="w-full border-2 border-primary-700 text-primary-700 py-6 text-lg hover:bg-primary-50">
                                    <Phone className="h-5 w-5 mr-2" />
                                    Contact Agent
                                </Button>
                                <Button variant="outline" className="w-full py-6 text-lg">
                                    <Mail className="h-5 w-5 mr-2" />
                                    Send Message
                                </Button>
                            </div>

                            <div className="border-t pt-6">
                                <h4 className="font-semibold text-gray-900 mb-3">Property Details</h4>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Property ID:</span>
                                        <span className="font-medium text-gray-900">{property._id.slice(-8)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Status:</span>
                                        <span className="font-medium text-green-600 capitalize">{property.status}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Type:</span>
                                        <span className="font-medium text-gray-900">{property.priceType === 'rent' ? 'For Rent' : 'For Sale'}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
