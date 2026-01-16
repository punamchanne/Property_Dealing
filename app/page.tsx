'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PropertyCard from '@/components/PropertyCard';
import Property360Section from '@/components/Property360Section';
import { Search, MapPin, ChevronLeft, ChevronRight, Building2, Home, TreePine, Store, Warehouse, TrendingUp, Users, Award, CheckCircle2, Eye } from 'lucide-react';
import { propertiesAPI } from '@/lib/api';
import { Property } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

const heroImages = [
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920&h=600&fit=crop',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=600&fit=crop'
];

const categories = [
  { name: 'Apartments', icon: Building2, count: '150+' },
  { name: 'Villas', icon: Home, count: '80+' },
  { name: 'Plots', icon: TreePine, count: '120+' },
  { name: 'Commercial', icon: Store, count: '45+' },
  { name: 'Office Space', icon: Warehouse, count: '60+' }
];

export default function HomePage() {
  const [featuredProperties, setFeaturedProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    loadFeaturedProperties();

    // Auto-slide carousel
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadFeaturedProperties = async () => {
    try {
      const response = await propertiesAPI.getAll({ featured: true, limit: 6 });
      setFeaturedProperties(response.data.properties);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/explore?search=${encodeURIComponent(searchQuery)}`;
    }
  };

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Carousel Section */}
      <section className="relative h-[600px] overflow-hidden bg-[#8A1C1C]">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
          >
            <div className="relative w-full h-full">
              <Image
                src={heroImages[currentSlide]}
                alt="Property"
                fill
                className="object-cover object-center"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
        >
          <ChevronLeft className="h-6 w-6 text-[#C62828]" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
        >
          <ChevronRight className="h-6 w-6 text-gray-900" />
        </button>

        {/* Hero Content */}
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Find Your Dream Home
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl md:text-2xl text-white/90 mb-8"
            >
              Discover the perfect property with 3D tours and virtual meetings
            </motion.p>

            {/* Search Box */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white rounded-2xl shadow-2xl p-6 max-w-3xl mx-auto"
            >
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search by location, property name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="pl-12 h-14 text-base border-gray-200 focus:border-[#C62828] focus:ring-[#C62828]/20 rounded-xl"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  size="lg"
                  className="h-14 px-8 bg-[#C62828] hover:bg-[#A81E1E] text-white shadow-md"
                >
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </Button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
          {heroImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${index === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Property Categories */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Explore by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/explore?type=${category.name}`}>
                  <div className="bg-white rounded-xl p-6 text-center hover:shadow-lg transition-all cursor-pointer border border-gray-100 group hover:border-[#C62828]/30">
                    <div className="bg-[#F3D6D6]/40 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#F3D6D6]/70 transition-colors">
                      <category.icon className="h-8 w-8 text-[#C62828]" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.count} Properties</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore More Properties - 3D Showcase */}
      <section className="py-12 bg-gradient-to-b from-sky-100 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Premium Properties
            </h2>
            <p className="text-xl text-gray-600">
              Discover stunning properties with immersive 360° virtual tours
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Apartments */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="group">
              <Link href="/explore?type=Apartment">
                <div className="relative h-80 overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop"
                    alt="Oasis Venetio Heights"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* 360° Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                    <Eye className="h-4 w-4" />
                    360°
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-1">Oasis Venetio Heights</h3>
                    <p className="text-white/80 text-sm">Opposite Zeta 1, site C Surajpur</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* VVIP Addresses */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="group">
              <Link href="/explore?type=Villa">
                <div className="relative h-80 overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&h=600&fit=crop"
                    alt="VVIP Addresses"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* 360° Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                    <Eye className="h-4 w-4" />
                    360°
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-1">VVIP Addresses</h3>
                    <p className="text-white/80 text-sm">VVIP Sector 12 Greater Noida West</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* ELDECO La Vida Bella */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group">
              <Link href="/explore?type=Apartment">
                <div className="relative h-80 overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&h=600&fit=crop"
                    alt="ELDECO La Vida Bella"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* 360° Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                    <Eye className="h-4 w-4" />
                    360°
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-1">ELDECO La Vida Bella</h3>
                    <p className="text-white/80 text-sm">West, Sector 12, Bahu Greater Noida</p>
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Oasis Grandstand */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="group">
              <Link href="/explore?type=Apartment">
                <div className="relative h-80 overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300">
                  <Image
                    src="https://images.unsplash.com/photo-1567684014761-b65e2e59b9eb?w=800&h=600&fit=crop"
                    alt="Oasis Grandstand"
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                  {/* 360° Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-gray-900 px-3 py-1.5 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg">
                    <Eye className="h-4 w-4" />
                    360°
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-xl font-bold text-white mb-1">Oasis Grandstand</h3>
                    <p className="text-white/80 text-sm">Sector-TS-02A-220, Yamuna Expy</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Properties</h2>
              <p className="text-gray-600 mt-2">Handpicked properties just for you</p>
            </div>
            <Link href="/explore">
              <Button variant="outline" className="border-2 border-[#C62828] text-[#C62828] hover:bg-[#F3D6D6]/30">
                View All
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-96 bg-gray-200 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <PropertyCard key={property._id} property={property} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-2xl">
              <Building2 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-lg mb-4">No featured properties available at the moment.</p>
              <Link href="/explore">
                <Button className="bg-[#C62828] hover:bg-[#A81E1E]">
                  Explore All Properties
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-8 bg-gradient-to-br from-[#FFE5E5] to-[#FFD6D6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Why Choose Us?</h2>
            <p className="text-xl text-gray-700">Experience the future of real estate</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm"
            >
              <div className="bg-[#C62828] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <Building2 className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">3D Property Tours</h3>
              <p className="text-gray-700">
                Explore every corner with interactive 3D models and virtual walkthroughs
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm"
            >
              <div className="bg-[#C62828] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <TrendingUp className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">360° Virtual Tours</h3>
              <p className="text-gray-700">
                Immersive 360-degree views that make you feel like you're really there
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="text-center bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm"
            >
              <div className="bg-[#C62828] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
                <Users className="h-10 w-10 text-white" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-gray-900">Virtual Meetings</h3>
              <p className="text-gray-700">
                Schedule instant Google Meet calls with property owners from anywhere
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#C62828] mb-2">500+</div>
              <div className="text-gray-600">Properties Listed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#C62828] mb-2">1000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#C62828] mb-2">50+</div>
              <div className="text-gray-600">Expert Agents</div>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-[#C62828] mb-2">15+</div>
              <div className="text-gray-600">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Award className="h-16 w-16 text-[#C62828] mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to Find Your Perfect Property?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of satisfied customers who found their dream homes with us
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/explore">
              <Button size="lg" className="bg-[#C62828] hover:bg-[#A81E1E] text-white px-8 shadow-md">
                Browse Properties
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button size="lg" variant="outline" className="border-2 border-[#C62828] text-[#C62828] hover:bg-[#F3D6D6]/30 px-8">
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
