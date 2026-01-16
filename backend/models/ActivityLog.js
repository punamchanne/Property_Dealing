const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['LOGIN', 'REGISTER', 'UPLOAD_PROPERTY', 'UPDATE_PROPERTY', 'DELETE_PROPERTY', 'BOOK_VISIT', 'SCHEDULE_MEETING', 'BLOCK_USER', 'UNBLOCK_USER']
    },
    details: {
        type: String, // e.g., "User logged in", "Uploaded property: Sunny Villa"
        required: true
    },
    metadata: {
        type: Map,
        of: String // For storing extra IDs like propertyId, meetingId, etc.
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
