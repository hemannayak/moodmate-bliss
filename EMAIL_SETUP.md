# 📧 Email Setup Guide for MoodMate

## Overview

Contact form submissions are automatically sent to **hemwritess@gmail.com** via email using Nodemailer with Gmail SMTP.

## Setup Instructions

### Step 1: Enable Gmail App Password

Since Gmail requires 2-factor authentication for app access, you need to generate an "App Password":

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/
   - Sign in with the Gmail account you want to use (hemwritess@gmail.com)

2. **Enable 2-Factor Authentication** (if not already enabled)
   - Go to Security → 2-Step Verification
   - Follow the prompts to enable it

3. **Generate App Password**
   - Go to Security → 2-Step Verification → App passwords
   - Or visit directly: https://myaccount.google.com/apppasswords
   - Select app: "Mail"
   - Select device: "Other (Custom name)"
   - Enter name: "MoodMate Backend"
   - Click "Generate"
   - **Copy the 16-character password** (it will look like: `abcd efgh ijkl mnop`)

### Step 2: Configure Backend Environment

Edit `backend/.env` and add:

```env
MONGODB_URI=mongodb://localhost:27017/moodmate
PORT=5001
JWT_SECRET=your_secret_key
NODE_ENV=development

# Email Configuration
EMAIL_USER=hemwritess@gmail.com
EMAIL_PASSWORD=abcd efgh ijkl mnop  # ← Paste your app password here (remove spaces)
```

**Important:** 
- Remove spaces from the app password
- Keep this file secure and never commit it to git

### Step 3: Install Nodemailer

```bash
cd backend
npm install
```

(nodemailer is already added to package.json)

### Step 4: Restart Backend Server

```bash
# Stop the current server (Ctrl+C)
# Start again:
cd backend
node server.js
```

## How It Works

### When a User Submits Contact Form:

1. **Form data is saved** to MongoDB (`contacts` collection)
2. **Email is sent to hemwritess@gmail.com** with:
   - User's name
   - User's email
   - Subject
   - Message
   - Type (contact/feedback/support)
   - Timestamp
3. **Auto-reply is sent to user** confirming receipt

### Email Format

**To hemwritess@gmail.com:**
```
Subject: MoodMate Contact: [User's Subject]

New Contact Form Submission

Name: John Doe
Email: john@example.com
Subject: Question about features
Type: contact
Date: Oct 8, 2025, 3:00 PM

Message:
[User's message here]

Reply to: john@example.com
```

**Auto-reply to User:**
```
Subject: Thank you for contacting MoodMate

Hi John,

Thank you for contacting MoodMate. We have received your message 
and will get back to you as soon as possible.

Our team typically responds within 24-48 hours during business days.

Best regards,
The MoodMate Team
```

## Testing

### Test Contact Form:

1. Start both servers (backend and frontend)
2. Go to Contact page: `http://localhost:5173/contact`
3. Fill in the form:
   - Name: Test User
   - Email: your_test_email@gmail.com
   - Subject: Test Message
   - Message: This is a test
4. Click "Send Message"
5. Check:
   - ✅ MongoDB Compass → `contacts` collection (data saved)
   - ✅ hemwritess@gmail.com inbox (email received)
   - ✅ Your test email inbox (auto-reply received)

### Test from Terminal:

```bash
curl -X POST http://localhost:5001/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Test",
    "message": "This is a test message",
    "type": "contact"
  }'
```

## Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Solution:**
- Make sure 2-factor authentication is enabled
- Generate a new App Password
- Copy it correctly (no spaces)
- Update `EMAIL_PASSWORD` in `.env`
- Restart backend server

### Error: "self signed certificate in certificate chain"

**Solution:** Add to `backend/config/email.js`:
```javascript
tls: {
  rejectUnauthorized: false
}
```

### Emails not being sent

**Check:**
1. Backend console for error messages
2. `EMAIL_USER` and `EMAIL_PASSWORD` are correct in `.env`
3. Gmail account has 2FA enabled
4. App password is valid
5. Backend server was restarted after changing `.env`

### Auto-reply not received

- Check spam/junk folder
- Verify email address is correct
- Check backend console for errors

## Security Notes

### ⚠️ Important Security Practices:

1. **Never commit `.env` file** to git (it's in `.gitignore`)
2. **Use App Password**, not your actual Gmail password
3. **Rotate App Passwords** periodically
4. **Revoke unused App Passwords** in Google Account settings
5. **For production**, consider using:
   - SendGrid
   - AWS SES
   - Mailgun
   - Or other professional email services

## Production Deployment

For production, you should:

1. **Use environment variables** from your hosting platform
2. **Consider email service providers:**
   - SendGrid (free tier: 100 emails/day)
   - AWS SES (very cheap, reliable)
   - Mailgun (free tier: 5,000 emails/month)
3. **Add rate limiting** to prevent spam
4. **Add CAPTCHA** to contact form
5. **Implement email queue** for better reliability

## Email Configuration Options

### Using Different Email Provider:

**Outlook/Hotmail:**
```javascript
service: 'hotmail'
```

**Yahoo:**
```javascript
service: 'yahoo'
```

**Custom SMTP:**
```javascript
host: 'smtp.example.com',
port: 587,
secure: false,
auth: {
  user: 'your_email',
  pass: 'your_password'
}
```

## API Endpoints

### Submit Contact Form
```
POST /api/contact
Body: {
  "name": "string",
  "email": "string",
  "subject": "string",
  "message": "string",
  "type": "contact" | "feedback" | "support" | "bug"
}
```

### Get My Submissions (Protected)
```
GET /api/contact/my-submissions
Headers: Authorization: Bearer <token>
```

### Get All Contacts (Admin)
```
GET /api/contact?status=new&type=contact
Headers: Authorization: Bearer <token>
```

## Summary

✅ **What's Configured:**
- Contact form sends email to hemwritess@gmail.com
- Auto-reply sent to user
- Data saved to MongoDB
- Beautiful HTML email templates
- Error handling

✅ **What You Need to Do:**
1. Generate Gmail App Password
2. Add to `backend/.env`:
   ```
   EMAIL_USER=hemwritess@gmail.com
   EMAIL_PASSWORD=your_app_password
   ```
3. Restart backend server
4. Test the contact form

🎉 **Done!** All contact form submissions will now be emailed to hemwritess@gmail.com!
