const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property',
        required: true
    },
    scheduledDate: {
        type: Date,
        required: [true, 'Please provide a meeting date']
    },
    meetLink: {
        type: String,
        default: ''
    },
    eventId: {
        type: String, // Google Calendar Event ID
        default: ''
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
        default: 'scheduled'
    },
    notes: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        enum: ['virtual', 'in-person'],
        default: 'virtual'
    }
}, {
    timestamps: true
});

// Index for efficient queries
meetingSchema.index({ userId: 1, scheduledDate: -1 });
meetingSchema.index({ ownerId: 1, scheduledDate: -1 });

module.exports = mongoose.model('Meeting', meetingSchema);
