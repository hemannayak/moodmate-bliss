import MoodLog from '../models/MoodLog.js';
import { analyzeMoodPatterns } from '../services/aiService.js';

// @desc    Get all mood logs for user
// @route   GET /api/mood-logs
// @access  Private
export const getMoodLogs = async (req, res) => {
  try {
    const moodLogs = await MoodLog.find({ userId: req.user._id })
      .sort({ date: -1 });
    res.json(moodLogs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single mood log
// @route   GET /api/mood-logs/:id
// @access  Private
export const getMoodLogById = async (req, res) => {
  try {
    const moodLog = await MoodLog.findById(req.params.id);

    if (!moodLog) {
      return res.status(404).json({ message: 'Mood log not found' });
    }

    // Check if user owns this mood log
    if (moodLog.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(moodLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new mood log
// @route   POST /api/mood-logs
// @access  Private
export const createMoodLog = async (req, res) => {
  try {
    const moodLog = await MoodLog.create({
      userId: req.user._id,
      ...req.body
    });

    res.status(201).json(moodLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update mood log
// @route   PUT /api/mood-logs/:id
// @access  Private
export const updateMoodLog = async (req, res) => {
  try {
    const moodLog = await MoodLog.findById(req.params.id);

    if (!moodLog) {
      return res.status(404).json({ message: 'Mood log not found' });
    }

    // Check if user owns this mood log
    if (moodLog.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedMoodLog = await MoodLog.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(updatedMoodLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete mood log
// @route   DELETE /api/mood-logs/:id
// @access  Private
export const deleteMoodLog = async (req, res) => {
  try {
    const moodLog = await MoodLog.findById(req.params.id);

    if (!moodLog) {
      return res.status(404).json({ message: 'Mood log not found' });
    }

    // Check if user owns this mood log
    if (moodLog.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await MoodLog.findByIdAndDelete(req.params.id);

    res.json({ message: 'Mood log deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get mood statistics
// @route   GET /api/mood-logs/stats
// @access  Private
export const getMoodStats = async (req, res) => {
  try {
    const moodLogs = await MoodLog.find({ userId: req.user._id });

    // Calculate statistics
    const stats = {
      totalLogs: moodLogs.length,
      averageIntensity: moodLogs.length > 0 
        ? (moodLogs.reduce((sum, log) => sum + log.intensity, 0) / moodLogs.length).toFixed(1)
        : 0,
      moodDistribution: {},
      recentLogs: moodLogs.slice(0, 10)
    };

    // Count mood distribution
    moodLogs.forEach(log => {
      stats.moodDistribution[log.moodName] = (stats.moodDistribution[log.moodName] || 0) + 1;
    });

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get AI-powered mood pattern analysis
// @route   GET /api/mood-logs/ai-insights
// @access  Private
export const getMoodAIInsights = async (req, res) => {
  try {
    const moodLogs = await MoodLog.find({ userId: req.user._id })
      .sort({ date: -1 })
      .limit(20); // Get last 20 entries for pattern analysis

    if (moodLogs.length === 0) {
      return res.json({
        message: 'Not enough data for AI analysis yet. Keep logging your moods!',
        needsMoreData: true
      });
    }

    // Get AI analysis of mood patterns (only if user has opted in)
    const aiInsights = await analyzeMoodPatterns(moodLogs, req.user);

    res.json({
      needsMoreData: false,
      analysis: aiInsights,
      dataPoints: moodLogs.length,
      analysisDate: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting mood AI insights:', error);
    res.status(500).json({
      message: 'Unable to analyze mood patterns at this time',
      error: error.message
    });
  }
};
