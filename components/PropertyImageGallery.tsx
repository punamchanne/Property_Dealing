'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X, Eye, Box, Image as ImageIcon } from 'lucide-react';
import ThreeDPhotoViewer from './viewers/ThreeDPhotoViewer';
import PanoramaViewer from './viewers/PanoramaViewer';

interface PropertyImage {
    url: string;
    roomType: string;
    caption?: string;
    // Legacy support, but we ignore viewType now as we render all images in requested mode
    viewType?: string;
}

interface PropertyImageGalleryProps {
    images: PropertyImage[];
    propertyTitle: string;
}

const roomLabels: Record<string, string> = {
    'all': 'All Rooms',
    'bedroom': 'Bedrooms',
    'living-room': 'Living Room',
    'kitchen': 'Kitchen',
    'bathroom': 'Bathrooms',
    'balcony': 'Balcony',
    'dining-room': 'Dining Room',
    'exterior': 'Exterior',
    'garden': 'Garden',
    'other': 'Other'
};

export default function PropertyImageGallery({ images, propertyTitle }: PropertyImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedRoom, setSelectedRoom] = useState<string>('all');
    // Default to 3D as requested, but we can switch to 360
    const [viewMode, setViewMode] = useState<'3d' | '360'>('3d');
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Filter images by room only (ignore viewType, we render everything dynamically)
    // We dedup images if the seed data still has duplicates, ideally we just want unique URL/Room combos
    // For now, let's just filter by room.
    const filteredImages = images.filter(img =>
        selectedRoom === 'all' || img.roomType === selectedRoom
    );

    // Logic to handle legacy duplicate data if present:
    // If we have multiple entries for same room with different viewTypes, we might see duplicates.
    // Let's deduce unique images by URL to be safe, or just rely on the user having cleaned data.
    // For now, simple filter is safer to see what we have.

    const currentImage = filteredImages[currentIndex] || images[0];

    const nextImage = () => {
        if (filteredImages.length > 0) {
            setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
        }
    };

    const prevImage = () => {
        if (filteredImages.length > 0) {
            setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
        }
    };

    if (!images || images.length === 0) {
        return (
            <div className="bg-gray-100 rounded-xl p-12 text-center">
                <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No images available</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* View Mode Selector */}
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">Property Gallery</h2>
                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('3d')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${viewMode === '3d' ? 'bg-white shadow-sm text-[#C62828]' : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Box className="h-4 w-4" />
                        3D View
                    </button>
                    <button
                        onClick={() => setViewMode('360')}
                        className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${viewMode === '360' ? 'bg-white shadow-sm text-[#C62828]' : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        <Eye className="h-4 w-4" />
                        360° View
                    </button>
                </div>
            </div>

            {/* Room Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['all', ...new Set(images.map(img => img.roomType))].map((room) => (
                    <button
                        key={room}
                        onClick={() => { setSelectedRoom(room); setCurrentIndex(0); }}
                        className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${selectedRoom === room
                                ? 'bg-[#C62828] text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                    >
                        {roomLabels[room] || room}
                    </button>
                ))}
            </div>

            {/* Main Viewer Container */}
            <div className="relative h-[500px] md:h-[600px] bg-gray-900 rounded-xl overflow-hidden shadow-2xl">

                {/* 3D / 360 Viewer Rendering */}
                <div className="absolute inset-0 z-0">
                    {viewMode === '3d' ? (
                        <ThreeDPhotoViewer imageUrl={currentImage?.url} />
                    ) : (
                        <PanoramaViewer imageUrl={currentImage?.url} />
                    )}
                </div>

                {/* Overlays (Navigation, Badges) */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    {/* View Type Badge */}
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-bold text-gray-900 shadow-sm">
                        {viewMode === '3d' && <Box className="h-4 w-4 inline mr-1" />}
                        {viewMode === '360' && <Eye className="h-4 w-4 inline mr-1" />}
                        {viewMode === '3d' ? 'Interactive 3D' : '360° Panorama'}
                    </div>

                    {/* Navigation Arrows (pointer-events-auto needed) */}
                    {filteredImages.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all text-gray-900 pointer-events-auto hover:scale-110 active:scale-95"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all text-gray-900 pointer-events-auto hover:scale-110 active:scale-95"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </button>
                        </>
                    )}

                    {/* Image Counter */}
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
                        {currentIndex + 1} / {filteredImages.length || 1}
                    </div>

                    {/* Fullscreen Button */}
                    <button
                        onClick={() => setIsFullscreen(true)}
                        className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg hover:bg-white transition-colors pointer-events-auto text-gray-900"
                    >
                        <Maximize2 className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Caption */}
            {currentImage?.caption && (
                <div className="bg-white px-6 py-4 border-t rounded-b-xl">
                    <p className="text-gray-700 font-medium">{currentImage.caption}</p>
                </div>
            )}

            {/* Thumbnail Strip */}
            <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                {filteredImages.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`relative aspect-square rounded-lg overflow-hidden transition-all ${index === currentIndex
                                ? 'ring-4 ring-[#C62828] scale-105 z-10'
                                : 'hover:scale-105 opacity-70 hover:opacity-100'
                            }`}
                    >
                        <Image
                            src={image.url}
                            alt={image.caption || `Image ${index + 1}`}
                            fill
                            className="object-cover"
                            sizes="150px"
                        />
                    </button>
                ))}
            </div>

            {/* Fullscreen Overlay (Simple Image for now, or we can replicate the viewer) */}
            <AnimatePresence>
                {isFullscreen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black flex items-center justify-center p-4"
                    >
                        <button
                            onClick={() => setIsFullscreen(false)}
                            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors z-[60]"
                        >
                            <X className="h-6 w-6 text-white" />
                        </button>

                        {/* Reuse the active viewer in fullscreen */}
                        <div className="w-full h-full relative rounded-xl overflow-hidden">
                            {viewMode === '3d' ? (
                                <ThreeDPhotoViewer imageUrl={currentImage?.url} />
                            ) : (
                                <PanoramaViewer imageUrl={currentImage?.url} />
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
