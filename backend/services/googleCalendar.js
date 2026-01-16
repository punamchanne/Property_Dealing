const { google } = require('googleapis');

// Initialize Google Calendar API
const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

// Set credentials (in production, this should be done through OAuth flow)
// For now, we'll handle it gracefully if credentials are not set
if (process.env.GOOGLE_REFRESH_TOKEN) {
    oauth2Client.setCredentials({
        refresh_token: process.env.GOOGLE_REFRESH_TOKEN
    });
}

const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

/**
 * Create a Google Meet link for a meeting
 * @param {Object} meetingData - Meeting details
 * @returns {Promise<Object>} - Meet link and event ID
 */
exports.createGoogleMeet = async (meetingData) => {
    try {
        const { summary, description, startTime, attendees } = meetingData;

        // Check if Google API is configured
        if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_REFRESH_TOKEN) {
            console.warn('Google Calendar API not configured. Skipping Meet link creation.');
            return {
                meetLink: 'Google Meet not configured',
                eventId: null
            };
        }

        const endTime = new Date(startTime);
        endTime.setHours(endTime.getHours() + 1); // 1 hour meeting

        const event = {
            summary,
            description,
            start: {
                dateTime: startTime.toISOString(),
                timeZone: 'Asia/Kolkata'
            },
            end: {
                dateTime: endTime.toISOString(),
                timeZone: 'Asia/Kolkata'
            },
            attendees: attendees.map(email => ({ email })),
            conferenceData: {
                createRequest: {
                    requestId: `meet-${Date.now()}`,
                    conferenceSolutionKey: { type: 'hangoutsMeet' }
                }
            },
            reminders: {
                useDefault: false,
                overrides: [
                    { method: 'email', minutes: 24 * 60 },
                    { method: 'popup', minutes: 30 }
                ]
            }
        };

        const response = await calendar.events.insert({
            calendarId: 'primary',
            conferenceDataVersion: 1,
            sendUpdates: 'all',
            resource: event
        });

        const meetLink = response.data.hangoutLink || response.data.conferenceData?.entryPoints?.[0]?.uri || 'Meet link not available';

        return {
            meetLink,
            eventId: response.data.id
        };
    } catch (error) {
        console.error('Google Calendar API error:', error.message);
        // Return placeholder instead of throwing error
        return {
            meetLink: 'Google Meet link will be sent via email',
            eventId: null
        };
    }
};

/**
 * Delete a Google Calendar event
 * @param {string} eventId - Google Calendar event ID
 */
exports.deleteCalendarEvent = async (eventId) => {
    try {
        if (!eventId || !process.env.GOOGLE_REFRESH_TOKEN) {
            return;
        }

        await calendar.events.delete({
            calendarId: 'primary',
            eventId,
            sendUpdates: 'all'
        });
    } catch (error) {
        console.error('Error deleting calendar event:', error.message);
    }
};
