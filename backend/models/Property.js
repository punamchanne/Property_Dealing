const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide a property title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
        trim: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Apartment', 'Villa', 'Plot', 'House', 'Commercial', 'Office'],
        default: 'Apartment'
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price']
    },
    priceType: {
        type: String,
        enum: ['sale', 'rent'],
        default: 'sale'
    },
    location: {
        address: {
            type: String,
            required: [true, 'Please provide an address']
        },
        city: String,
        state: String,
        country: String,
        zipCode: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    images: [{
        url: {
            type: String,
            required: true
        },
        publicId: String,
        roomType: {
            type: String,
            enum: ['bedroom', 'living-room', 'kitchen', 'bathroom', 'balcony', 'dining-room', 'exterior', 'lobby', 'parking', 'gym', 'pool', 'garden', 'other'],
            default: 'other'
        },
        viewType: {
            type: String,
            enum: ['2d', '3d', '360'],
            default: '2d'
        },
        caption: String,
        isPrimary: {
            type: Boolean,
            default: false
        },
        order: {
            type: Number,
            default: 0
        }
    }],
    // Legacy fields for backward compatibility
    model3D: {
        url: String,
        publicId: String
    },
    tour360: [{
        url: String,
        publicId: String,
        roomName: String
    }],
    amenities: [String],
    bedrooms: Number,
    bathrooms: Number,
    area: {
        value: Number,
        unit: {
            type: String,
            enum: ['sqft', 'sqm'],
            default: 'sqft'
        }
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['available', 'sold', 'rented', 'pending'],
        default: 'available'
    }
}, {
    timestamps: true
});

// Index for search optimization
propertySchema.index({ title: 'text', description: 'text' });
propertySchema.index({ 'location.city': 1, price: 1 });

module.exports = mongoose.model('Property', propertySchema);
