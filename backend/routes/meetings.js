const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Meeting = require('../models/Meeting');
const Property = require('../models/Property');
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');
const { createGoogleMeet } = require('../services/googleCalendar');
const { sendMeetingEmail } = require('../services/email');

// @route   POST /api/meetings
// @desc    Schedule a new meeting
// @access  Private
router.post('/', protect, [
    body('propertyId').notEmpty().withMessage('Property ID is required'),
    body('scheduledDate').isISO8601().withMessage('Valid date is required'),
    body('type').optional().isIn(['virtual', 'in-person']).withMessage('Invalid meeting type')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
    }

    try {
        const { propertyId, scheduledDate, notes, type } = req.body;

        // Get property and owner details
        const property = await Property.findById(propertyId).populate('ownerId');
        if (!property) {
            return res.status(404).json({
                success: false,
                message: 'Property not found'
            });
        }

        // Create Google Meet link if virtual meeting
        let meetLink = '';
        let eventId = '';

        if (type === 'virtual' || !type) {
            try {
                const meetData = await createGoogleMeet({
                    summary: `Property Visit: ${property.title}`,
                    description: `Virtual property tour for ${property.title}`,
                    startTime: new Date(scheduledDate),
                    attendees: [req.user.email, property.ownerId.email]
                });

                meetLink = meetData.meetLink;
                eventId = meetData.eventId;
            } catch (error) {
                console.error('Google Meet creation error:', error);
                // Continue without Meet link if Google API fails
                meetLink = 'To be provided';
            }
        }

        // Create meeting
        const meeting = await Meeting.create({
            userId: req.user.id,
            ownerId: property.ownerId._id,
            propertyId,
            scheduledDate,
            meetLink,
            eventId,
            notes,
            type: type || 'virtual'
        });

        // Send email notifications
        try {
            await sendMeetingEmail({
                userEmail: req.user.email,
                ownerEmail: property.ownerId.email,
                propertyTitle: property.title,
                meetingDate: scheduledDate,
                meetLink
            });
        } catch (error) {
            console.error('Email sending error:', error);
        }

        const populatedMeeting = await Meeting.findById(meeting._id)
            .populate('userId', 'name email phone')
            .populate('ownerId', 'name email phone')
            .populate('propertyId', 'title location images');

        res.status(201).json({
            success: true,
            message: 'Meeting scheduled successfully',
            meeting: populatedMeeting
        });
    } catch (error) {
        console.error('Create meeting error:', error);
        res.status(500).json({
            success: false,
            message: 'Error scheduling meeting',
            error: error.message
        });
    }
});

// @route   GET /api/meetings
// @desc    Get user's meetings
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { status, upcoming } = req.query;

        const query = {
            $or: [
                { userId: req.user.id },
                { ownerId: req.user.id }
            ]
        };

        if (status) {
            query.status = status;
        }

        if (upcoming === 'true') {
            query.scheduledDate = { $gte: new Date() };
        }

        const meetings = await Meeting.find(query)
            .populate('userId', 'name email phone')
            .populate('ownerId', 'name email phone')
            .populate('propertyId', 'title location images price')
            .sort('scheduledDate');

        res.json({
            success: true,
            count: meetings.length,
            meetings
        });
    } catch (error) {
        console.error('Get meetings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching meetings',
            error: error.message
        });
    }
});

// @route   GET /api/meetings/admin
// @desc    Get all meetings (admin only)
// @access  Private (Admin)
router.get('/admin', protect, authorize('admin'), async (req, res) => {
    try {
        const meetings = await Meeting.find()
            .populate('userId', 'name email phone')
            .populate('ownerId', 'name email phone')
            .populate('propertyId', 'title location price')
            .sort('-createdAt');

        res.json({
            success: true,
            count: meetings.length,
            meetings
        });
    } catch (error) {
        console.error('Get all meetings error:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching meetings',
            error: error.message
        });
    }
});

// @route   PUT /api/meetings/:id
// @desc    Update meeting status
// @access  Private
router.put('/:id', protect, async (req, res) => {
    try {
        const { status, notes } = req.body;

        let meeting = await Meeting.findById(req.params.id);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found'
            });
        }

        // Check if user is part of the meeting
        if (meeting.userId.toString() !== req.user.id &&
            meeting.ownerId.toString() !== req.user.id &&
            req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this meeting'
            });
        }

        meeting = await Meeting.findByIdAndUpdate(
            req.params.id,
            { status, notes },
            { new: true }
        ).populate('userId ownerId propertyId');

        res.json({
            success: true,
            message: 'Meeting updated successfully',
            meeting
        });
    } catch (error) {
        console.error('Update meeting error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating meeting',
            error: error.message
        });
    }
});

// @route   DELETE /api/meetings/:id
// @desc    Cancel/delete meeting
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        const meeting = await Meeting.findById(req.params.id);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found'
            });
        }

        // Check authorization
        if (meeting.userId.toString() !== req.user.id &&
            meeting.ownerId.toString() !== req.user.id &&
            req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this meeting'
            });
        }

        await meeting.deleteOne();

        res.json({
            success: true,
            message: 'Meeting cancelled successfully'
        });
    } catch (error) {
        console.error('Delete meeting error:', error);
        res.status(500).json({
            success: false,
            message: 'Error cancelling meeting',
            error: error.message
        });
    }
});

module.exports = router;
