const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
    // Check if email is configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
        console.warn('Email service not configured');
        return null;
    }

    return nodemailer.createTransporter({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

/**
 * Send meeting confirmation email
 * @param {Object} emailData - Email details
 */
exports.sendMeetingEmail = async (emailData) => {
    try {
        const transporter = createTransporter();

        if (!transporter) {
            console.log('Email not sent - service not configured');
            return;
        }

        const { userEmail, ownerEmail, propertyTitle, meetingDate, meetLink } = emailData;

        const mailOptions = {
            from: `"Property Dealing Platform" <${process.env.EMAIL_USER}>`,
            to: [userEmail, ownerEmail].join(', '),
            subject: `Property Visit Scheduled - ${propertyTitle}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #D32F2F 0%, #B71C1C 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">Property Visit Scheduled</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #D32F2F;">Meeting Details</h2>
            
            <p><strong>Property:</strong> ${propertyTitle}</p>
            <p><strong>Date & Time:</strong> ${new Date(meetingDate).toLocaleString('en-IN', {
                dateStyle: 'full',
                timeStyle: 'short',
                timeZone: 'Asia/Kolkata'
            })}</p>
            
            ${meetLink && meetLink !== 'To be provided' ? `
              <div style="margin: 30px 0;">
                <a href="${meetLink}" 
                   style="background: #D32F2F; color: white; padding: 15px 30px; 
                          text-decoration: none; border-radius: 5px; display: inline-block;">
                  Join Google Meet
                </a>
              </div>
            ` : '<p><em>Meeting link will be provided shortly.</em></p>'}
            
            <p style="margin-top: 30px; color: #666;">
              Please be on time for your scheduled property visit. If you need to reschedule, 
              please contact us as soon as possible.
            </p>
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">© 2026 Property Dealing Platform. All rights reserved.</p>
          </div>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
        console.log('Meeting email sent successfully');
    } catch (error) {
        console.error('Email sending error:', error.message);
        // Don't throw error - email is not critical
    }
};

/**
 * Send property approval notification
 * @param {Object} emailData - Email details
 */
exports.sendPropertyApprovalEmail = async (emailData) => {
    try {
        const transporter = createTransporter();

        if (!transporter) {
            return;
        }

        const { ownerEmail, propertyTitle, approved } = emailData;

        const mailOptions = {
            from: `"Property Dealing Platform" <${process.env.EMAIL_USER}>`,
            to: ownerEmail,
            subject: `Property ${approved ? 'Approved' : 'Rejected'} - ${propertyTitle}`,
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: ${approved ? '#4CAF50' : '#D32F2F'}; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">
              Property ${approved ? 'Approved' : 'Rejected'}
            </h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <p>Your property listing "<strong>${propertyTitle}</strong>" has been 
               ${approved ? 'approved and is now live on our platform' : 'rejected'}.</p>
            
            ${approved ? `
              <p>Your property is now visible to potential buyers/renters. 
                 You will receive notifications when users schedule visits.</p>
            ` : `
              <p>Please review your listing and make necessary changes before resubmitting.</p>
            `}
          </div>
          
          <div style="background: #333; color: white; padding: 20px; text-align: center;">
            <p style="margin: 0;">© 2026 Property Dealing Platform. All rights reserved.</p>
          </div>
        </div>
      `
        };

        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error('Email sending error:', error.message);
    }
};
