'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PropertyForm from '@/components/dashboard/PropertyForm';
import { propertiesAPI } from '@/lib/api';
import { toast } from 'sonner';

export default function OwnerAddPropertyPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (data: any) => {
        try {
            setIsLoading(true);
            await propertiesAPI.create(data);
            toast.success('Property listed successfully pending approval!');
            router.push('/dashboard/owner/properties');
        } catch (error) {
            console.error('Failed to create property:', error);
            toast.error('Failed to create property listing');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
                <p className="text-gray-500 mt-1">Fill in the details to list your property</p>
            </div>

            <PropertyForm
                onSubmit={handleSubmit}
                isLoading={isLoading}
                buttonText="List Property"
            />
        </div>
    );
}
