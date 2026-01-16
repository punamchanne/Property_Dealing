const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Property = require('../models/Property');
const ActivityLog = require('../models/ActivityLog');
const { protect, authorize } = require('../middleware/auth');

// @route   GET /api/users
// @desc    Get all users (admin only)
// @access  Private (Admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const users = await User.find(query).select('-password').sort('-createdAt');

        res.json({
            success: true,
            count: users.length,
            users
        });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching users',
            error: error.message
        });
    }
});

// @route   PUT /api/users/:id/block
// @desc    Block a user (admin only)
// @access  Private (Admin)
router.put('/:id/block', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isBlocked: true },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await ActivityLog.create({
            user: req.user.id,
            action: 'BLOCK_USER',
            details: `Admin blocked user: ${user.email}`,
            metadata: { targetUserId: user._id.toString() }
        });

        res.json({ success: true, message: 'User blocked successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error blocking user', error: error.message });
    }
});

// @route   PUT /api/users/:id/unblock
// @desc    Unblock a user (admin only)
// @access  Private (Admin)
router.put('/:id/unblock', protect, authorize('admin'), async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { isBlocked: false },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        await ActivityLog.create({
            user: req.user.id,
            action: 'UNBLOCK_USER',
            details: `Admin unblocked user: ${user.email}`,
            metadata: { targetUserId: user._id.toString() }
        });

        res.json({ success: true, message: 'User unblocked successfully', user });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error unblocking user', error: error.message });
    }
});

// @route   GET /api/users/activity
// @desc    Get recent system activities (admin only)
// @access  Private (Admin)
router.get('/activity', protect, authorize('admin'), async (req, res) => {
    try {
        const activities = await ActivityLog.find()
            .populate('user', 'name email role avatar')
            .sort('-createdAt')
            .limit(50);

        res.json({ success: true, count: activities.length, activities });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching activities', error: error.message });
    }
});

// @route   GET /api/users/:id/activity
// @desc    Get specific user activity (admin only)
// @access  Private (Admin)
router.get('/:id/activity', protect, authorize('admin'), async (req, res) => {
    try {
        const activities = await ActivityLog.find({ user: req.params.id })
            .sort('-createdAt')
            .limit(100);

        res.json({ success: true, count: activities.length, activities });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error fetching user activity', error: error.message });
    }
});

// @route   PUT /api/users/:id/role
// @desc    Update user role (admin only)
// @access  Private (Admin)
router.put('/:id/role', protect, authorize('admin'), async (req, res) => {
    try {
        const { role } = req.body;

        if (!['user', 'owner', 'admin'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid role'
            });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { role },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: 'User role updated successfully',
            user
        });
    } catch (error) {
        console.error('Update role error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating user role',
            error: error.message
        });
    }
});

// @route   POST /api/users/favorites/:propertyId
// @desc    Add property to favorites
// @access  Private
router.post('/favorites/:propertyId', protect, async (req, res) => {
    try {
        const property = await Property.findById(req.params.propertyId);

        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        const user = await User.findById(req.user.id);

        if (user.favorites.includes(req.params.propertyId)) {
            return res.status(400).json({
                success: false,
                message: 'Property already in favorites'
            });
        }

        user.favorites.push(req.params.propertyId);
        await user.save();

        res.json({
            success: true,
            message: 'Property added to favorites',
            favorites: user.favorites
        });
    } catch (error) {
        console.error('Add favorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Error adding to favorites',
            error: error.message
        });
    }
});

// @route   DELETE /api/users/favorites/:propertyId
// @desc    Remove property from favorites
// @access  Private
router.delete('/favorites/:propertyId', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        user.favorites = user.favorites.filter(
            id => id.toString() !== req.params.propertyId
        );

        await user.save();

        res.json({
            success: true,
            message: 'Property removed from favorites',
            favorites: user.favorites
        });
    } catch (error) {
        console.error('Remove favorite error:', error);
        res.status(500).json({
            success: false,
            message: 'Error removing from favorites',
            error: error.message
        });
    }
});

// @route   GET /api/users/favorites
// @desc    Get user's favorite properties
// @access  Private
router.get('/favorites', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate('favorites');

        res.json({
            success: true,
            count: user.favorites.length,
            favorites: user.favorites
        });
    } catch (error) {
        console.error('Get favorites error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching favorites',
            error: error.message
        });
    }
});

module.exports = router;
