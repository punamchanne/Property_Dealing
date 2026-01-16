'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Building2, Eye, Video, Calendar, Shield, Zap, Globe, Award } from 'lucide-react';

export default function FeaturesPage() {
    const features = [
        {
            icon: Building2,
            title: '3D Property Tours',
            description: 'Explore properties in stunning 3D with interactive models. Walk through every room virtually before visiting in person.',
            color: 'from-red-600 to-red-700',
        },
        {
            icon: Eye,
            title: '360° Virtual Tours',
            description: 'Immersive 360-degree views that make you feel like you\'re really there. Experience properties from every angle.',
            color: 'from-red-700 to-red-800',
        },
        {
            icon: Video,
            title: 'Virtual Meetings',
            description: 'Schedule instant Google Meet calls with property owners from anywhere. Connect face-to-face without traveling.',
            color: 'from-[#C62828] to-[#A81E1E]',
        },
        {
            icon: Calendar,
            title: 'Smart Scheduling',
            description: 'Book property visits at your convenience with our intelligent scheduling system integrated with Google Calendar.',
            color: 'from-[#A81E1E] to-[#8A1C1C]',
        },
        {
            icon: Shield,
            title: 'Verified Properties',
            description: 'All properties are verified by our team. Browse with confidence knowing every listing is authentic.',
            color: 'from-red-800 to-red-900',
        },
        {
            icon: Zap,
            title: 'Instant Search',
            description: 'Lightning-fast search with advanced filters. Find your perfect property in seconds, not hours.',
            color: 'from-red-500 to-red-600',
        },
        {
            icon: Globe,
            title: 'Multi-City Coverage',
            description: 'Browse properties across major Indian cities. From Mumbai to Bangalore, we\'ve got you covered.',
            color: 'from-red-600 to-red-700',
        },
        {
            icon: Award,
            title: 'Premium Support',
            description: '24/7 customer support to help you every step of the way. Our experts are always ready to assist.',
            color: 'from-[#8A1C1C] to-[#6B1515]',
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-[#FFE5E5] to-[#FFD6D6] py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
                    >
                        Powerful Features for Modern Property Search
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-gray-700 max-w-3xl mx-auto"
                    >
                        Experience the future of real estate with cutting-edge technology and innovative features designed to make your property search effortless.
                    </motion.p>
                </div>
            </section>

            {/* Features Grid */}
            <section className="py-6">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <div className={`relative bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-[#C62828]/30 h-full overflow-hidden`}>
                                    <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${feature.color}`}></div>
                                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg shadow-red-900/10`}>
                                        <feature.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#C62828] transition-colors">{feature.title}</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gray-50 py-8 border-t border-gray-100">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Ready to Experience These Features?
                    </h2>
                    <p className="text-xl text-gray-600 mb-8">
                        Start exploring properties with our advanced features today
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/explore"
                            className="bg-[#C62828] hover:bg-[#A81E1E] text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md"
                        >
                            Browse Properties
                        </Link>
                        <Link
                            href="/auth/register"
                            className="border-2 border-[#C62828] text-[#C62828] hover:bg-[#F3D6D6]/30 px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Sign Up Free
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
