import { Card } from '@/components/ui/card';
import { BookOpen, TrendingUp, Heart, Lock, Sparkles, Calendar, Brain, Award, Clock, Zap } from 'lucide-react';

const Features = () => {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="gradient-hero py-20 text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Powerful Features for Your Wellness
          </h1>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Everything you need to understand and improve your emotional health
          </p>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Core <span className="text-primary">Features</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 hover:shadow-lg transition-all border-2 border-transparent hover:border-primary/20">
            <div className="h-16 w-16 rounded-2xl gradient-happy flex items-center justify-center mb-6">
              <BookOpen className="h-8 w-8 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Smart Journaling</h3>
            <p className="text-muted-foreground mb-4">
              Document your thoughts with rich text entries, mood tagging, and powerful search functionality.
            </p>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>✓ Rich text formatting</li>
              <li>✓ Mood-based categorization</li>
              <li>✓ Full-text search</li>
              <li>✓ Calendar view</li>
            </ul>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-all border-2 border-transparent hover:border-secondary/20">
            <div className="h-16 w-16 rounded-2xl gradient-energetic flex items-center justify-center mb-6">
              <Heart className="h-8 w-8 text-secondary-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Mood Tracking</h3>
            <p className="text-muted-foreground mb-4">
              Track 8 different emotions with customizable intensity levels and contextual notes.
            </p>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>✓ 8 distinct mood types</li>
              <li>✓ 1-10 intensity scale</li>
              <li>✓ Contextual notes</li>
              <li>✓ Streak tracking</li>
            </ul>
          </Card>

          <Card className="p-8 hover:shadow-lg transition-all border-2 border-transparent hover:border-accent/20">
            <div className="h-16 w-16 rounded-2xl gradient-calm flex items-center justify-center mb-6">
              <TrendingUp className="h-8 w-8 text-accent-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-3">Analytics Dashboard</h3>
            <p className="text-muted-foreground mb-4">
              Beautiful visualizations help you understand patterns and track your emotional journey.
            </p>
            <ul className="space-y-2 text-sm text-foreground/80">
              <li>✓ Interactive charts</li>
              <li>✓ Trend analysis</li>
              <li>✓ Weekly summaries</li>
              <li>✓ AI-powered insights</li>
            </ul>
          </Card>
        </div>
      </section>

      {/* Unique Innovations */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            What Makes Us <span className="text-secondary">Different</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Personalized Suggestions</h3>
                <p className="text-muted-foreground">
                  Get mood-specific recommendations and coping strategies based on your current emotional state.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Award className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Streak & Achievement System</h3>
                <p className="text-muted-foreground">
                  Build healthy habits with streak tracking and milestone celebrations that keep you motivated.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Calendar Integration</h3>
                <p className="text-muted-foreground">
                  View your emotional journey in a beautiful calendar format to spot patterns at a glance.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-purple-500/10 flex items-center justify-center flex-shrink-0">
                <Lock className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
                <p className="text-muted-foreground">
                  Your data is encrypted and secure. Only you have access to your personal journal and mood logs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technical Excellence */}
      <section className="py-20 container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Built with <span className="text-accent">Excellence</span>
        </h2>

        <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Beautiful Design</h3>
            <p className="text-sm text-muted-foreground">
              Carefully crafted UI that's both stunning and functional
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Zap className="h-10 w-10 text-secondary mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Lightning Fast</h3>
            <p className="text-sm text-muted-foreground">
              Optimized performance for smooth, responsive interactions
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Lock className="h-10 w-10 text-accent mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Secure & Private</h3>
            <p className="text-sm text-muted-foreground">
              Your personal data protected with industry-standard encryption
            </p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <Clock className="h-10 w-10 text-purple-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Always Available</h3>
            <p className="text-sm text-muted-foreground">
              Access your journal and moods anytime, anywhere
            </p>
          </Card>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">
            Coming <span className="text-primary">Soon</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card className="p-6">
              <p className="font-semibold mb-2">🔔 Smart Reminders</p>
              <p className="text-sm text-muted-foreground">
                Gentle nudges to log your mood at optimal times
              </p>
            </Card>
            <Card className="p-6">
              <p className="font-semibold mb-2">📊 Advanced Reports</p>
              <p className="text-sm text-muted-foreground">
                Detailed monthly and yearly mood summaries
              </p>
            </Card>
            <Card className="p-6">
              <p className="font-semibold mb-2">🎯 Goal Setting</p>
              <p className="text-sm text-muted-foreground">
                Set and track emotional wellness goals
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Features;
