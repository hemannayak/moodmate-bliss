import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Heart, Calendar, Smile, Moon, Brain } from 'lucide-react';

interface MoodLog {
  id: string;
  userId: string;
  mood: string;
  moodName: string;
  intensity: number;
  note: string;
  date: string;
  sleepQuality?: number;
  stressLevel?: number;
  tags?: string[];
}

const MOOD_COLORS: Record<string, string> = {
  'Happy': 'hsl(45 95% 55%)',
  'Calm': 'hsl(200 70% 50%)',
  'Sad': 'hsl(220 40% 50%)',
  'Anxious': 'hsl(280 50% 55%)',
  'Tired': 'hsl(240 20% 60%)',
  'Grateful': 'hsl(330 70% 60%)',
  'Frustrated': 'hsl(10 75% 55%)',
  'Excited': 'hsl(30 95% 60%)',
};

const Analytics = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState<MoodLog[]>([]);

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

  // Weekly mood trend
  const getWeeklyTrend = () => {
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === date.getTime();
      });
      
      const avgIntensity = dayLogs.length > 0
        ? dayLogs.reduce((sum, log) => sum + log.intensity, 0) / dayLogs.length
        : 0;
      
      weekData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        intensity: Number(avgIntensity.toFixed(1)),
        count: dayLogs.length,
      });
    }
    
    return weekData;
  };

  // Mood distribution
  const getMoodDistribution = () => {
    const distribution: Record<string, number> = {};
    
    logs.forEach(log => {
      distribution[log.moodName] = (distribution[log.moodName] || 0) + 1;
    });
    
    return Object.entries(distribution).map(([name, value]) => ({
      name,
      value,
      color: MOOD_COLORS[name],
    }));
  };

  // Weekly activity
  const getWeeklyActivity = () => {
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === date.getTime();
      });
      
      weekData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        entries: dayLogs.length,
      });
    }
    
    return weekData;
  };

  // Sleep & Stress trends
  const getSleepStressTrend = () => {
    const today = new Date();
    const weekData = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayLogs = logs.filter(log => {
        const logDate = new Date(log.date);
        logDate.setHours(0, 0, 0, 0);
        return logDate.getTime() === date.getTime();
      });
      
      const avgSleep = dayLogs.length > 0
        ? dayLogs.reduce((sum, log) => sum + (log.sleepQuality || 0), 0) / dayLogs.length
        : 0;
      
      const avgStress = dayLogs.length > 0
        ? dayLogs.reduce((sum, log) => sum + (log.stressLevel || 0), 0) / dayLogs.length
        : 0;
      
      weekData.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        sleep: Number(avgSleep.toFixed(1)),
        stress: Number(avgStress.toFixed(1)),
      });
    }
    
    return weekData;
  };

  // Activity heatmap data
  const getActivityHeatmap = () => {
    const heatmapData: { hour: number; day: string; value: number }[] = [];
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    days.forEach((day, dayIndex) => {
      for (let hour = 0; hour < 24; hour++) {
        const logsInSlot = logs.filter(log => {
          const logDate = new Date(log.date);
          return logDate.getDay() === dayIndex && logDate.getHours() === hour;
        });
        
        heatmapData.push({
          hour,
          day,
          value: logsInSlot.length,
        });
      }
    });
    
    return heatmapData;
  };

  const weeklyTrend = getWeeklyTrend();
  const moodDistribution = getMoodDistribution();
  const weeklyActivity = getWeeklyActivity();
  const sleepStressTrend = getSleepStressTrend();
  const heatmapData = getActivityHeatmap();

  const calculateStreak = () => {
    if (logs.length === 0) return 0;
    
    let streak = 1;
    
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

  const avgMood = logs.length > 0
    ? (logs.reduce((sum, log) => sum + log.intensity, 0) / logs.length).toFixed(1)
    : '0';

  const mostCommonMood = moodDistribution.length > 0
    ? moodDistribution.sort((a, b) => b.value - a.value)[0].name
    : 'None';

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">Visualize your emotional journey and track progress</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6 gradient-happy text-primary-foreground">
          <div className="flex items-center gap-3">
            <Calendar className="h-8 w-8" />
            <div>
              <p className="text-sm opacity-90">Streak</p>
              <p className="text-3xl font-bold">{calculateStreak()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 gradient-calm text-accent-foreground">
          <div className="flex items-center gap-3">
            <TrendingUp className="h-8 w-8" />
            <div>
              <p className="text-sm opacity-90">Avg Mood</p>
              <p className="text-3xl font-bold">{avgMood}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 gradient-energetic text-secondary-foreground">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8" />
            <div>
              <p className="text-sm opacity-90">Total</p>
              <p className="text-3xl font-bold">{logs.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-purple-500 text-white">
          <div className="flex items-center gap-3">
            <Smile className="h-8 w-8" />
            <div>
              <p className="text-sm opacity-90">Most Common</p>
              <p className="text-xl font-bold">{mostCommonMood}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Weekly Mood Trend */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Weekly Mood Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--foreground))" />
              <YAxis domain={[0, 10]} stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="intensity"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Mood Distribution */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Heart className="h-5 w-5 text-secondary" />
            Mood Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={moodDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {moodDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Sleep & Stress Trend */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Moon className="h-5 w-5 text-purple-500" />
            Sleep & Stress Levels
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sleepStressTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--foreground))" />
              <YAxis domain={[0, 10]} stroke="hsl(var(--foreground))" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="sleep"
                stroke="hsl(280 50% 55%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(280 50% 55%)', r: 5 }}
                name="Sleep Quality"
              />
              <Line
                type="monotone"
                dataKey="stress"
                stroke="hsl(10 75% 55%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(10 75% 55%)', r: 5 }}
                name="Stress Level"
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Activity Heatmap */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-500" />
            Activity Heatmap
          </h2>
          <div className="overflow-x-auto">
            <div className="min-w-[500px]">
              <div className="grid grid-cols-25 gap-1">
                <div className="col-span-1"></div>
                {Array.from({ length: 24 }, (_, i) => (
                  <div key={i} className="text-xs text-center text-muted-foreground">
                    {i % 4 === 0 ? i : ''}
                  </div>
                ))}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <>
                    <div key={day} className="text-xs text-muted-foreground pr-2 flex items-center justify-end">
                      {day}
                    </div>
                    {Array.from({ length: 24 }, (_, hour) => {
                      const data = heatmapData.find(d => d.day === day && d.hour === hour);
                      const intensity = data ? data.value : 0;
                      const color = intensity === 0 
                        ? 'bg-muted' 
                        : intensity === 1 
                        ? 'bg-primary/20' 
                        : intensity === 2 
                        ? 'bg-primary/40' 
                        : 'bg-primary/80';
                      
                      return (
                        <div
                          key={`${day}-${hour}`}
                          className={`h-6 rounded ${color} hover:ring-2 ring-primary transition-all cursor-pointer`}
                          title={`${day} ${hour}:00 - ${intensity} entries`}
                        />
                      );
                    })}
                  </>
                ))}
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Shows when you typically log moods throughout the week
          </p>
        </Card>
      </div>

      {/* Weekly Activity */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-accent" />
          Weekly Activity
        </h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyActivity}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" stroke="hsl(var(--foreground))" />
            <YAxis stroke="hsl(var(--foreground))" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="entries" fill="hsl(var(--accent))" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Insights */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-2 border-primary/20">
        <h2 className="text-xl font-semibold mb-4">📊 Insights & Trends</h2>
        <div className="space-y-3">
          {logs.length === 0 ? (
            <p className="text-muted-foreground">Start tracking your mood to see insights!</p>
          ) : (
            <>
              <p className="text-foreground/90">
                🎯 You've logged <span className="font-bold text-primary">{logs.length}</span> mood entries so far. Keep it up!
              </p>
              {calculateStreak() > 0 && (
                <p className="text-foreground/90">
                  🔥 You're on a <span className="font-bold text-secondary">{calculateStreak()}-day</span> streak! Amazing consistency.
                </p>
              )}
              <p className="text-foreground/90">
                💡 Your average mood intensity is <span className="font-bold text-accent">{avgMood}/10</span>.
                {parseFloat(avgMood) > 7 && ' You\'re doing great!'}
                {parseFloat(avgMood) >= 5 && parseFloat(avgMood) <= 7 && ' Keep working on your wellness!'}
                {parseFloat(avgMood) < 5 && ' Consider reaching out for support.'}
              </p>
              <p className="text-foreground/90">
                😊 Your most frequent mood is <span className="font-bold">{mostCommonMood}</span>.
              </p>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Analytics;
