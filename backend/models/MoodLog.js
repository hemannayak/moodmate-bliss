import mongoose from 'mongoose';

const moodLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mood: {
    type: String,
    required: true
  },
  moodName: {
    type: String,
    required: true
  },
  intensity: {
    type: Number,
    required: true,
    min: 1,
    max: 10
  },
  note: {
    type: String,
    default: ''
  },
  date: {
    type: Date,
    default: Date.now
  },
  sleepQuality: {
    type: Number,
    min: 1,
    max: 10
  },
  stressLevel: {
    type: Number,
    min: 1,
    max: 10
  },
  tags: [{
    type: String
  }],
  activityMetrics: {
    typingSpeed: Number,
    cursorMovement: String,
    clickFrequency: Number,
    sessionDuration: Number,
    idleTime: Number,
    inferredMood: String
  }
}, {
  timestamps: true
});

// Index for faster queries
moodLogSchema.index({ userId: 1, date: -1 });

const MoodLog = mongoose.model('MoodLog', moodLogSchema);

export default MoodLog;
