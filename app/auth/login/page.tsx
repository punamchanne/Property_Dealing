'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const userData = await login(formData.email, formData.password);

            // Redirect based on user role
            // Redirect based on user role
            if (userData?.role === 'admin') {
                router.push('/admin');
            } else if (userData?.role === 'owner') {
                router.push('/dashboard/owner');
            } else {
                router.push('/dashboard/user');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Invalid email or password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Header */}
                        <div className="mb-10">
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome back</h1>
                            <p className="text-gray-600 text-lg">just one step to smarter buying.</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg flex items-center gap-3 text-red-700"
                            >
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm font-medium">{error}</span>
                            </motion.div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="email"
                                        placeholder="Enter Your Email Address"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="pl-12 h-14 rounded-xl border-gray-300 bg-white shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-base"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter Your Password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="pl-12 pr-12 h-14 rounded-xl border-gray-300 bg-white shadow-sm focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-base"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        checked={formData.rememberMe}
                                        onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                        className="w-4 h-4 text-primary-700 border-gray-300 rounded focus:ring-primary-500 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">Remember me</span>
                                </label>
                                <Link href="/auth/forgot-password" className="text-sm text-[#C62828] hover:text-[#A81E1E] font-semibold transition-colors">
                                    Forgot password?
                                </Link>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-14 bg-[#C62828] hover:bg-[#A81E1E] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all text-base"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        Signing in...
                                    </span>
                                ) : 'Log In'}
                            </Button>
                        </form>

                        {/* Sign Up Link */}
                        <p className="mt-8 text-center text-sm text-gray-600">
                            Don't have an account?{' '}
                            <Link href="/auth/register" className="text-[#C62828] hover:text-[#A81E1E] font-bold transition-colors">
                                Sign Up
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Decorative */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#8A1C1C] to-[#C62828] relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0 opacity-70">
                    <Image
                        src="/auth-penthouse-terrace.png"
                        alt="Luxury Penthouse Terrace"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Logo in top right */}
                <div className="absolute top-8 right-8 z-10">
                    <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                        <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8 bg-white rounded-lg p-1">
                                <Image
                                    src="/logo.png"
                                    alt="AI Homes"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <span className="text-white font-bold text-lg">AI Homes</span>
                        </div>
                    </div>
                </div>

                {/* Decorative Content */}
                <div className="flex items-center justify-center w-full p-12 relative z-10">
                    <div className="text-center text-white">
                        <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Find Your Dream Home</h2>
                        <p className="text-xl text-white/90 drop-shadow-md">Discover the perfect property with 3D tours and virtual meetings</p>
                    </div>
                </div>

                {/* Decorative Overlay - Lighter for better image visibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-700/30 to-primary-900/40"></div>
            </div>
        </div>
    );
}
