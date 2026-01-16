'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { Home, MapPin, ChevronDown, User, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [locationDropdown, setLocationDropdown] = useState(false);
    const [residentialDropdown, setResidentialDropdown] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState('Select Location');

    const locations = [
        'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
        'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow'
    ];

    const residentialTypes = [
        { name: 'Apartments', href: '/explore?type=Apartment' },
        { name: 'Villas', href: '/explore?type=Villa' },
        { name: 'Houses', href: '/explore?type=House' },
        { name: 'Plots', href: '/explore?type=Plot' },
    ];

    const commercialTypes = [
        { name: 'Office Space', href: '/explore?type=Office Space' },
        { name: 'Retail Shops', href: '/explore?type=Commercial' },
        { name: 'Warehouses', href: '/explore?type=Warehouse' },
        { name: 'Co-working Spaces', href: '/explore?type=Co-working' },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-[#F3D6D6] border-b border-[#C62828]/20 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo and Location */}
                    <div className="flex items-center gap-4">
                        {/* Logo */}
                        <Logo />

                        {/* Location Selector */}
                        <div className="hidden md:block relative">
                            <button
                                onClick={() => setLocationDropdown(!locationDropdown)}
                                className="flex items-center gap-2 px-4 py-2.5 border-2 border-gray-200 rounded-lg hover:border-primary-700 hover:bg-primary-50 transition-all bg-white font-medium"
                            >
                                <MapPin className="h-4 w-4 text-primary-700" />
                                <span className="text-sm font-semibold text-gray-700">{selectedLocation}</span>
                                <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${locationDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Location Dropdown */}
                            {locationDropdown && (
                                <div className="absolute top-full left-0 mt-2 w-56 bg-white border-2 border-primary-700 rounded-lg shadow-xl py-2 max-h-64 overflow-y-auto z-50">
                                    {locations.map((location) => (
                                        <button
                                            key={location}
                                            onClick={() => {
                                                setSelectedLocation(location);
                                                setLocationDropdown(false);
                                            }}
                                            className="block w-full text-left px-4 py-2.5 hover:bg-primary-50 text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors"
                                        >
                                            {location}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link href="/explore" className="text-gray-900 hover:text-[#C62828] hover:bg-white/40 px-3 py-2 rounded-lg transition-all font-semibold text-sm">
                            Explore
                        </Link>

                        {/* Property Types Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setResidentialDropdown(!residentialDropdown)}
                                className="flex items-center gap-1 text-gray-700 hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-lg transition-all font-semibold text-sm"
                            >
                                Property Types
                                <ChevronDown className={`h-4 w-4 transition-transform ${residentialDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {residentialDropdown && (
                                <div className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-primary-700 rounded-lg shadow-xl py-2 z-50">
                                    {/* Residential Section */}
                                    <div className="px-3 py-2 border-b border-gray-200 bg-primary-50">
                                        <h3 className="text-xs font-bold text-primary-700 uppercase tracking-wider">Residential</h3>
                                    </div>
                                    {residentialTypes.map((type) => (
                                        <Link
                                            key={type.name}
                                            href={type.href}
                                            onClick={() => setResidentialDropdown(false)}
                                            className="block px-4 py-2.5 hover:bg-primary-50 text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors"
                                        >
                                            {type.name}
                                        </Link>
                                    ))}

                                    {/* Commercial Section */}
                                    <div className="px-3 py-2 border-b border-t border-gray-200 mt-2 bg-primary-50">
                                        <h3 className="text-xs font-bold text-primary-700 uppercase tracking-wider">Commercial</h3>
                                    </div>
                                    {commercialTypes.map((type) => (
                                        <Link
                                            key={type.name}
                                            href={type.href}
                                            onClick={() => setResidentialDropdown(false)}
                                            className="block px-4 py-2.5 hover:bg-primary-50 text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors"
                                        >
                                            {type.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href="/features" className="text-gray-700 hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-lg transition-all font-semibold text-sm">
                            Features
                        </Link>

                        <Link href="/about" className="text-gray-700 hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-lg transition-all font-semibold text-sm">
                            About Us
                        </Link>

                        {isAuthenticated && user?.role !== 'admin' && (
                            <>
                                <Link href="/wishlist" className="text-gray-700 hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-lg transition-all font-semibold text-sm">
                                    Wishlist
                                </Link>
                                <Link href="/live-events" className="text-gray-700 hover:text-primary-700 hover:bg-primary-50 px-3 py-2 rounded-lg transition-all font-semibold text-sm">
                                    Live Events
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                        {isAuthenticated ? (
                            <>
                                <Link href="/dashboard">
                                    <Button variant="ghost" className="flex items-center gap-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700">
                                        <User className="h-4 w-4" />
                                        {user?.name}
                                    </Button>
                                </Link>

                                <Button variant="ghost" onClick={logout} size="sm" className="flex items-center gap-2 text-gray-700 hover:bg-red-50 hover:text-red-700">
                                    <LogOut className="h-4 w-4" />
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth/register">
                                    <Button variant="outline" size="sm" className="border-2 border-[#C62828] text-[#C62828] hover:bg-white/50 font-semibold bg-transparent">
                                        Sign Up
                                    </Button>
                                </Link>
                                <Link href="/auth/login">
                                    <Button size="sm" className="bg-[#C62828] hover:bg-[#A81E1E] text-white font-semibold shadow-md hover:shadow-lg transition-all">
                                        Log In
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-700 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t bg-white">
                    <div className="px-4 py-4 space-y-3">
                        {/* Mobile Location Selector */}
                        <div className="pb-3 border-b">
                            <button
                                onClick={() => setLocationDropdown(!locationDropdown)}
                                className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg"
                            >
                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary-700" />
                                    <span className="text-sm font-medium">{selectedLocation}</span>
                                </div>
                                <ChevronDown className={`h-4 w-4 transition-transform ${locationDropdown ? 'rotate-180' : ''}`} />
                            </button>

                            {locationDropdown && (
                                <div className="mt-2 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                                    {locations.map((location) => (
                                        <button
                                            key={location}
                                            onClick={() => {
                                                setSelectedLocation(location);
                                                setLocationDropdown(false);
                                            }}
                                            className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
                                        >
                                            {location}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href="/explore" className="block py-2 text-gray-700 hover:text-primary-700 font-medium">
                            Explore
                        </Link>

                        {/* Mobile Property Types Dropdown */}
                        <div>
                            <button
                                onClick={() => setResidentialDropdown(!residentialDropdown)}
                                className="w-full flex items-center justify-between py-2 text-gray-700 hover:text-primary-700 font-medium"
                            >
                                Property Types
                                <ChevronDown className={`h-4 w-4 transition-transform ${residentialDropdown ? 'rotate-180' : ''}`} />
                            </button>
                            {residentialDropdown && (
                                <div className="pl-4 space-y-2 mt-2">
                                    <div className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-2">Residential</div>
                                    {residentialTypes.map((type) => (
                                        <Link
                                            key={type.name}
                                            href={type.href}
                                            className="block py-1 text-sm text-gray-600 hover:text-primary-700"
                                        >
                                            {type.name}
                                        </Link>
                                    ))}
                                    <div className="text-xs font-bold text-primary-700 uppercase tracking-wider mt-3 mb-2">Commercial</div>
                                    {commercialTypes.map((type) => (
                                        <Link
                                            key={type.name}
                                            href={type.href}
                                            className="block py-1 text-sm text-gray-600 hover:text-primary-700"
                                        >
                                            {type.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link href="/features" className="block py-2 text-gray-700 hover:text-primary-700 font-medium">
                            Features
                        </Link>

                        <Link href="/about" className="block py-2 text-gray-700 hover:text-primary-700 font-medium">
                            About Us
                        </Link>

                        {isAuthenticated && (
                            <>
                                <Link href="/wishlist" className="block py-2 text-gray-700 hover:text-primary-700 font-medium">
                                    Wishlist
                                </Link>
                                <Link href="/live-events" className="block py-2 text-gray-700 hover:text-primary-700 font-medium">
                                    Live Events
                                </Link>
                                <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-primary-700 font-medium">
                                    Dashboard
                                </Link>
                                {user?.role === 'admin' && (
                                    <Link href="/admin" className="block py-2 text-gray-700 hover:text-primary-700 font-medium">
                                        Admin Panel
                                    </Link>
                                )}
                                <button onClick={logout} className="block w-full text-left py-2 text-gray-700 hover:text-primary-700 font-medium">
                                    Logout
                                </button>
                            </>
                        )}

                        {!isAuthenticated && (
                            <div className="space-y-2 pt-2 border-t">
                                <Link href="/auth/register" className="block">
                                    <Button variant="outline" className="w-full border-primary-700 text-primary-700">
                                        Sign Up
                                    </Button>
                                </Link>
                                <Link href="/auth/login" className="block">
                                    <Button className="w-full bg-primary-700 hover:bg-primary-800">
                                        Log In
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
