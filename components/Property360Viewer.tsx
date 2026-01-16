'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import { Button } from './ui/button';

interface Tour360Image {
    url: string;
    publicId?: string;
    roomName?: string;
}

interface Property360ViewerProps {
    images: string[] | Tour360Image[];
    title: string;
}

// Helper function to get image URL from either string or object
const getImageUrl = (image: string | Tour360Image): string => {
    return typeof image === 'string' ? image : image.url;
};

export default function Property360Viewer({ images, title }: Property360ViewerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);

    const handleNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleZoomIn = () => {
        setZoom((prev) => Math.min(prev + 0.2, 3));
    };

    const handleZoomOut = () => {
        setZoom((prev) => Math.max(prev - 0.2, 0.5));
    };

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360);
    };

    return (
        <>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300"
            >
                <div className="relative h-64 w-full">
                    <Image
                        src={getImageUrl(images[0])}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                    {/* 360° Badge */}
                    <div className="absolute top-4 left-4 bg-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-2">
                        <svg className="w-5 h-5 animate-spin-slow" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z" />
                        </svg>
                        360° View
                    </div>

                    {/* Title */}
                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-2xl font-bold drop-shadow-lg">{title}</h3>
                        <p className="text-white/90 text-sm mt-1">Click to explore in 360°</p>
                    </div>
                </div>
            </button>

            {/* Fullscreen Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="relative w-full max-w-6xl h-[80vh] bg-gray-900 rounded-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="absolute top-4 right-4 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                            >
                                <X className="h-6 w-6 text-white" />
                            </button>

                            {/* Controls */}
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full p-2">
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleZoomOut}
                                    className="text-white hover:bg-white/20 rounded-full"
                                >
                                    <ZoomOut className="h-5 w-5" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleZoomIn}
                                    className="text-white hover:bg-white/20 rounded-full"
                                >
                                    <ZoomIn className="h-5 w-5" />
                                </Button>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleRotate}
                                    className="text-white hover:bg-white/20 rounded-full"
                                >
                                    <RotateCw className="h-5 w-5" />
                                </Button>
                                <div className="h-6 w-px bg-white/30 mx-2" />
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handlePrev}
                                    className="text-white hover:bg-white/20 rounded-full"
                                >
                                    ←
                                </Button>
                                <span className="text-white text-sm font-medium px-2">
                                    {currentImageIndex + 1} / {images.length}
                                </span>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={handleNext}
                                    className="text-white hover:bg-white/20 rounded-full"
                                >
                                    →
                                </Button>
                            </div>

                            {/* Image Display */}
                            <div className="relative w-full h-full flex items-center justify-center p-8">
                                <motion.div
                                    key={currentImageIndex}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{
                                        opacity: 1,
                                        scale: zoom,
                                        rotate: rotation
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="relative w-full h-full"
                                >
                                    <Image
                                        src={getImageUrl(images[currentImageIndex])}
                                        alt={`${title} - View ${currentImageIndex + 1}`}
                                        fill
                                        className="object-contain"
                                        priority
                                    />
                                </motion.div>
                            </div>

                            {/* Image Info */}
                            <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md rounded-lg p-4">
                                <h3 className="text-white font-bold text-lg">{title}</h3>
                                <p className="text-white/80 text-sm">360° Interactive View</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
