import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  profile: {
    firstName: {
      type: String,
      trim: true
    },
    lastName: {
      type: String,
      trim: true
    },
    displayName: {
      type: String,
      trim: true
    },
    bio: {
      type: String,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    dateOfBirth: {
      type: Date
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'other', 'prefer-not-to-say']
    },
    phone: {
      type: String,
      trim: true
    },
    location: {
      city: String,
      state: String,
      country: String
    },
    avatar: {
      type: String // Base64 encoded image or URL
    },
    photo: {
      type: String // Base64 encoded image or URL
    }
  },
  privacy: {
    allowAIJournalAnalysis: {
      type: Boolean,
      default: true // Opt-in by default for existing users
    },
    allowAIMoodAnalysis: {
      type: Boolean,
      default: true // Opt-in by default for existing users
    },
    dataSharing: {
      type: Boolean,
      default: false // Don't share data by default
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
