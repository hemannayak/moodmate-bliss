import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  // For Gmail, you'll need to:
  // 1. Enable 2-factor authentication
  // 2. Generate an "App Password" in Google Account settings
  // 3. Use that app password in EMAIL_PASSWORD
  
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send contact form email
export const sendContactEmail = async (contactData) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'hemwritess@gmail.com',
      subject: `MoodMate Contact: ${contactData.subject || 'New Message'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">New Contact Form Submission</h2>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${contactData.name}</p>
            <p><strong>Email:</strong> ${contactData.email}</p>
            <p><strong>Subject:</strong> ${contactData.subject || 'No subject'}</p>
            <p><strong>Type:</strong> ${contactData.type || 'contact'}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border-left: 4px solid #8b5cf6;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${contactData.message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #fef3c7; border-radius: 8px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Reply to:</strong> ${contactData.email}
            </p>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            This email was sent from MoodMate contact form
          </p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Email error:', error);
    return { success: false, error: error.message };
  }
};

// Send auto-reply to user
export const sendAutoReply = async (userEmail, userName) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Thank you for contacting MoodMate',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8b5cf6;">Thank You for Reaching Out!</h2>
          
          <p>Hi ${userName},</p>
          
          <p>Thank you for contacting MoodMate. We have received your message and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;">Our team typically responds within 24-48 hours during business days.</p>
          </div>
          
          <p>In the meantime, feel free to explore our app and track your mood journey!</p>
          
          <p>Best regards,<br>
          <strong>The MoodMate Team</strong></p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="color: #6b7280; font-size: 12px; text-align: center;">
            This is an automated message. Please do not reply to this email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Auto-reply sent to:', userEmail);
  } catch (error) {
    console.error('❌ Auto-reply error:', error);
  }
};
