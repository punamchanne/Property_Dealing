const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Property = require('../models/Property');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/properties
// @desc    Get all approved properties (with filters)
// @access  Public
router.get('/', async (req, res) => {
    try {
        const {
            type,
            city,
            minPrice,
            maxPrice,
            bedrooms,
            bathrooms,
            priceType,
            search,
            page = 1,
            limit = 12,
            sort = '-createdAt'
        } = req.query;

        // Build query
        const query = { approved: true };

        if (type) query.type = type;
        if (city) query['location.city'] = new RegExp(city, 'i');
        if (priceType) query.priceType = priceType;
        if (bedrooms) query.bedrooms = { $gte: parseInt(bedrooms) };
        if (bathrooms) query.bathrooms = { $gte: parseInt(bathrooms) };

        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = parseFloat(minPrice);
            if (maxPrice) query.price.$lte = parseFloat(maxPrice);
        }

        if (search) {
            query.$text = { $search: search };
        }

        // Execute query with pagination
        const properties = await Property.find(query)
            .populate('ownerId', 'name email phone')
            .sort(sort)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Property.countDocuments(query);

        res.json({
            success: true,
            count: properties.length,
            total: count,
            totalPages: Math.ceil(count / limit),
            currentPage: parseInt(page),
            properties
        });
    } catch (error) {
        console.error('Get properties error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching properties',
            error: error.message
        });
    }
});

// @route   GET /api/properties/:id
// @desc    Get single property by ID
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const property = await Property.findById(req.params.id)
            .populate('ownerId', 'name email phone avatar');

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Increment views
        property.views += 1;
        await property.save();

        res.json({
            success: true,
            property
        });
    } catch (error) {
        console.error('Get property error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching property',
            error: error.message
        });
    }
});

// @route   POST /api/properties
// @desc    Create a new property
// @access  Private (Owner/Admin)
router.post('/', protect, authorize('owner', 'admin'), [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('location.address').notEmpty().withMessage('Address is required')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const propertyData = {
            ...req.body,
            ownerId: req.user.id,
            approved: req.user.role === 'admin' // Auto-approve if admin
        };

        const property = await Property.create(propertyData);

        res.status(201).json({
            success: true,
            message: 'Property created successfully',
            property
        });
    } catch (error) {
        console.error('Create property error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating property',
            error: error.message
        });
    }
});

// @route   PUT /api/properties/:id
// @desc    Update property
// @access  Private (Owner of property/Admin)
router.put('/:id', protect, async (req, res) => {
    try {
        let property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Check ownership or admin
        if (property.ownerId.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this property'
            });
        }

        property = await Property.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json({
            success: true,
            message: 'Property updated successfully',
            property
        });
    } catch (error) {
        console.error('Update property error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating property',
            error: error.message
        });
    }
});

// @route   DELETE /api/properties/:id
// @desc    Delete property
// @access  Private (Admin only)
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        await property.deleteOne();

        res.json({
            success: true,
            message: 'Property deleted successfully'
        });
    } catch (error) {
        console.error('Delete property error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting property',
            error: error.message
        });
    }
});

// @route   PUT /api/properties/:id/approve
// @desc    Approve/reject property
// @access  Private (Admin only)
router.put('/:id/approve', protect, authorize('admin'), async (req, res) => {
    try {
        const { approved } = req.body;

        const property = await Property.findByIdAndUpdate(
            req.params.id,
            { approved },
            { new: true }
        );

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        res.json({
            success: true,
            message: `Property ${approved ? 'approved' : 'rejected'} successfully`,
            property
        });
    } catch (error) {
        console.error('Approve property error:', error);
        res.status(500).json({
            success: false,
            message: 'Error approving property',
            error: error.message
        });
    }
});

// @route   GET /api/properties/owner/my-properties
// @desc    Get properties owned by logged-in user
// @access  Private (Owner/Admin)
router.get('/owner/my-properties', protect, authorize('owner', 'admin'), async (req, res) => {
    try {
        const properties = await Property.find({ ownerId: req.user.id })
            .sort('-createdAt');

        res.json({
            success: true,
            count: properties.length,
            properties
        });
    } catch (error) {
        console.error('Get my properties error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching properties',
            error: error.message
        });
    }
});

module.exports = router;
