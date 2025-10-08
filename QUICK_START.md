# 🚀 MoodMate Quick Start Guide

## Prerequisites
- ✅ MongoDB Compass installed and running
- ✅ Node.js installed
- ✅ Dependencies installed (`npm install` in root and backend)

## 3 Simple Steps to Run

### 1️⃣ Configure MongoDB (One-time setup)

Edit `backend/.env`:
```env
MONGODB_URI=mongodb://localhost:27017/moodmate
PORT=5001
JWT_SECRET=your_secret_key
NODE_ENV=development
```

Replace `mongodb://localhost:27017/moodmate` with your connection string from MongoDB Compass.

### 2️⃣ Start Backend

```bash
cd backend
node server.js
```

✅ Success when you see: `🚀 Server running on port 5001`

### 3️⃣ Start Frontend (in a new terminal)

```bash
# From root directory
npm run dev
```

✅ Open browser: `http://localhost:5173`

## Quick Test

Test backend is running:
```bash
curl http://localhost:5001/api/health
```

Expected: `{"status":"OK","message":"MoodMate API is running"}`

## What Changed?

- ❌ **Before:** Data stored in browser localStorage (temporary)
- ✅ **Now:** Data stored in MongoDB (permanent)

## Verify It's Working

1. Sign up with a new account
2. Log a mood or create a journal entry
3. Open MongoDB Compass
4. Check database `moodmate` → you'll see your data!

## Need Help?

- Full guide: `INTEGRATION_COMPLETE.md`
- Detailed setup: `SETUP.md`
- Backend docs: `backend/README.md`

---

**Backend:** http://localhost:5001
**Frontend:** http://localhost:5173
**Database:** MongoDB Compass
