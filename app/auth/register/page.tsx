'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, AlertCircle, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

export default function RegisterPage() {
    const router = useRouter();
    const { register } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: 'user', // Default to user (buyer)
        agreeToTerms: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (!formData.agreeToTerms) {
            setError('Please agree to the Terms of Service and Privacy Policy');
            return;
        }

        setLoading(true);

        try {
            await register({
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                password: formData.password,
                role: formData.role,
            });
            // Redirect based on role
            if (formData.role === 'owner') {
                router.push('/dashboard/owner');
            } else if (formData.role === 'admin') {
                router.push('/admin');
            } else {
                router.push('/dashboard/user');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
                <div className="w-full max-w-md">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Create your account</h1>
                            <p className="text-gray-600">Join our community of buyers and property owners.</p>
                        </div>

                        {/* Role Selection */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div
                                className={`cursor-pointer relative overflow-hidden border-2 rounded-2xl p-6 text-center transition-all duration-300 group ${formData.role === 'user'
                                    ? 'border-[#C62828] bg-red-50/50 shadow-xl scale-[1.02] ring-1 ring-[#C62828]'
                                    : 'border-gray-100 hover:border-[#C62828] hover:bg-red-50/30'
                                    }`}
                            >
                                {formData.role === 'user' && <div className="absolute top-0 left-0 w-full h-1.5 bg-[#C62828]"></div>}
                                <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-3 transition-colors ${formData.role === 'user' ? 'bg-[#C62828] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-[#C62828]'
                                    }`}>
                                    <User className="w-7 h-7" />
                                </div>
                                <h3 className={`font-bold text-lg ${formData.role === 'user' ? 'text-[#C62828]' : 'text-gray-600 group-hover:text-[#C62828]'}`}>Buyer / Tenant</h3>
                            </div>

                            <div
                                className={`cursor-pointer relative overflow-hidden border-2 rounded-2xl p-6 text-center transition-all duration-300 group ${formData.role === 'owner'
                                    ? 'border-[#C62828] bg-red-50/50 shadow-xl scale-[1.02] ring-1 ring-[#C62828]'
                                    : 'border-gray-100 hover:border-[#C62828] hover:bg-red-50/30'
                                    }`}
                            >
                                {formData.role === 'owner' && <div className="absolute top-0 left-0 w-full h-1.5 bg-[#C62828]"></div>}
                                <div className={`w-14 h-14 mx-auto rounded-xl flex items-center justify-center mb-3 transition-colors ${formData.role === 'owner' ? 'bg-[#C62828] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-white group-hover:text-[#C62828]'
                                    }`}>
                                    <CheckCircle2 className="w-7 h-7" />
                                </div>
                                <h3 className={`font-bold text-lg ${formData.role === 'owner' ? 'text-[#C62828]' : 'text-gray-600 group-hover:text-[#C62828]'}`}>Owner / Agent</h3>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700"
                            >
                                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                                <span className="text-sm">{error}</span>
                            </motion.div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Enter Your Name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="pl-10 h-12 rounded-xl border-gray-300 focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all bg-gray-50 focus:bg-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="email"
                                        placeholder="Enter Your Email Address"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="pl-10 h-12 rounded-xl border-gray-300 focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all bg-gray-50 focus:bg-white"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Phone */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number (Optional)</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        type="tel"
                                        placeholder="Enter phone number"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        className="pl-10 h-12 rounded-xl border-gray-300 focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all bg-gray-50 focus:bg-white"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        className="pl-10 pr-10 h-12 rounded-xl border-gray-300 focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all bg-gray-50 focus:bg-white"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        className="pl-10 pr-10 h-12 rounded-xl border-gray-300 focus:border-primary-600 focus:ring-4 focus:ring-primary-100 transition-all bg-gray-50 focus:bg-white"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Terms Checkbox */}
                            <label className="flex items-start gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.agreeToTerms}
                                    onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                                    className="w-4 h-4 mt-1 text-primary-700 border-gray-300 rounded focus:ring-primary-500"
                                />
                                <span className="text-sm text-gray-600">
                                    I agree to the{' '}
                                    <Link href="/terms" className="text-primary-700 hover:text-primary-800 font-medium">
                                        Terms of Service
                                    </Link>{' '}
                                    and{' '}
                                    <Link href="/privacy" className="text-primary-700 hover:text-primary-800 font-medium">
                                        Privacy Policy
                                    </Link>
                                </span>
                            </label>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full h-12 bg-[#C62828] hover:bg-[#A81E1E] text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                            >
                                {loading ? 'Creating account...' : 'Submit'}
                            </Button>
                        </form>

                        {/* Sign In Link */}
                        <p className="mt-6 text-center text-sm text-gray-600">
                            Already have an account?{' '}
                            <Link href="/auth/login" className="text-[#C62828] hover:text-[#A81E1E] font-semibold">
                                Sign In
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
                        src="/auth-villa.png"
                        alt="Luxury Villa"
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
                            <span className="text-white font-extrabold text-2xl tracking-tight">AI Homes</span>
                        </div>
                    </div>
                </div>

                {/* Decorative Content */}
                <div className="flex items-center justify-center w-full p-12 relative z-10">
                    <div className="text-center text-white">
                        <h2 className="text-4xl font-bold mb-4 drop-shadow-lg">Join AI Homes Today</h2>
                        <p className="text-xl text-white/90 drop-shadow-md">Start your journey to finding the perfect property</p>
                    </div>
                </div>

                {/* Decorative Overlay - Lighter for better image visibility */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary-700/30 to-primary-900/40"></div>
            </div>
        </div>
    );
}
