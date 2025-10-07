import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Heart, TrendingUp, Calendar as CalendarIcon, Award, Smile, Target, Zap, Activity } from 'lucide-react';

interface MoodLog {
  id: string;
  userId: string;
  mood: string;
  moodName: string;
  intensity: number;
  note: string;
  date: string;
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

const MoodTracker = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<MoodLog[]>([]);
  const [selectedMood, setSelectedMood] = useState('😊');
  const [selectedMoodName, setSelectedMoodName] = useState('Happy');
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState('');

  useEffect(() => {
    loadLogs();
  }, [user]);

  const loadLogs = () => {
    const stored = localStorage.getItem('moodmate_mood_logs');
    if (stored) {
      const allLogs: MoodLog[] = JSON.parse(stored);
      const userLogs = allLogs.filter(l => l.userId === user?.id);
      setLogs(userLogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  };

  const handleMoodSelect = (emoji: string, label: string) => {
    setSelectedMood(emoji);
    setSelectedMoodName(label);
  };

  const handleLogMood = () => {
    const newLog: MoodLog = {
      id: Date.now().toString(),
      userId: user!.id,
      mood: selectedMood,
      moodName: selectedMoodName,
      intensity,
      note: note.trim(),
      date: new Date().toISOString(),
    };

    const stored = localStorage.getItem('moodmate_mood_logs');
    const allLogs = stored ? JSON.parse(stored) : [];
    allLogs.push(newLog);
    localStorage.setItem('moodmate_mood_logs', JSON.stringify(allLogs));

    setLogs([newLog, ...logs]);
    setNote('');
    setIntensity(5);
    toast.success('Mood logged successfully!');
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
          How are you feeling today?
        </h2>

        <div className="space-y-6">
          <div>
            <Label className="text-base mb-3 block">Select your mood:</Label>
            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
              {MOODS.map((mood) => (
                <button
                  key={mood.emoji}
                  onClick={() => handleMoodSelect(mood.emoji, mood.label)}
                  className={`flex flex-col items-center p-4 rounded-xl transition-all ${
                    selectedMood === mood.emoji
                      ? 'bg-primary/20 scale-110 shadow-lg border-2 border-primary'
                      : 'bg-muted hover:bg-muted/70 border-2 border-transparent'
                  }`}
                  style={{
                    backgroundColor: selectedMood === mood.emoji ? `${mood.color}20` : undefined,
                  }}
                >
                  <span className="text-4xl mb-2">{mood.emoji}</span>
                  <span className="text-xs font-medium">{mood.label}</span>
                </button>
              ))}
            </div>
          </div>

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
            <Label htmlFor="note">Add a note (optional):</Label>
            <Textarea
              id="note"
              placeholder="What's on your mind?"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="mt-2 min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleLogMood}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white h-12 text-lg"
          >
            Log Mood
          </Button>

          {/* Suggestions */}
          {SUGGESTIONS[selectedMoodName] && (
            <Card className="p-4 bg-muted/50 border-2 border-primary/20">
              <h3 className="font-semibold mb-2 text-primary">💡 Suggestions for {selectedMoodName}:</h3>
              <ul className="space-y-1">
                {SUGGESTIONS[selectedMoodName].map((suggestion, i) => (
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
                  {log.note && (
                    <p className="text-sm text-foreground/70 mt-2">{log.note}</p>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
