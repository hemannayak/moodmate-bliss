# ✅ MoodMate Backend Integration Checklist

## Configuration Checks

### ✅ Backend Configuration (`backend/.env`)
```env
MONGODB_URI=mongodb://localhost:27017/moodmate  # ← Your MongoDB connection string
PORT=5001                                        # ← Using 5001 (5000 was in use)
JWT_SECRET=your_secret_key                       # ← Change in production
NODE_ENV=development
```

**Status:** ✅ Configured

### ✅ Frontend Configuration (`.env`)
```env
VITE_API_URL=http://localhost:5001/api
```

**Status:** ✅ Configured

### ✅ CORS Configuration (`backend/server.js`)
```javascript
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://127.0.0.1:5173'],
  credentials: true
}));
```

**Status:** ✅ Configured - Allows frontend on ports 5173, 5174, and 127.0.0.1:5173

## Data Storage - What Gets Saved to MongoDB

### ✅ 1. User Authentication (Signup/Login)
**Collection:** `users`

**Data Stored:**
- Email (unique, lowercase)
- Password (hashed with bcrypt)
- Created timestamp
- Updated timestamp

**API Endpoints:**
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

**Frontend Pages:** Login, Signup

---

### ✅ 2. Mood Logs (Mood Tracker)
**Collection:** `moodlogs`

**Data Stored:**
- User ID (reference to user)
- Mood emoji (😊, 😢, etc.)
- Mood name (Happy, Sad, etc.)
- Intensity (1-10)
- Sleep quality (1-10)
- Stress level (1-10)
- Tags (work, friends, family, etc.)
- Note/description
- Activity metrics:
  - Typing speed
  - Cursor movement
  - Click frequency
  - Session duration
  - Idle time
  - Inferred mood
- Date/timestamp

**API Endpoints:**
- `GET /api/mood-logs` - Get all mood logs
- `POST /api/mood-logs` - Create mood log
- `GET /api/mood-logs/:id` - Get single log
- `PUT /api/mood-logs/:id` - Update log
- `DELETE /api/mood-logs/:id` - Delete log
- `GET /api/mood-logs/stats` - Get statistics

**Frontend Pages:** MoodTracker

---

### ✅ 3. Journal Entries
**Collection:** `journalentries`

**Data Stored:**
- User ID (reference to user)
- Title
- Content (full text)
- Mood emoji
- Emotion tags (Happy, Sad, Anxious, etc.)
- Context tags (Work, Family, Study, etc.)
- Photo (base64 encoded image)
- AI Analysis (optional):
  - Sentiment
  - Emotions detected
  - Summary
  - Reflection
  - Suggestion
  - Affirmation
- Date/timestamp

**API Endpoints:**
- `GET /api/journal` - Get all entries
- `GET /api/journal?search=keyword` - Search entries
- `POST /api/journal` - Create entry
- `GET /api/journal/:id` - Get single entry
- `PUT /api/journal/:id` - Update entry
- `DELETE /api/journal/:id` - Delete entry

**Frontend Pages:** Journal

---

### ✅ 4. Contact/Feedback Forms
**Collection:** `contacts`

**Data Stored:**
- Name
- Email
- Subject
- Message
- Type (contact, feedback, support, bug)
- Status (new, read, responded, closed)
- User ID (optional - if logged in)
- Date/timestamp

**API Endpoints:**
- `POST /api/contact` - Submit contact form (public)
- `GET /api/contact/my-submissions` - Get user's submissions (protected)
- `GET /api/contact` - Get all contacts (admin)
- `PUT /api/contact/:id/status` - Update status (admin)

**Frontend Pages:** Contact

---

### ✅ 5. Analytics Data
**Source:** Derived from MoodLogs collection

**What's Analyzed:**
- Current streak (consecutive days)
- Average mood intensity
- Total logs count
- Most common mood
- Today's log count
- Weekly average
- Positivity rate
- Consistency percentage
- Mood distribution over time

**API Endpoint:**
- `GET /api/mood-logs/stats` - Get all statistics

**Frontend Pages:** Analytics, MoodTracker

---

## Server Restart Requirements

### ⚠️ Must Restart Backend When:
- ✅ `.env` file is changed
- ✅ Server code is modified (`server.js`, controllers, models, routes)
- ✅ New npm packages are installed

**How to Restart:**
```bash
# Stop: Ctrl+C in terminal
# Start:
cd backend
node server.js
```

### ⚠️ Must Restart Frontend When:
- ✅ `.env` file is changed
- ✅ New npm packages are installed

