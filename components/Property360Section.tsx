'use client';

import { motion } from 'framer-motion';
import Property360Viewer from './Property360Viewer';
import { Sparkles, Eye, MousePointer2 } from 'lucide-react';

export default function Property360Section() {
    const properties360 = [
        {
            id: 1,
            title: 'Luxury Kitchen Interior',
            images: [
                '/properties/kitchen-luxury.jpg',
            ],
        },
        {
            id: 2,
            title: 'Modern Apartment Complex',
            images: [
                '/properties/apartment-building-1.jpg',
                '/properties/apartment-building-2.jpg',
                '/properties/modern-apartment.jpg',
            ],
        },
        {
            id: 3,
            title: 'Luxury Villa with Pool',
            images: [
                '/properties/luxury-villa-pool.jpg',
            ],
        },
    ];

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full mb-4">
                        <Sparkles className="h-5 w-5" />
                        <span className="font-semibold text-sm">IMMERSIVE EXPERIENCE</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Explore Properties in{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-primary-700">
                            360° View
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Experience properties like never before with our interactive 360° virtual tours.
                        Zoom, rotate, and explore every detail from the comfort of your home.
                    </p>
                </motion.div>

                {/* Features */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
                >
                    <div className="bg-white rounded-xl p-6 shadow-md border-2 border-purple-100">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <Eye className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">360° Panoramic Views</h3>
                        <p className="text-gray-600 text-sm">
                            Navigate through properties with full 360-degree panoramic images
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md border-2 border-primary-100">
                        <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                            <MousePointer2 className="h-6 w-6 text-primary-700" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">Interactive Controls</h3>
                        <p className="text-gray-600 text-sm">
                            Zoom in, rotate, and explore every corner with intuitive controls
                        </p>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-md border-2 border-green-100">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <Sparkles className="h-6 w-6 text-green-600" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-900 mb-2">High Quality Images</h3>
                        <p className="text-gray-600 text-sm">
                            Crystal clear, high-resolution images for the best viewing experience
                        </p>
                    </div>
                </motion.div>

                {/* 360° Viewers Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {properties360.map((property, index) => (
                        <motion.div
                            key={property.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Property360Viewer
                                images={property.images}
                                title={property.title}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="text-center mt-12"
                >
                    <p className="text-gray-600 mb-4">
                        Want to see more properties with 360° tours?
                    </p>
                    <button className="bg-gradient-to-r from-purple-600 to-primary-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105">
                        Explore All 360° Properties
                    </button>
                </motion.div>
            </div>
        </section>
    );
}
