'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Phone, Lock, Save } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Account Settings</h1>
                <p className="text-gray-500 mt-1">Manage your profile and preferences</p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-[#C62828]/10 p-6 space-y-6">
                <div className="flex items-center gap-4 border-b border-gray-100 pb-6">
                    <div className="w-16 h-16 bg-[#F3D6D6] rounded-full flex items-center justify-center text-[#C62828] text-2xl font-bold border-2 border-[#C62828]">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-gray-900">{user?.name}</h2>
                        <p className="text-gray-500 text-sm">{user?.role === 'user' ? 'Buyer / Tenant' : 'Owner'}</p>
                    </div>
                </div>

                <form className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                defaultValue={user?.name}
                                className="pl-10 h-11 border-gray-200 focus:border-[#C62828] focus:ring-[#C62828]/20 rounded-xl"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                defaultValue={user?.email}
                                disabled
                                className="pl-10 h-11 bg-gray-50 border-gray-200 text-gray-500 rounded-xl"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Add phone number"
                                className="pl-10 h-11 border-gray-200 focus:border-[#C62828] focus:ring-[#C62828]/20 rounded-xl"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <Button className="w-full h-11 bg-[#C62828] hover:bg-[#A81E1E] text-white font-semibold rounded-xl">
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
