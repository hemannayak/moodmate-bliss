import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  type: {
    type: String,
    enum: ['contact', 'feedback', 'support', 'bug'],
    default: 'contact'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded', 'closed'],
    default: 'new'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  }
}, {
  timestamps: true
});

// Index for faster queries
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1 });

const Contact = mongoose.model('Contact', contactSchema);

export default Contact;
