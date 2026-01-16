export interface Property {
    _id: string;
    title: string;
    description: string;
    type: 'Apartment' | 'Villa' | 'Plot' | 'House' | 'Commercial' | 'Office';
    price: number;
    priceType: 'sale' | 'rent';
    location: {
        address: string;
        city?: string;
        state?: string;
        country?: string;
        zipCode?: string;
        coordinates?: {
            lat: number;
            lng: number;
        };
    };
    images: Array<{
        url: string;
        publicId: string;
    }>;
    model3D?: {
        url: string;
        publicId: string;
    };
    tour360?: Array<{
        url: string;
        publicId: string;
        roomName: string;
    }>;
    amenities: string[];
    bedrooms?: number;
    bathrooms?: number;
    area?: {
        value: number;
        unit: 'sqft' | 'sqm';
    };
    ownerId: {
        _id: string;
        name: string;
        email: string;
        phone?: string;
        avatar?: string;
    };
    approved: boolean;
    featured: boolean;
    views: number;
    status: 'available' | 'sold' | 'rented' | 'pending';
    createdAt: string;
    updatedAt: string;
}

export interface Meeting {
    _id: string;
    userId: {
        _id: string;
        name: string;
        email: string;
        phone?: string;
    };
    ownerId: {
        _id: string;
        name: string;
        email: string;
        phone?: string;
    };
    propertyId: {
        _id: string;
        title: string;
        location: Property['location'];
        images: Property['images'];
        price: number;
    };
    scheduledDate: string;
    meetLink: string;
    eventId?: string;
    status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
    notes?: string;
    type: 'virtual' | 'in-person';
    createdAt: string;
    updatedAt: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'owner' | 'admin';
    phone?: string;
    avatar?: string;
    favorites: string[];
    createdAt: string;
}
