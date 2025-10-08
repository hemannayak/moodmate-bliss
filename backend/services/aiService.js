import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Analyzes journal entry content and provides AI insights (if user has opted in)
 * @param {string} title - Journal entry title
 * @param {string} content - Journal entry content
 * @param {string} mood - Associated mood
 * @param {Object} user - User object with privacy settings
 * @returns {Object} AI analysis results or null if user opted out
 */
export const analyzeJournalEntry = async (title, content, mood, user = null) => {
  try {
    // Check if user has opted in for AI journal analysis
    if (user && !user.privacy?.allowAIJournalAnalysis) {
      return null; // Return null to indicate no analysis should be performed
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Analyze this journal entry and provide supportive insights:

      Title: "${title}"
      Content: "${content}"
      Associated Mood: "${mood}"

      Please provide analysis in the following JSON format:
      {
        "sentiment": "positive/neutral/negative/mixed",
        "emotions": ["emotion1", "emotion2", "emotion3"],
        "summary": "2-3 sentence summary of the entry",
        "reflection": "Thought-provoking question for deeper reflection",
        "suggestion": "Supportive suggestion based on the content",
        "affirmation": "Positive affirmation related to the content"
      }

      Focus on being empathetic, supportive, and encouraging. Keep insights personal and actionable.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parse JSON response with better error handling
    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', text);
      throw new Error('AI service returned invalid response format');
    }

    return {
      sentiment: analysis.sentiment || 'neutral',
      emotions: Array.isArray(analysis.emotions) ? analysis.emotions : [],
      summary: analysis.summary || '',
      reflection: analysis.reflection || '',
      suggestion: analysis.suggestion || '',
      affirmation: analysis.affirmation || ''
    };
  } catch (error) {
    console.error('Error analyzing journal entry:', error);

    // Return structured error response instead of default analysis
    return {
      sentiment: 'neutral',
      emotions: [],
      summary: 'Unable to analyze at this time',
      reflection: 'What would you like to explore more deeply about this experience?',
      suggestion: 'Consider discussing this with a trusted friend or professional if it would be helpful.',
      affirmation: 'Your feelings and experiences are valid and important.',
      error: error.message || 'AI analysis temporarily unavailable'
    };
  }
};

/**
 * Analyzes mood patterns over time (if user has opted in)
 * @param {Array} moodLogs - Array of mood log entries
 * @param {Object} user - User object with privacy settings
 * @returns {Object} Pattern analysis and insights or null if user opted out
 */
export const analyzeMoodPatterns = async (moodLogs, user = null) => {
  try {
    // Check if user has opted in for AI mood analysis
    if (user && !user.privacy?.allowAIMoodAnalysis) {
      return null; // Return null to indicate no analysis should be performed
    }

    if (!moodLogs || moodLogs.length === 0) {
      return {
        overallTrend: 'stable',
        patterns: [],
        insights: 'Not enough mood data available for analysis yet.',
        recommendations: ['Continue logging your moods daily', 'Track for at least a week to see patterns'],
        positiveAffirmation: 'You are taking positive steps by tracking your mood patterns.',
        needsMoreData: true
      };
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const recentMoods = moodLogs.slice(0, 10).map(log => ({
      mood: log.moodName,
      intensity: log.intensity,
      date: log.date,
      note: log.note
    }));

    const prompt = `
      Analyze these recent mood patterns and provide insights:

      ${JSON.stringify(recentMoods, null, 2)}

      Please provide analysis in the following JSON format:
      {
        "overallTrend": "improving/stable/declining/fluctuating",
        "patterns": ["pattern1", "pattern2", "pattern3"],
        "insights": "Key insights about mood patterns",
        "recommendations": ["rec1", "rec2", "rec3"],
        "positiveAffirmation": "Encouraging message based on patterns"
      }

      Focus on patterns, triggers, and constructive suggestions.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    let analysis;
    try {
      analysis = JSON.parse(text);
    } catch (parseError) {
      console.error('Failed to parse AI mood analysis response as JSON:', text);
      throw new Error('AI service returned invalid response format');
    }

    return {
      overallTrend: analysis.overallTrend || 'stable',
      patterns: Array.isArray(analysis.patterns) ? analysis.patterns : [],
      insights: analysis.insights || '',
      recommendations: Array.isArray(analysis.recommendations) ? analysis.recommendations : [],
      positiveAffirmation: analysis.positiveAffirmation || '',
      needsMoreData: false
    };
  } catch (error) {
    console.error('Error analyzing mood patterns:', error);
    return {
      overallTrend: 'stable',
      patterns: [],
      insights: 'Continue tracking your moods to identify patterns.',
      recommendations: ['Maintain consistent tracking', 'Look for triggers in your daily life'],
      positiveAffirmation: 'You are taking positive steps by tracking your mood patterns.',
      needsMoreData: false,
      error: error.message || 'AI analysis temporarily unavailable'
    };
  }
};

/**
 * Generates personalized reflection prompts based on journal history
 * @param {Array} journalEntries - Recent journal entries
 * @param {Object} user - User object with privacy settings
 * @returns {Array} Reflection prompts or null if user opted out
 */
export const generateReflectionPrompts = async (journalEntries, user = null) => {
  try {
    // Check if user has opted in for AI journal analysis (reflection prompts are part of journal analysis)
    if (user && !user.privacy?.allowAIJournalAnalysis) {
      return null; // Return null to indicate no analysis should be performed
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const recentEntries = journalEntries.slice(0, 5).map(entry => ({
      title: entry.title,
      mood: entry.mood,
      content: entry.content.substring(0, 200) + '...'
    }));

    const prompt = `
      Based on these recent journal entries, generate 3 thoughtful reflection prompts:

      ${JSON.stringify(recentEntries, null, 2)}

      Provide 3 reflection questions that would help deepen self-understanding.
      Focus on themes, emotions, and personal growth opportunities.

      Return as JSON array: ["prompt1", "prompt2", "prompt3"]
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    const prompts = JSON.parse(text);

    return Array.isArray(prompts) ? prompts.slice(0, 3) : [
      'What patterns do you notice in your emotional responses?',
      'How have you grown through challenging experiences?',
      'What are you most grateful for in your life right now?'
    ];
  } catch (error) {
    console.error('Error generating reflection prompts:', error);
    return [
      'What emotions are you experiencing most frequently?',
      'What would you tell a friend going through something similar?',
      'What small step could you take to support your wellbeing?'
    ];
  }
};
