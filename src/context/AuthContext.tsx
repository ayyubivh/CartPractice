import React, { createContext, useContext, useState } from 'react';
import { User } from '../types';

// ============================================================================
// REDUX MIGRATION CANDIDATE #3: auth state
//
// Maps to an `authSlice`:
//   - state:   user: User | null
//   - actions: login, logout
//
// There's no real backend here — login just accepts a name + email and
// "signs in" — but the shape (a single current-user object read by the
// navigator AND the Profile screen) is exactly what auth state looks like
// in a real app, and is a common first Redux slice for beginners.
// ============================================================================

interface AuthContextValue {
  user: User | null;
  login: (name: string, email: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // ---- STATE LIVES HERE (would become the authSlice's initial state + reducers) ----
  const [user, setUser] = useState<User | null>(null);

  const login = (name: string, email: string) => {
    setUser({ name, email });
  };

  const logout = () => setUser(null);

  const value: AuthContextValue = { user, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