**How to Restart:**
```bash
# Stop: Ctrl+C in terminal
# Start:
npm run dev
```

---

## Browser DevTools Debugging

### 🔍 Network Tab Checks

**What to Look For:**
1. **Request URL:** Should be `http://localhost:5001/api/...`
2. **Request Method:** GET, POST, PUT, DELETE
3. **Status Codes:**
   - ✅ `200` - Success
   - ✅ `201` - Created
   - ❌ `401` - Unauthorized (need to login)
   - ❌ `404` - Not found
   - ❌ `500` - Server error
   - ❌ `CORS error` - CORS misconfiguration

**Common Errors:**

**CORS Error:**
```
Access to fetch at 'http://localhost:5001/api/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```
**Fix:** Check CORS configuration in `backend/server.js`

**401 Unauthorized:**
```json
{"message": "Not authorized, no token"}
```
**Fix:** User needs to login first

**500 Server Error:**
```json
{"message": "Something went wrong!", "error": "..."}
```
**Fix:** Check backend terminal for error details

### 🔍 Console Tab Checks

**What to Look For:**
1. API request errors
2. Authentication errors
3. React component errors
4. Network failures

**Common Console Errors:**

**Failed to fetch:**
```
TypeError: Failed to fetch
```
**Fix:** Backend server not running

**Network Error:**
```
Error: Network Error
```
**Fix:** Wrong API URL in `.env`

---

## Testing Checklist

### ✅ Test Authentication
- [ ] Sign up with new email
- [ ] Login with credentials
- [ ] Check MongoDB Compass → `users` collection
- [ ] Verify password is hashed (not plain text)
- [ ] Logout and login again

### ✅ Test Mood Tracking
- [ ] Log a mood with all fields
- [ ] Check MongoDB Compass → `moodlogs` collection
- [ ] Verify all data is saved (intensity, sleep, stress, tags)
- [ ] Check analytics update
- [ ] Try logging multiple moods

### ✅ Test Journal
- [ ] Create journal entry with title and content
- [ ] Add emotion and context tags
- [ ] Upload a photo (optional)
- [ ] Check MongoDB Compass → `journalentries` collection
- [ ] Search for entries
- [ ] Verify photo is saved as base64

### ✅ Test Contact Form
- [ ] Submit contact form (logged out)
- [ ] Submit feedback (logged in)
- [ ] Check MongoDB Compass → `contacts` collection
- [ ] Verify email and message are saved

### ✅ Test Analytics
- [ ] View analytics page
- [ ] Check if stats match mood logs
- [ ] Verify streak calculation
- [ ] Check mood distribution chart

---

## MongoDB Compass Verification

### Collections to Check:

1. **Database:** `moodmate`

2. **Collections:**
   - `users` - User accounts
   - `moodlogs` - Mood tracking data
   - `journalentries` - Journal entries
   - `contacts` - Contact form submissions

### How to Verify:

1. Open MongoDB Compass
2. Connect to your database
3. Click on `moodmate` database
4. Click on each collection
5. You should see documents (data) after using the app

---

## Quick Troubleshooting

### Backend won't start
```bash
# Check if port 5001 is in use
lsof -i:5001

# Kill process if needed
lsof -ti:5001 | xargs kill -9

# Restart
cd backend
node server.js
```

### Frontend can't connect
```bash
# Verify backend is running
curl http://localhost:5001/api/health

# Should return:
# {"status":"OK","message":"MoodMate API is running"}

# If not, start backend first
```

### Data not saving
1. Check browser console for errors
2. Check backend terminal for errors
3. Verify MongoDB is running in Compass
4. Check network tab for failed requests
5. Verify you're logged in (for protected routes)

---

## Summary

### ✅ What's Working:
- Backend API running on port 5001
- Frontend configured to connect to backend
- CORS properly configured
- All data models created
- All API endpoints implemented
- Authentication with JWT
- Password hashing with bcrypt

### ✅ What Gets Saved:
- ✅ User signup/login → `users` collection
- ✅ Mood logs → `moodlogs` collection
- ✅ Journal entries → `journalentries` collection
- ✅ Contact forms → `contacts` collection
- ✅ Analytics → Calculated from `moodlogs`

### 🎯 Next Steps:
1. Start both servers
2. Test each feature
3. Check MongoDB Compass to see data
4. Monitor browser console and network tab
5. Check backend terminal for logs

---

**All data from signup, login, mood tracking, journal entries, analytics, and contact forms is now stored in MongoDB! 🎉**
