'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, MapPin, Bed, Bath, Maximize, GitCompare } from 'lucide-react';
import { Property } from '@/types';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCompare } from '@/contexts/CompareContext';
import { toast } from 'sonner';

interface PropertyCardProps {
    property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
    const [imageLoaded, setImageLoaded] = useState(false);
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { isInCompare, addToCompare, removeFromCompare, compareCount, maxCompare } = useCompare();

    const has360 = property.tour360 && property.tour360.length > 0;
    const has3D = !!property.model3D;
    const inWishlist = isInWishlist(property._id);
    const inCompare = isInCompare(property._id);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (inWishlist) {
            removeFromWishlist(property._id);
            toast.success('Removed from wishlist');
        } else {
            addToWishlist(property._id);
            toast.success('Added to wishlist');
        }
    };

    const handleCompareToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation();

        if (inCompare) {
            removeFromCompare(property._id);
            toast.success('Removed from compare');
        } else {
            const added = addToCompare(property._id);
            if (added) {
                toast.success('Added to compare');
            } else {
                toast.error(`Maximum ${maxCompare} properties can be compared`);
            }
        }
    };


    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            whileHover={{ y: -5 }}
            className="h-full"
        >
            <Card className="overflow-hidden h-full flex flex-col hover:shadow-xl transition-shadow duration-300">
                {/* Image */}
                <div className="relative h-56 bg-gray-200 overflow-hidden group">
                    {property.images && property.images.length > 0 ? (
                        <Image
                            src={property.images[0].url}
                            alt={property.title}
                            fill
                            className={`object-cover transition-all duration-500 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'
                                }`}
                            onLoad={() => setImageLoaded(true)}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-300">
                            <span className="text-gray-500">No Image</span>
                        </div>
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                        {property.featured && (
                            <span className="bg-[#C62828] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                                Featured
                            </span>
                        )}
                        {property.priceType === 'rent' && (
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                                For Rent
                            </span>
                        )}
                        {has360 && (
                            <span className="bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                                </svg>
                                360°
                            </span>
                        )}
                        {has3D && (
                            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                                3D
                            </span>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {/* Wishlist Button */}
                        <button
                            onClick={handleWishlistToggle}
                            className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-md hover:scale-110"
                            title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                        >
                            <Heart
                                className={`h-5 w-5 transition-all ${inWishlist ? 'fill-[#C62828] text-[#C62828]' : 'text-gray-600'
                                    }`}
                            />
                        </button>

                        {/* Compare Checkbox */}
                        <label
                            className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full hover:bg-white transition-all shadow-md hover:scale-110 cursor-pointer flex items-center justify-center"
                            title={inCompare ? 'Remove from compare' : 'Add to compare'}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <input
                                type="checkbox"
                                checked={inCompare}
                                onChange={handleCompareToggle}
                                className="sr-only"
                            />
                            <GitCompare
                                className={`h-5 w-5 transition-all ${inCompare ? 'text-[#C62828]' : 'text-gray-600'
                                    }`}
                            />
                        </label>
                    </div>


                    {/* Price Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <p className="text-white text-2xl font-bold">{formatPrice(property.price)}</p>
                        {property.priceType === 'rent' && (
                            <p className="text-white/80 text-sm">per month</p>
                        )}
                    </div>
                </div>

                {/* Content */}
                <CardContent className="flex-grow p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                        {property.title}
                    </h3>

                    <div className="flex items-start gap-1 text-gray-600 mb-3">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <p className="text-sm line-clamp-1">{property.location?.address || 'Location not specified'}</p>
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                        {property.description}
                    </p>

                    {/* Property Details */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                        {property.bedrooms && (
                            <div className="flex items-center gap-1">
                                <Bed className="h-4 w-4 text-[#C62828]" />
                                <span>{property.bedrooms} Beds</span>
                            </div>
                        )}
                        {property.bathrooms && (
                            <div className="flex items-center gap-1">
                                <Bath className="h-4 w-4 text-[#C62828]" />
                                <span>{property.bathrooms} Baths</span>
                            </div>
                        )}
                        {property.area && (
                            <div className="flex items-center gap-1">
                                <Maximize className="h-4 w-4 text-[#C62828]" />
                                <span>{property.area.value} {property.area.unit}</span>
                            </div>
                        )}
                    </div>
                </CardContent>

                {/* Footer */}
                <CardFooter className="p-4 pt-0">
                    <Link href={`/properties/${property._id}`} className="w-full">
                        <Button className="w-full bg-[#C62828] hover:bg-[#A81E1E] text-white font-semibold shadow-sm hover:shadow-md transition-all">
                            View Details
                        </Button>
                    </Link>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
