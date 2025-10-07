import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { BookOpen, Plus, Search, Calendar } from 'lucide-react';

interface JournalEntry {
  id: string;
  userId: string;
  title: string;
  content: string;
  mood: string;
  date: string;
  tags: string[];
}

const MOODS = [
  { emoji: '😊', label: 'Happy', color: 'hsl(45 95% 55%)' },
  { emoji: '😌', label: 'Calm', color: 'hsl(200 70% 50%)' },
  { emoji: '😢', label: 'Sad', color: 'hsl(220 40% 50%)' },
  { emoji: '😰', label: 'Anxious', color: 'hsl(280 50% 55%)' },
  { emoji: '😴', label: 'Tired', color: 'hsl(240 20% 60%)' },
  { emoji: '🤗', label: 'Grateful', color: 'hsl(330 70% 60%)' },
];

const Journal = () => {
  const { user } = useAuth();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedMood, setSelectedMood] = useState('😊');

  useEffect(() => {
    loadEntries();
  }, [user]);

  const loadEntries = () => {
    const stored = localStorage.getItem('moodmate_journal_entries');
    if (stored) {
      const allEntries: JournalEntry[] = JSON.parse(stored);
      const userEntries = allEntries.filter(e => e.userId === user?.id);
      setEntries(userEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
    }
  };

  const handleSaveEntry = () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in both title and content');
      return;
    }

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      userId: user!.id,
      title: title.trim(),
      content: content.trim(),
      mood: selectedMood,
      date: new Date().toISOString(),
      tags: [],
    };

    const stored = localStorage.getItem('moodmate_journal_entries');
    const allEntries = stored ? JSON.parse(stored) : [];
    allEntries.push(newEntry);
    localStorage.setItem('moodmate_journal_entries', JSON.stringify(allEntries));

    setEntries([newEntry, ...entries]);
    setTitle('');
    setContent('');
    setSelectedMood('😊');
    setShowForm(false);
    toast.success('Journal entry saved!');
  };

  const filteredEntries = entries.filter(entry =>
    entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          My Journal
        </h1>
        <p className="text-muted-foreground">Document your thoughts and feelings</p>
      </div>

      {/* Search and New Entry */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search entries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12"
          />
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white gap-2"
        >
          <Plus className="h-5 w-5" />
          New Entry
        </Button>
      </div>

      {/* New Entry Form */}
      {showForm && (
        <Card className="p-6 mb-8 shadow-soft animate-scale-in border-2 border-purple-500/20">
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-purple-500" />
            New Journal Entry
          </h2>

          <div className="space-y-4">
            <div>
              <Label>How are you feeling?</Label>
              <div className="flex gap-2 mt-2">
                {MOODS.map((mood) => (
                  <button
                    key={mood.emoji}
                    onClick={() => setSelectedMood(mood.emoji)}
                    className={`text-4xl p-2 rounded-lg transition-all ${
                      selectedMood === mood.emoji
                        ? 'bg-purple-100 scale-110 shadow-md'
                        : 'hover:bg-muted'
                    }`}
                    title={mood.label}
                  >
                    {mood.emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Give your entry a title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your thoughts..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mt-2 min-h-[200px]"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleSaveEntry}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                Save Entry
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg text-muted-foreground">
              {searchQuery ? 'No entries found' : 'Start writing your first journal entry!'}
            </p>
          </Card>
        ) : (
          filteredEntries.map((entry, index) => (
            <Card
              key={entry.id}
              className="p-6 hover:shadow-lg transition-shadow animate-fade-in border-l-4"
              style={{
                borderLeftColor: MOODS.find(m => m.emoji === entry.mood)?.color || 'hsl(45 95% 55%)',
                animationDelay: `${index * 0.05}s`
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-4xl">{entry.mood}</span>
                  <div>
                    <h3 className="text-xl font-semibold">{entry.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-foreground/80 whitespace-pre-wrap">{entry.content}</p>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal;
