# MoodMate Backend API

Backend server for MoodMate mood tracking application built with Node.js, Express, and MongoDB.

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory:

```bash
cp .env.example .env
```

Then edit `.env` and update with your MongoDB connection string from Compass:

```env
MONGODB_URI=mongodb://localhost:27017/moodmate
PORT=5000
JWT_SECRET=your_secure_random_string_here
NODE_ENV=development
```

**Important:** Replace the `MONGODB_URI` with your actual connection string from MongoDB Compass.

### 3. Get Your MongoDB Connection String

1. Open MongoDB Compass
2. Click on "Connect" or look at the top of the window
3. Copy your connection string (it looks like: `mongodb://localhost:27017` or `mongodb+srv://...`)
4. Paste it in your `.env` file as `MONGODB_URI`

### 4. Start the Server

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Mood Logs
- `GET /api/mood-logs` - Get all mood logs (protected)
- `POST /api/mood-logs` - Create mood log (protected)
- `GET /api/mood-logs/:id` - Get single mood log (protected)
- `PUT /api/mood-logs/:id` - Update mood log (protected)
- `DELETE /api/mood-logs/:id` - Delete mood log (protected)
- `GET /api/mood-logs/stats` - Get mood statistics (protected)

### Journal Entries
- `GET /api/journal` - Get all journal entries (protected)
- `POST /api/journal` - Create journal entry (protected)
- `GET /api/journal/:id` - Get single entry (protected)
- `PUT /api/journal/:id` - Update entry (protected)
- `DELETE /api/journal/:id` - Delete entry (protected)

### Health Check
- `GET /api/health` - Check if API is running

## Testing the API

Test if the server is running:
```bash
curl http://localhost:5000/api/health
```

## Next Steps

After setting up the backend, you need to:
1. Update the frontend to connect to this API
2. Replace localStorage calls with API calls
3. Add authentication token handling in frontend
