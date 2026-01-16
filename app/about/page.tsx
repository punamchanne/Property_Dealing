'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Users, Target, Award, TrendingUp, Heart, Shield } from 'lucide-react';

export default function AboutPage() {
    const stats = [
        { number: '500+', label: 'Properties Listed' },
        { number: '1000+', label: 'Happy Customers' },
        { number: '50+', label: 'Expert Agents' },
        { number: '15+', label: 'Years Experience' },
    ];

    const values = [
        {
            icon: Heart,
            title: 'Customer First',
            description: 'We prioritize our customers\' needs and satisfaction above everything else.',
        },
        {
            icon: Shield,
            title: 'Trust & Transparency',
            description: 'Honest dealings and transparent processes are the foundation of our business.',
        },
        {
            icon: Award,
            title: 'Excellence',
            description: 'We strive for excellence in every property listing and customer interaction.',
        },
        {
            icon: TrendingUp,
            title: 'Innovation',
            description: 'Leveraging cutting-edge technology to revolutionize real estate.',
        },
    ];

    const team = [
        {
            name: 'Rajesh Kumar',
            role: 'CEO & Founder',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop',
        },
        {
            name: 'Priya Sharma',
            role: 'Head of Operations',
            image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
        },
        {
            name: 'Amit Patel',
            role: 'Technology Lead',
            image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=400&fit=crop',
        },
        {
            name: 'Sneha Reddy',
            role: 'Customer Success',
            image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop',
        },
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-[#FFE5E5] to-[#FFD6D6] py-8">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                        backgroundSize: '40px 40px'
                    }} />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-bold mb-6 text-gray-900"
                        >
                            About PropTek Real Estate
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-gray-700 max-w-3xl mx-auto"
                        >
                            Revolutionizing the real estate industry with technology, transparency, and trust since 2010.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-4 bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <motion.div
                                key={stat.label}
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="text-3xl md:text-4xl font-extrabold text-[#C62828] mb-1">{stat.number}</div>
                                <div className="text-gray-500 font-medium text-sm uppercase tracking-wide">{stat.label}</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Story */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                Founded in 2010, PropTek Real Estate started with a simple mission: to make property buying and selling transparent, efficient, and accessible to everyone. What began as a small team of passionate real estate professionals has grown into one of India's leading property platforms.
                            </p>
                            <p className="text-gray-600 mb-4 leading-relaxed">
                                We recognized early on that technology could transform the real estate industry. By combining cutting-edge 3D visualization, virtual tours, and smart scheduling with traditional real estate expertise, we've created a platform that serves both buyers and sellers better than ever before.
                            </p>
                            <p className="text-gray-600 leading-relaxed">
                                Today, we're proud to have helped thousands of families find their dream homes and assisted countless property owners in selling their properties at the best prices.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative h-96 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=600&fit=crop"
                                alt="Our Team"
                                fill
                                className="object-cover"
                            />
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Our Values */}
            <section className="py-8 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
                        <p className="text-xl text-gray-600">The principles that guide everything we do</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-xl p-6 shadow-lg text-center"
                            >
                                <div className="bg-[#F3D6D6]/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <value.icon className="h-8 w-8 text-[#C62828]" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Our Team */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                        <p className="text-xl text-gray-600">The people behind your property journey</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <motion.div
                                key={member.name}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="group"
                            >
                                <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow">
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-6 text-center">
                                        <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                        <p className="text-[#C62828] font-medium">{member.role}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-gradient-to-br from-[#FFE5E5] to-[#FFD6D6] py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">Join Us on This Journey</h2>
                    <p className="text-xl text-gray-700 mb-8">
                        Whether you're buying, selling, or just exploring, we're here to help you every step of the way.
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
                            className="border-2 border-[#C62828] text-[#C62828] hover:bg-white px-8 py-3 rounded-lg font-semibold transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
