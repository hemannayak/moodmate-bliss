import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { Heart, TrendingUp, Calendar as CalendarIcon, Award, Smile, Target, Zap, Activity, Moon, Brain, MousePointer, Keyboard, Clock } from 'lucide-react';
import { useActivityTracking } from '@/hooks/useActivityTracking';
import { useMoodLogs } from '@/hooks/useMoodLogs';

interface MoodLog {
  _id?: string;
  id?: string;
  userId: string;
  mood: string;
  moodName: string;
  intensity: number;
  note: string;
  date: string;
  sleepQuality?: number;
  stressLevel?: number;
  tags?: string[];
  activityMetrics?: {
    typingSpeed: number;
    cursorMovement: string;
    clickFrequency: number;
    sessionDuration: number;
    idleTime: number;
    inferredMood: string;
  };
}

const MOODS = [
  { emoji: '😊', label: 'Happy', color: 'hsl(45 95% 55%)' },
  { emoji: '😌', label: 'Calm', color: 'hsl(200 70% 50%)' },
  { emoji: '😢', label: 'Sad', color: 'hsl(220 40% 50%)' },
  { emoji: '😰', label: 'Anxious', color: 'hsl(280 50% 55%)' },
  { emoji: '😴', label: 'Tired', color: 'hsl(240 20% 60%)' },
  { emoji: '🤗', label: 'Grateful', color: 'hsl(330 70% 60%)' },
  { emoji: '😤', label: 'Frustrated', color: 'hsl(10 75% 55%)' },
  { emoji: '🤩', label: 'Excited', color: 'hsl(30 95% 60%)' },
];

const SUGGESTIONS: Record<string, string[]> = {
  'Happy': ['Keep doing what makes you happy!', 'Share your joy with others', 'Write about what made you smile today'],
  'Calm': ['Enjoy this peaceful moment', 'Practice mindfulness', 'Take a relaxing walk'],
  'Sad': ['It\'s okay to feel sad', 'Reach out to a friend', 'Practice self-compassion'],
  'Anxious': ['Try deep breathing exercises', 'Write down your worries', 'Take a short break'],
  'Tired': ['Get some rest', 'Stay hydrated', 'Take a power nap if possible'],
  'Grateful': ['Write down what you\'re grateful for', 'Express thanks to someone', 'Reflect on positive moments'],
  'Frustrated': ['Take a deep breath', 'Step away for a moment', 'Channel energy into exercise'],
  'Excited': ['Celebrate this feeling!', 'Share your excitement', 'Channel this energy productively'],
};

const MOOD_TAGS = [
  { id: 'work', label: '💼 Work', color: 'hsl(220 70% 50%)' },
  { id: 'friends', label: '👥 Friends', color: 'hsl(330 70% 60%)' },
  { id: 'family', label: '👨‍👩‍👧 Family', color: 'hsl(280 50% 55%)' },
  { id: 'weather', label: '🌤️ Weather', color: 'hsl(200 70% 50%)' },
  { id: 'health', label: '💊 Health', color: 'hsl(10 75% 55%)' },
  { id: 'exercise', label: '🏃 Exercise', color: 'hsl(120 70% 50%)' },
  { id: 'sleep', label: '😴 Sleep', color: 'hsl(240 20% 60%)' },
  { id: 'food', label: '🍔 Food', color: 'hsl(30 95% 60%)' },
  { id: 'social', label: '🎉 Social', color: 'hsl(45 95% 55%)' },
  { id: 'hobby', label: '🎨 Hobby', color: 'hsl(170 70% 45%)' },
];

