# MoodMate - Full Stack Setup Guide

This guide will help you connect your MoodMate frontend to MongoDB backend.

## Prerequisites

- Node.js installed
- MongoDB Compass installed and running
- MongoDB connection string from Compass

## Step 1: Get Your MongoDB Connection String

1. Open **MongoDB Compass**
2. Look at the top of the window or click "Connect"
3. Copy your connection string. It will look like one of these:
   - Local: `mongodb://localhost:27017`
   - Atlas: `mongodb+srv://username:password@cluster.mongodb.net`

## Step 2: Setup Backend

### Install Backend Dependencies

```bash
cd backend
npm install
```

### Configure Environment Variables

Create a `.env` file in the `backend` directory:

```bash
# In the backend directory
touch .env
```

Open `.env` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb://localhost:27017/moodmate
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this
NODE_ENV=development
```

**Important:** Replace `mongodb://localhost:27017/moodmate` with your actual connection string from MongoDB Compass.

### Start the Backend Server

```bash
# Development mode (auto-reload)
npm run dev

# OR Production mode
npm start
```

You should see:
```
✅ MongoDB Connected: localhost
🚀 Server running on port 5000
```

### Test the Backend

Open a new terminal and run:

```bash
curl http://localhost:5000/api/health
```

You should see: `{"status":"OK","message":"MoodMate API is running"}`

## Step 3: Setup Frontend

### Install Frontend Dependencies (if not already done)

```bash
# In the root directory
npm install
```

### Configure Frontend Environment

The `.env` file is already created in the root directory with:

```env
VITE_API_URL=http://localhost:5000/api
```

### Start the Frontend

```bash
# In the root directory
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## Step 4: Test the Full Stack

1. **Open your browser** and go to `http://localhost:5173`
2. **Sign up** with a new account (email and password)
3. **Log a mood** in the Mood Tracker page
4. **Create a journal entry** in the Journal page
5. **Check MongoDB Compass** to see your data stored in the database:
   - Database: `moodmate`
   - Collections: `users`, `moodlogs`, `journalentries`

## Troubleshooting

### Backend won't start

- **Error: "Cannot connect to MongoDB"**
  - Check if MongoDB is running in Compass
  - Verify your connection string in `.env`
  - Make sure the connection string doesn't have spaces

### Frontend can't connect to backend

- **Error: "Failed to fetch"**
  - Make sure backend is running on port 5000
  - Check if `VITE_API_URL` in `.env` is correct
  - Restart the frontend after changing `.env`

### CORS errors

- The backend is already configured with CORS enabled
- If you still see CORS errors, make sure both servers are running

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (requires token)

### Mood Logs
- `GET /api/mood-logs` - Get all mood logs
- `POST /api/mood-logs` - Create mood log
- `GET /api/mood-logs/:id` - Get single mood log
- `PUT /api/mood-logs/:id` - Update mood log
- `DELETE /api/mood-logs/:id` - Delete mood log
- `GET /api/mood-logs/stats` - Get mood statistics

### Journal Entries
- `GET /api/journal` - Get all journal entries
- `GET /api/journal?search=keyword` - Search entries
- `POST /api/journal` - Create journal entry
- `GET /api/journal/:id` - Get single entry
- `PUT /api/journal/:id` - Update entry
- `DELETE /api/journal/:id` - Delete entry

## Project Structure

```
moodmate/
├── backend/                 # Backend API
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth middleware
│   ├── models/            # MongoDB schemas
│   ├── routes/            # API routes
│   ├── .env               # Environment variables (create this)
│   ├── package.json       # Backend dependencies
│   └── server.js          # Express server
├── src/                    # Frontend React app
│   ├── components/        # UI components
│   ├── contexts/          # React contexts (Auth)
│   ├── hooks/             # Custom hooks (API hooks)
│   ├── lib/               # API client
│   └── pages/             # Page components
├── .env                    # Frontend environment variables
└── package.json           # Frontend dependencies
```

## Next Steps

- Your data is now stored in MongoDB instead of localStorage
- All mood logs and journal entries are saved to the database
- User authentication is handled with JWT tokens
- You can view and manage your data in MongoDB Compass

## Need Help?

- Check the backend console for error messages
- Check the browser console for frontend errors
- Verify MongoDB is running in Compass
- Make sure both frontend and backend servers are running
