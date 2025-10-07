import { useEffect, useRef, useState } from 'react';

interface ActivityMetrics {
  typingSpeed: number; // chars per second
  cursorMovement: 'calm' | 'moderate' | 'erratic';
  scrollDepth: number; // percentage
  clickFrequency: number; // clicks per minute
  sessionDuration: number; // seconds
  idleTime: number; // seconds
}

export const useActivityTracking = () => {
  const [metrics, setMetrics] = useState<ActivityMetrics>({
    typingSpeed: 0,
    cursorMovement: 'calm',
    scrollDepth: 0,
    clickFrequency: 0,
    sessionDuration: 0,
    idleTime: 0,
  });

  const sessionStart = useRef(Date.now());
  const lastActivity = useRef(Date.now());
  const keyPresses = useRef<number[]>([]);
  const mouseMovements = useRef<{ x: number; y: number; time: number }[]>([]);
  const clicks = useRef<number[]>([]);
  const maxScroll = useRef(0);
  const idleTimeRef = useRef(0);

  useEffect(() => {
    // Keyboard tracking
    const handleKeyPress = () => {
      keyPresses.current.push(Date.now());
      lastActivity.current = Date.now();
      idleTimeRef.current = 0;
      
      // Keep only last 10 seconds of data
      const tenSecondsAgo = Date.now() - 10000;
      keyPresses.current = keyPresses.current.filter(t => t > tenSecondsAgo);
    };

    // Mouse tracking
    const handleMouseMove = (e: MouseEvent) => {
      mouseMovements.current.push({ x: e.clientX, y: e.clientY, time: Date.now() });
      lastActivity.current = Date.now();
      idleTimeRef.current = 0;
      
      // Keep only last 5 seconds of movements
      const fiveSecondsAgo = Date.now() - 5000;
      mouseMovements.current = mouseMovements.current.filter(m => m.time > fiveSecondsAgo);
    };

    // Click tracking
    const handleClick = () => {
      clicks.current.push(Date.now());
      lastActivity.current = Date.now();
      idleTimeRef.current = 0;
      
      // Keep only last minute
      const oneMinuteAgo = Date.now() - 60000;
      clicks.current = clicks.current.filter(t => t > oneMinuteAgo);
    };

    // Scroll tracking
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
      maxScroll.current = Math.max(maxScroll.current, scrollPercent);
      lastActivity.current = Date.now();
      idleTimeRef.current = 0;
    };

    // Calculate metrics every 2 seconds
    const interval = setInterval(() => {
      const now = Date.now();
      
      // Typing speed (chars per second)
      const typingSpeed = keyPresses.current.length / 10;
      
      // Cursor movement pattern
      let cursorPattern: 'calm' | 'moderate' | 'erratic' = 'calm';
      if (mouseMovements.current.length > 5) {
        const distances = [];
        for (let i = 1; i < mouseMovements.current.length; i++) {
          const prev = mouseMovements.current[i - 1];
          const curr = mouseMovements.current[i];
          const dist = Math.sqrt(
            Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2)
          );
          distances.push(dist);
        }
        const avgDist = distances.reduce((a, b) => a + b, 0) / distances.length;
        const variance = distances.reduce((sum, d) => sum + Math.pow(d - avgDist, 2), 0) / distances.length;
        
        if (variance > 5000) cursorPattern = 'erratic';
        else if (variance > 1000) cursorPattern = 'moderate';
      }
      
      // Click frequency (per minute)
      const clickFrequency = clicks.current.length;
      
      // Session duration
      const sessionDuration = Math.floor((now - sessionStart.current) / 1000);
      
      // Idle time
      const timeSinceLastActivity = Math.floor((now - lastActivity.current) / 1000);
      if (timeSinceLastActivity > 5) {
        idleTimeRef.current += 2; // Add 2 seconds (interval duration)
      }
      
      setMetrics({
        typingSpeed: Number(typingSpeed.toFixed(1)),
        cursorMovement: cursorPattern,
        scrollDepth: Number(maxScroll.current.toFixed(0)),
        clickFrequency,
        sessionDuration,
        idleTime: idleTimeRef.current,
      });
    }, 2000);

    document.addEventListener('keypress', handleKeyPress);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    window.addEventListener('scroll', handleScroll);

    return () => {
      clearInterval(interval);
      document.removeEventListener('keypress', handleKeyPress);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const getInferredMood = (): string => {
    const { typingSpeed, cursorMovement, clickFrequency, idleTime, sessionDuration } = metrics;
    
    // High energy indicators
    if (typingSpeed > 5 && clickFrequency > 10 && cursorMovement === 'erratic') {
      return 'Excited or Anxious';
    }
    
    // Anxious indicators
    if (cursorMovement === 'erratic' && clickFrequency > 8) {
      return 'Anxious';
    }
    
    // Low energy indicators
    if (typingSpeed < 2 && clickFrequency < 3 && idleTime > 30) {
      return 'Tired or Sad';
    }
    
    // Calm indicators
    if (cursorMovement === 'calm' && clickFrequency < 5 && typingSpeed < 4) {
      return 'Calm';
    }
    
    // Engaged indicators
    if (sessionDuration > 120 && clickFrequency > 5) {
      return 'Engaged/Happy';
    }
    
    return 'Neutral';
  };

  return { metrics, getInferredMood };
};
