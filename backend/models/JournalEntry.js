import mongoose from 'mongoose';

const journalEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  content: {
    type: String,
    required: [true, 'Content is required']
  },
  mood: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  tags: [{
    type: String
  }],
  emotionTags: [{
    type: String
  }],
  contextTags: [{
    type: String
  }],
  photo: {
    type: String
  },
  aiAnalysis: {
    sentiment: String,
    emotions: [String],
    summary: String,
    reflection: String,
    suggestion: String,
    affirmation: String
  }
}, {
  timestamps: true
});

// Index for faster queries
journalEntrySchema.index({ userId: 1, date: -1 });
journalEntrySchema.index({ userId: 1, title: 'text', content: 'text' });

const JournalEntry = mongoose.model('JournalEntry', journalEntrySchema);

export default JournalEntry;
