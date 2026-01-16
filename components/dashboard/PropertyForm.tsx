'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Upload, X, Building2, MapPin, DollarSign, Ruler, Bed, Bath, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Property } from '@/types';
import { uploadAPI } from '@/lib/api';
import { toast } from 'sonner';
import Image from 'next/image';

interface PropertyFormProps {
    initialData?: Partial<Property>;
    onSubmit: (data: any) => Promise<void>;
    isLoading?: boolean;
    buttonText?: string;
}

export default function PropertyForm({ initialData, onSubmit, isLoading, buttonText = 'Submit' }: PropertyFormProps) {
    const [uploading, setUploading] = useState(false);
    const [images, setImages] = useState<{ url: string; publicId: string; file?: File }[]>(
        initialData?.images || []
    );
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        type: initialData?.type || 'Apartment',
        status: initialData?.status || 'available',
        priceType: initialData?.priceType || 'sale',
        area: initialData?.area?.value || '',
        bedrooms: initialData?.bedrooms || '',
        bathrooms: initialData?.bathrooms || '',
        location: {
            address: initialData?.location?.address || '',
            city: initialData?.location?.city || '',
            state: initialData?.location?.state || '',
            zipCode: initialData?.location?.zipCode || '',
        },
        amenities: initialData?.amenities?.join(', ') || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev: any) => ({
                ...prev,
                [parent]: { ...prev[parent], [child]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        setUploading(true);
        const newImages: { url: string; publicId: string; file?: File }[] = [];

        try {
            // Upload immediately or just preview? 
            // Better to upload on submit? Or upload individually?
            // User plan mentioned uploadAPI.uploadImage
            // Let's upload immediately to get URLs for preview
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const res = await uploadAPI.uploadImage(file);
                // Assuming res.data contains { url, publicId }
                newImages.push({
                    url: res.data.url,
                    publicId: res.data.publicId,
                    file: file
                });
            }
            setImages((prev) => [...prev, ...newImages]);
            toast.success('Images uploaded successfully');
        } catch (error) {
            console.error('Upload failed', error);
            toast.error('Failed to upload images');
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Prepare data matching Property interface structure
        const submissionData = {
            ...formData,
            price: Number(formData.price),
            bedrooms: Number(formData.bedrooms),
            bathrooms: Number(formData.bathrooms),
            area: {
                value: Number(formData.area),
                unit: 'sqft' // Fixed for now
            },
            location: {
                ...formData.location
            },
            amenities: formData.amenities.split(',').map((item) => item.trim()).filter(Boolean),
            images: images
        };

        if (images.length === 0) {
            toast.error('Please upload at least one image');
            return;
        }

        await onSubmit(submissionData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-primary-100">
            {/* Basic Info */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4">Basic Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Property Title</label>
                        <Input
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Luxury Apartment in Mumbai"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Property Type</label>
                        <select
                            name="type"
                            value={formData.type}
                            onChange={(e) => handleSelectChange('type', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="Apartment">Apartment</option>
                            <option value="Villa">Villa</option>
                            <option value="House">House</option>
                            <option value="Plot">Plot</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Office">Office</option>
                        </select>
                    </div>
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Describe the property features, neighborhood, etc."
                            rows={4}
                            required
                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>
                </div>
            </div>

            {/* Pricing & Dimensions */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4">Pricing & Area</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Price (₹)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                name="price"
                                type="number"
                                value={formData.price}
                                onChange={handleChange}
                                className="pl-9"
                                placeholder="0.00"
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Listing Type</label>
                        <select
                            name="priceType"
                            value={formData.priceType}
                            onChange={(e) => handleSelectChange('priceType', e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="sale">For Sale</option>
                            <option value="rent">For Rent</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Area (sq ft)</label>
                        <div className="relative">
                            <Ruler className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                name="area"
                                type="number"
                                value={formData.area}
                                onChange={handleChange}
                                className="pl-9"
                                placeholder="Total area"
                                required
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Location */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4">Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Address Line</label>
                        <Input
                            name="location.address"
                            value={formData.location.address}
                            onChange={handleChange}
                            placeholder="Building No, Street Name"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">City</label>
                        <Input
                            name="location.city"
                            value={formData.location.city}
                            onChange={handleChange}
                            placeholder="City"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">State</label>
                        <Input
                            name="location.state"
                            value={formData.location.state}
                            onChange={handleChange}
                            placeholder="State"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Zip Code</label>
                        <Input
                            name="location.zipCode"
                            value={formData.location.zipCode}
                            onChange={handleChange}
                            placeholder="Zip Code"
                        />
                    </div>
                </div>
            </div>

            {/* Features (Bed/Bath) - conditionally show based on type? */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Bedrooms</label>
                        <div className="relative">
                            <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                name="bedrooms"
                                type="number"
                                value={formData.bedrooms}
                                onChange={handleChange}
                                className="pl-9"
                                placeholder="Num beds"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Bathrooms</label>
                        <div className="relative">
                            <Bath className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                name="bathrooms"
                                type="number"
                                value={formData.bathrooms}
                                onChange={handleChange}
                                className="pl-9"
                                placeholder="Num baths"
                            />
                        </div>
                    </div>
                    <div className="space-y-2 md:col-span-3">
                        <label className="text-sm font-medium text-gray-700">Amenities (comma separated)</label>
                        <div className="relative">
                            <List className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <textarea
                                name="amenities"
                                value={formData.amenities}
                                onChange={handleChange}
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 pl-9"
                                placeholder="Swimming Pool, Gym, Parking, WiFi..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Images */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2 mb-4">Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                        <div key={index} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                            <Image
                                src={img.url}
                                alt={`Upload ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    <label className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-primary-200 rounded-lg cursor-pointer hover:bg-primary-50 transition-colors">
                        {uploading ? (
                            <Loader2 className="h-8 w-8 text-primary-400 animate-spin" />
                        ) : (
                            <>
                                <Upload className="h-8 w-8 text-primary-400 mb-2" />
                                <span className="text-sm text-primary-600 font-medium">Add Images</span>
                            </>
                        )}
                        <input
                            type="file"
                            multiple
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageUpload}
                            disabled={uploading}
                        />
                    </label>
                </div>
            </div>

            {/* Actions */}
            <div className="pt-4 flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => window.history.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading || uploading} className="min-w-[120px] bg-primary-600 hover:bg-primary-700">
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    {buttonText}
                </Button>
            </div>
        </form>
    );
}