const MoodTracker = () => {
  const { user } = useAuth();
  const { metrics, getInferredMood } = useActivityTracking();
  const { logs, isLoading, aiInsights, aiInsightsLoading, createMoodLog } = useMoodLogs();
  const [intensity, setIntensity] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [stressLevel, setStressLevel] = useState(5);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [note, setNote] = useState('');
  
  const getPredictedMood = (): string => {
    // Calculate mood based on sleep quality, stress level, and intensity
    const sleepScore = sleepQuality / 10;
    const stressScore = (10 - stressLevel) / 10;
    const intensityScore = intensity / 10;
    
    const overallScore = (sleepScore * 0.3 + stressScore * 0.4 + intensityScore * 0.3) * 10;
    
    if (overallScore >= 7.5) return 'Happy';
    if (overallScore >= 6) return 'Calm';
    if (overallScore >= 4.5) return 'Tired';
    if (stressLevel >= 7) return 'Anxious';
    if (overallScore >= 3) return 'Sad';
    return 'Frustrated';
  };
  
  // Calculate predicted mood based on metrics
  const predictedMood = React.useMemo(() => {
    return getPredictedMood();
  }, [sleepQuality, stressLevel, intensity]);

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const handleLogMood = () => {
    const predictedMoodName = getPredictedMood();
    const predictedMoodEmoji = MOODS.find(m => m.label === predictedMoodName)?.emoji || '😊';
    
    const newLog = {
      mood: predictedMoodEmoji,
      moodName: predictedMoodName,
      intensity,
      note: note.trim(),
      sleepQuality,
      stressLevel,
      tags: selectedTags,
      activityMetrics: {
        typingSpeed: metrics.typingSpeed,
        cursorMovement: metrics.cursorMovement,
        clickFrequency: metrics.clickFrequency,
        sessionDuration: metrics.sessionDuration,
        idleTime: metrics.idleTime,
        inferredMood: getInferredMood(),
      },
    };

    createMoodLog(newLog);
    setNote('');
    setIntensity(5);
    setSleepQuality(5);
    setStressLevel(5);
    setSelectedTags([]);
  };

  // Calculate metrics
  const calculateStreak = () => {
    if (logs.length === 0) return 0;
    
    let streak = 1;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < logs.length - 1; i++) {
      const currentDate = new Date(logs[i].date);
      const nextDate = new Date(logs[i + 1].date);
      currentDate.setHours(0, 0, 0, 0);
      nextDate.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const calculateAverageMood = () => {
    if (logs.length === 0) return 0;
    const sum = logs.reduce((acc, log) => acc + log.intensity, 0);
    return (sum / logs.length).toFixed(1);
  };

  const getMostCommonMood = () => {
    if (logs.length === 0) return 'None';
    
    const counts: Record<string, number> = {};
    logs.forEach(log => {
      counts[log.moodName] = (counts[log.moodName] || 0) + 1;
    });
    
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  };

  const getTodaysMoodCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return logs.filter(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    }).length;
  };

  const getWeeklyAverage = () => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const weekLogs = logs.filter(log => new Date(log.date) >= weekAgo);
    if (weekLogs.length === 0) return 0;
    const sum = weekLogs.reduce((acc, log) => acc + log.intensity, 0);
    return (sum / weekLogs.length).toFixed(1);
  };

  const getPositivityRate = () => {
    if (logs.length === 0) return 0;
    const positiveMoods = logs.filter(log => 
      ['Happy', 'Calm', 'Grateful', 'Excited'].includes(log.moodName)
    ).length;
    return Math.round((positiveMoods / logs.length) * 100);
  };

  const streak = calculateStreak();
  const avgMood = calculateAverageMood();
  const mostCommon = getMostCommonMood();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Mood Tracker
        </h1>
        <p className="text-muted-foreground">Log your daily emotions and build healthy habits</p>
      </div>

      {/* Mood Logger */}
      <Card className="p-6 mb-8 shadow-soft">
        <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          Mood Prediction Based on Your Metrics
        </h2>

        <div className="space-y-6">
          {/* Predicted Mood Display */}
          <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-2 border-purple-500/30">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Your Predicted Mood</p>
              <div className="flex items-center justify-center gap-4 mb-3">
                <span className="text-7xl">
                  {MOODS.find(m => m.label === predictedMood)?.emoji || '😊'}
                </span>
                <div className="text-left">
                  <p className="text-3xl font-bold text-primary">{predictedMood}</p>
                  <p className="text-sm text-muted-foreground">Based on your current metrics</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4 text-sm">
                <div className="bg-background/50 p-2 rounded">
                  <p className="text-muted-foreground">Sleep</p>
                  <p className="font-bold">{sleepQuality}/10</p>
                </div>
                <div className="bg-background/50 p-2 rounded">
                  <p className="text-muted-foreground">Stress</p>
                  <p className="font-bold">{stressLevel}/10</p>
                </div>
                <div className="bg-background/50 p-2 rounded">
                  <p className="text-muted-foreground">Intensity</p>
                  <p className="font-bold">{intensity}/10</p>
                </div>
              </div>
            </div>
          </Card>

          <div>
            <Label className="text-base mb-3 block">
              Intensity: <span className="text-primary font-bold">{intensity}/10</span>
            </Label>
            <input
              type="range"
              min="1"
              max="10"
              value={intensity}
              onChange={(e) => setIntensity(parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, 
                  hsl(220 40% 50%) 0%, 
                  hsl(45 95% 55%) 50%, 
                  hsl(120 70% 50%) 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>

          <div>
            <Label className="text-base mb-3 block">
              Sleep Quality: <span className="text-primary font-bold">{sleepQuality}/10</span>
            </Label>
            <input
              type="range"
              min="1"
              max="10"
              value={sleepQuality}
              onChange={(e) => setSleepQuality(parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-purple-400 to-blue-400"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Poor</span>
              <span>Good</span>
              <span>Excellent</span>
            </div>
          </div>

          <div>
            <Label className="text-base mb-3 block">
              Stress Level: <span className="text-primary font-bold">{stressLevel}/10</span>
            </Label>
            <input
              type="range"
              min="1"
              max="10"
              value={stressLevel}
              onChange={(e) => setStressLevel(parseInt(e.target.value))}
              className="w-full h-3 rounded-lg appearance-none cursor-pointer bg-gradient-to-r from-green-400 to-red-400"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Low</span>
              <span>Medium</span>
              <span>High</span>
            </div>
          </div>

          <div>
            <Label className="text-base mb-3 block">What's affecting your mood?</Label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {MOOD_TAGS.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all ${
                    selectedTags.includes(tag.id)
                      ? 'ring-2 ring-primary scale-105 shadow-md'
                      : 'bg-muted hover:bg-muted/70'
                  }`}
                  style={{
                    backgroundColor: selectedTags.includes(tag.id) ? `${tag.color}20` : undefined,
                  }}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="note">Add a note (optional):</Label>
            <Textarea
              id="note"
              placeholder="What's on your mind?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2 min-h-[100px]"
            />
          </div>

          {/* Activity Insights */}
          <Card className="p-4 bg-blue-50 dark:bg-blue-950/20 border-2 border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold mb-3 text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Activity Analysis
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Keyboard className="h-4 w-4 text-blue-600" />
                <span className="text-foreground/80">Typing: {metrics.typingSpeed} cps</span>
              </div>
              <div className="flex items-center gap-2">
                <MousePointer className="h-4 w-4 text-blue-600" />
                <span className="text-foreground/80">Cursor: {metrics.cursorMovement}</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span className="text-foreground/80">Clicks: {metrics.clickFrequency}/min</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-foreground/80">Session: {Math.floor(metrics.sessionDuration / 60)}m</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-foreground/80">Idle: {metrics.idleTime}s</span>
              </div>
              <div className="col-span-2 md:col-span-1">
                <Badge variant="secondary" className="w-full justify-center">
                  Inferred: {getInferredMood()}
                </Badge>
              </div>
            </div>
          </Card>

          <Button
            onClick={handleLogMood}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white h-12 text-lg"
          >
            Save Predicted Mood
          </Button>

          {/* Suggestions */}
          {SUGGESTIONS[predictedMood] && (
            <Card className="p-4 bg-muted/50 border-2 border-primary/20">
              <h3 className="font-semibold mb-2 text-primary">💡 Suggestions for {predictedMood}:</h3>
              <ul className="space-y-1">
                {SUGGESTIONS[predictedMood].map((suggestion, i) => (
                  <li key={i} className="text-sm text-foreground/80">• {suggestion}</li>
                ))}
              </ul>
            </Card>
          )}
        </div>
      </Card>

      {/* Enhanced Metrics Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 gradient-happy text-primary-foreground shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <Award className="h-8 w-8" />
            <div>
              <p className="text-sm opacity-90">Current Streak</p>
              <p className="text-3xl font-bold">{streak}</p>
            </div>
          </div>
          <p className="text-xs opacity-80">days in a row</p>
        </Card>

        <Card className="p-6 gradient-calm text-accent-foreground shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="h-8 w-8" />
            <div>
              <p className="text-sm opacity-90">Avg Intensity</p>
              <p className="text-3xl font-bold">{avgMood}</p>
            </div>
          </div>
          <p className="text-xs opacity-80">out of 10</p>
        </Card>

        <Card className="p-6 gradient-energetic text-secondary-foreground shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="h-8 w-8" />
            <div>
              <p className="text-sm opacity-90">Total Logs</p>
              <p className="text-3xl font-bold">{logs.length}</p>
            </div>
          </div>
          <p className="text-xs opacity-80">entries recorded</p>
        </Card>

        <Card className="p-6 bg-purple-500 text-white shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <Smile className="h-8 w-8" />
            <div>
              <p className="text-sm opacity-90">Most Common</p>
              <p className="text-2xl font-bold">{MOODS.find(m => m.label === mostCommon)?.emoji || '—'}</p>
            </div>
          </div>
          <p className="text-xs opacity-80">{mostCommon}</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-orange-400 to-pink-500 text-white shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <CalendarIcon className="h-8 w-8" />
            <div>
              <p className="text-sm opacity-90">Today's Logs</p>
              <p className="text-3xl font-bold">{getTodaysMoodCount()}</p>
            </div>
          </div>
          <p className="text-xs opacity-80">entries today</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-8 w-8" />
            <div>
              <p className="text-sm opacity-90">Weekly Avg</p>
              <p className="text-3xl font-bold">{getWeeklyAverage()}</p>
            </div>
          </div>
          <p className="text-xs opacity-80">last 7 days</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <Zap className="h-8 w-8" />
            <div>
              <p className="text-sm opacity-90">Positivity</p>
              <p className="text-3xl font-bold">{getPositivityRate()}%</p>
            </div>
          </div>
          <p className="text-xs opacity-80">positive moods</p>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-indigo-400 to-purple-500 text-white shadow-soft">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="h-8 w-8" />
            <div>
              <p className="text-sm opacity-90">Consistency</p>
              <p className="text-3xl font-bold">{logs.length > 0 ? Math.min(100, Math.round((logs.length / 30) * 100)) : 0}%</p>
            </div>
          </div>
          <p className="text-xs opacity-80">tracking rate</p>
        </Card>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-3">
          {logs.slice(0, 10).map((log, index) => (
            <Card
              key={log.id}
              className="p-4 hover:shadow-md transition-shadow animate-fade-in border-l-4"
              style={{
                borderLeftColor: MOODS.find(m => m.emoji === log.mood)?.color || 'hsl(45 95% 55%)',
                animationDelay: `${index * 0.05}s`
              }}
            >
              <div className="flex items-center gap-4">
                <span className="text-4xl">{log.mood}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold">{log.moodName}</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(log.date).toLocaleString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm text-muted-foreground">Intensity:</span>
                    <div className="flex-1 bg-muted rounded-full h-2 max-w-[200px]">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${log.intensity * 10}%` }}
                      />
                    </div>
                   <span className="text-sm font-medium">{log.intensity}/10</span>
                  </div>
                  {(log.sleepQuality || log.stressLevel) && (
                    <div className="flex gap-4 text-xs text-muted-foreground mb-1">
                      {log.sleepQuality && (
                        <span className="flex items-center gap-1">
                          <Moon className="h-3 w-3" />
                          Sleep: {log.sleepQuality}/10
                        </span>
                      )}
                      {log.stressLevel && (
                        <span className="flex items-center gap-1">
                          <Brain className="h-3 w-3" />
                          Stress: {log.stressLevel}/10
                        </span>
                      )}
                    </div>
                  )}
                  {log.tags && log.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {log.tags.map(tagId => {
                        const tag = MOOD_TAGS.find(t => t.id === tagId);
                        return tag ? (
                          <Badge key={tagId} variant="secondary" className="text-xs">
                            {tag.label}
                          </Badge>
                        ) : null;
                      })}
                    </div>
                  )}
                  {log.note && (
                    <p className="text-sm text-foreground/70 mt-2">{log.note}</p>
                  )}
                  {log.activityMetrics && (
                    <div className="mt-2 pt-2 border-t border-border/50">
                      <p className="text-xs text-muted-foreground">
                        AI detected: <span className="font-semibold text-foreground/80">{log.activityMetrics.inferredMood}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="h-6 w-6 text-purple-500" />
          <h2 className="text-2xl font-bold">AI Mood Insights</h2>
        </div>

        {aiInsightsLoading ? (
          <Card className="p-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
              <span className="text-muted-foreground">Analyzing your mood patterns...</span>
            </div>
          </Card>
        ) : aiInsights?.needsMoreData ? (
          <Card className="p-6 text-center bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <Brain className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Keep Tracking!</h3>
            <p className="text-muted-foreground">
              {aiInsights.message}
            </p>
          </Card>
        ) : aiInsights?.analysis ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Overall Trend */}
            <Card className="p-6 bg-gradient-to-br from-green-500/10 to-blue-500/10 border-green-500/20">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <h3 className="font-semibold">Mood Trend</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-2 capitalize">
                {aiInsights.analysis.overallTrend} trend
              </p>
              <p className="text-sm">{aiInsights.analysis.insights}</p>
            </Card>

            {/* Patterns */}
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
              <div className="flex items-center gap-2 mb-3">
                <Target className="h-5 w-5 text-purple-500" />
                <h3 className="font-semibold">Patterns</h3>
              </div>
              <div className="space-y-2">
                {aiInsights.analysis.patterns.length > 0 ? (
                  aiInsights.analysis.patterns.map((pattern, index) => (
                    <div key={index} className="text-sm">
                      • {pattern}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Continue tracking to identify patterns</p>
                )}
              </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-red-500/10 border-orange-500/20 md:col-span-2">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="h-5 w-5 text-orange-500" />
                <h3 className="font-semibold">AI Recommendations</h3>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {aiInsights.analysis.recommendations.length > 0 ? (
                  aiInsights.analysis.recommendations.map((rec, index) => (
                    <div key={index} className="text-sm p-2 bg-background/50 rounded">
                      {rec}
                    </div>
                  ))
                ) : (
                  <div className="text-sm p-2 bg-background/50 rounded text-muted-foreground">
                    Keep logging your moods for personalized recommendations
                  </div>
                )}
              </div>
            </Card>

            {/* Positive Affirmation */}
            <Card className="p-6 bg-gradient-to-br from-pink-500/10 to-purple-500/10 border-pink-500/20 md:col-span-2">
              <div className="text-center">
                <div className="text-2xl mb-2">💫</div>
                <p className="text-lg font-medium text-pink-600">
                  {aiInsights.analysis.positiveAffirmation || 'You are taking positive steps by tracking your mood patterns.'}
                </p>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="p-6 text-center">
            <Brain className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">AI insights will appear here once you have enough mood data.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MoodTracker;
