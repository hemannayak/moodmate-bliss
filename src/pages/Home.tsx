import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { BookOpen, TrendingUp, Sparkles, Heart, Brain, Calendar } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
        <div className="absolute inset-0 gradient-hero opacity-30 animate-pulse"></div>
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-fade-in">
            <div className="mb-8 flex justify-center gap-4 text-6xl animate-scale-in">
              😊 😌 😢 🤗
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              Track Your Mood,
              <br />
              Transform Your Life
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4">
              Your personal companion for emotional wellness and mental health tracking
            </p>
            <p className="text-lg text-muted-foreground/80 mb-8 max-w-2xl mx-auto">
              AI-powered insights • Sleep & stress tracking • Beautiful analytics • 100% private
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white text-lg px-10 py-6 shadow-glow hover:shadow-xl transition-all hover:scale-105">
                  ✨ Get Started Free
                </Button>
              </Link>
              <Link to="/features">
                <Button size="lg" variant="outline" className="text-lg px-10 py-6 border-2 hover:border-primary hover:bg-primary/5 transition-all">
                  Learn More →
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              🎉 Join thousands tracking their emotional wellness • No credit card required
            </p>
          </div>
        </div>
      </section>

      {/* Features Highlight */}
      <section className="py-20 bg-gradient-to-b from-background to-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-4">
            <span className="text-5xl mb-4 inline-block">✨</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Everything You Need for
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Emotional Wellness</span>
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto text-lg">
            Powerful AI-driven features designed to help you understand and improve your mental health
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-8 hover:shadow-2xl transition-all duration-300 animate-scale-in bg-gradient-to-br from-card to-primary/5 border-2 border-transparent hover:border-primary/30 hover:-translate-y-2 group">
              <div className="h-16 w-16 rounded-2xl gradient-happy flex items-center justify-center mb-6 shadow-soft group-hover:scale-110 transition-transform">
                <BookOpen className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 group-hover:text-primary transition-colors">Smart Journaling 📝</h3>
              <p className="text-muted-foreground leading-relaxed">
                Document your thoughts and feelings with rich text entries and mood tagging. Search and review your journey anytime.
              </p>
              <div className="mt-4 pt-4 border-t border-border/50">
                <span className="text-sm text-primary font-medium">→ Start writing today</span>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-2xl transition-all duration-300 animate-scale-in bg-gradient-to-br from-card to-secondary/5 border-2 border-transparent hover:border-secondary/30 hover:-translate-y-2 group" style={{ animationDelay: '0.1s' }}>
              <div className="h-16 w-16 rounded-2xl gradient-energetic flex items-center justify-center mb-6 shadow-soft group-hover:scale-110 transition-transform">
                <Heart className="h-8 w-8 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 group-hover:text-secondary transition-colors">AI Mood Tracking 🧠</h3>
              <p className="text-muted-foreground leading-relaxed">
                Advanced activity analysis infers your emotional state. Track sleep, stress, and mood triggers with intelligent insights.
              </p>
              <div className="mt-4 pt-4 border-t border-border/50">
                <span className="text-sm text-secondary font-medium">→ Discover patterns</span>
              </div>
            </Card>

            <Card className="p-8 hover:shadow-2xl transition-all duration-300 animate-scale-in bg-gradient-to-br from-card to-accent/5 border-2 border-transparent hover:border-accent/30 hover:-translate-y-2 group" style={{ animationDelay: '0.2s' }}>
              <div className="h-16 w-16 rounded-2xl gradient-calm flex items-center justify-center mb-6 shadow-soft group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 group-hover:text-accent transition-colors">Visual Analytics 📊</h3>
              <p className="text-muted-foreground leading-relaxed">
                Beautiful charts, heatmaps, and trend analysis help you understand your emotional patterns and celebrate progress.
              </p>
              <div className="mt-4 pt-4 border-t border-border/50">
                <span className="text-sm text-accent font-medium">→ View insights</span>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Choose <span className="text-secondary">MoodMate?</span>
          </h2>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Science-Backed Approach</h3>
                <p className="text-muted-foreground">
                  Built on proven psychological principles to help you develop better emotional awareness and resilience.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Sparkles className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Beautiful & Intuitive</h3>
                <p className="text-muted-foreground">
                  A delightful user experience that makes mood tracking something you'll actually enjoy doing every day.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                <Calendar className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Daily Habit Building</h3>
                <p className="text-muted-foreground">
                  Streak tracking and gentle reminders help you build a consistent practice of self-reflection.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Privacy First</h3>
                <p className="text-muted-foreground">
                  Your personal data is encrypted and secure. Only you have access to your journal and mood history.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-primary-foreground">
            Start Your Journey to Better Mental Health
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
            Join thousands of people who are taking control of their emotional wellness with MoodMate
          </p>
          <Link to="/signup">
            <Button size="lg" className="bg-card hover:bg-card/90 text-foreground text-lg px-8 shadow-glow">
              Create Free Account
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
