import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('moodmate_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const signup = async (email: string, password: string): Promise<boolean> => {
    try {
      // Demo: Store in localStorage (replace with MongoDB API call)
      const users = JSON.parse(localStorage.getItem('moodmate_users') || '[]');
      
      if (users.find((u: any) => u.email === email)) {
        return false; // User already exists
      }

      const newUser = {
        id: Date.now().toString(),
        email,
        password, // In production, this should be hashed
      };

      users.push(newUser);
      localStorage.setItem('moodmate_users', JSON.stringify(users));

      const userSession = { id: newUser.id, email: newUser.email };
      setUser(userSession);
      localStorage.setItem('moodmate_user', JSON.stringify(userSession));

      return true;
    } catch (error) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Demo: Check localStorage (replace with MongoDB API call)
      const users = JSON.parse(localStorage.getItem('moodmate_users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);

      if (foundUser) {
        const userSession = { id: foundUser.id, email: foundUser.email };
        setUser(userSession);
        localStorage.setItem('moodmate_user', JSON.stringify(userSession));
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('moodmate_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
