import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#8A1C1C] text-gray-100 border-t-8 border-[#C62828]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1">
                        <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
                            Property Dealing
                        </h3>
                        <p className="text-gray-300 mb-4">
                            Your trusted partner in finding the perfect property. Premium real estate platform with modern features.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-300 hover:text-white hover:scale-110 transition-all">
                                <Facebook className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white hover:scale-110 transition-all">
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white hover:scale-110 transition-all">
                                <Instagram className="h-5 w-5" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-white hover:scale-110 transition-all">
                                <Linkedin className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2">
                            <li><Link href="/" className="text-primary-200 hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/explore" className="text-primary-200 hover:text-white transition-colors">Explore</Link></li>
                            <li><Link href="/compare" className="text-primary-200 hover:text-white transition-colors">Compare</Link></li>
                            <li><Link href="/about" className="text-primary-200 hover:text-white transition-colors">About Us</Link></li>
                        </ul>
                    </div>

                    {/* Property Types */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Property Types</h4>
                        <ul className="space-y-2">
                            <li><Link href="/explore?type=Apartment" className="text-primary-200 hover:text-white transition-colors">Apartments</Link></li>
                            <li><Link href="/explore?type=Villa" className="text-primary-200 hover:text-white transition-colors">Villas</Link></li>
                            <li><Link href="/explore?type=Plot" className="text-primary-200 hover:text-white transition-colors">Plots</Link></li>
                            <li><Link href="/explore?type=Commercial" className="text-primary-200 hover:text-white transition-colors">Commercial</Link></li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-2 text-primary-200">
                                <MapPin className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <span>123 Real Estate Ave, Mumbai, India</span>
                            </li>
                            <li className="flex items-center gap-2 text-primary-200">
                                <Phone className="h-5 w-5 flex-shrink-0" />
                                <span>+91 1234567890</span>
                            </li>
                            <li className="flex items-center gap-2 text-primary-200">
                                <Mail className="h-5 w-5 flex-shrink-0" />
                                <span>info@propertydealing.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary-900 mt-8 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-primary-300 text-sm">
                            © 2026 Property Dealing Platform. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link href="/privacy" className="text-primary-300 hover:text-white text-sm transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-primary-300 hover:text-white text-sm transition-colors">
                                Terms & Conditions
                            </Link>
                            <Link href="/contact" className="text-primary-300 hover:text-white text-sm transition-colors">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
