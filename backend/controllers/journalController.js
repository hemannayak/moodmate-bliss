import JournalEntry from '../models/JournalEntry.js';
import { analyzeJournalEntry } from '../services/aiService.js';

// @desc    Get all journal entries for user
// @route   GET /api/journal
// @access  Private
export const getJournalEntries = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { userId: req.user._id };

    // Add text search if search query provided
    if (search) {
      query.$text = { $search: search };
    }

    const entries = await JournalEntry.find(query).sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single journal entry
// @route   GET /api/journal/:id
// @access  Private
export const getJournalEntryById = async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    // Check if user owns this entry
    if (entry.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new journal entry
// @route   POST /api/journal
// @access  Private
export const createJournalEntry = async (req, res) => {
  try {
    const { title, content, mood, tags, emotionTags, contextTags, photo } = req.body;

    // Create the journal entry first
    const entryData = {
      userId: req.user._id,
      title,
      content,
      mood,
      tags: tags || [],
      emotionTags: emotionTags || [],
      contextTags: contextTags || [],
      photo
    };

    const entry = await JournalEntry.create(entryData);

    // Perform AI analysis in the background (don't wait for it)
    analyzeJournalEntry(title, content, mood, req.user)
      .then(async (aiAnalysis) => {
        if (aiAnalysis) { // Only update if user has opted in
          await JournalEntry.findByIdAndUpdate(entry._id, {
            aiAnalysis: aiAnalysis
          });
        }
      })
      .catch((error) => {
        console.error('AI analysis failed for journal entry:', error);
        // Continue without AI analysis - not critical
      });

    // Return entry immediately (AI analysis happens in background)
    res.status(201).json({
      ...entry.toObject(),
      aiAnalysis: {
        sentiment: 'Processing...',
        emotions: [],
        summary: 'AI analysis in progress...',
        reflection: '',
        suggestion: '',
        affirmation: ''
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update journal entry
// @route   PUT /api/journal/:id
// @access  Private
export const updateJournalEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    // Check if user owns this entry
    if (entry.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedEntry = await JournalEntry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    // If content was updated, trigger AI analysis
    if (req.body.title || req.body.content) {
      analyzeJournalEntry(updatedEntry.title, updatedEntry.content, updatedEntry.mood)
        .then(async (aiAnalysis) => {
          await JournalEntry.findByIdAndUpdate(updatedEntry._id, {
            aiAnalysis: aiAnalysis
          });
        })
        .catch((error) => {
          console.error('AI analysis failed for updated journal entry:', error);
        });
    }

    res.json(updatedEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete journal entry
// @route   DELETE /api/journal/:id
// @access  Private
export const deleteJournalEntry = async (req, res) => {
  try {
    const entry = await JournalEntry.findById(req.params.id);

    if (!entry) {
      return res.status(404).json({ message: 'Journal entry not found' });
    }

    // Check if user owns this entry
    if (entry.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await JournalEntry.findByIdAndDelete(req.params.id);

    res.json({ message: 'Journal entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
