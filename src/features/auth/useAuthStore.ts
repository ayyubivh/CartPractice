import { create } from 'zustand';
import { api } from '../../api/client';
import type { AuthResponse, User } from '../../types';
import { useCartStore } from '../cart/useCartStore';
import { useFavoritesStore } from '../favorites/useFavoritesStore';
import { clearSession, loadSession, saveSession } from './sessionStorage';

interface LoginArgs {
  email: string;
  password: string;
}

interface SignupArgs extends LoginArgs {
  name: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  // False until the saved session has been read, so the navigator doesn't
  // flash the login screen for a user who is already signed in.
  hydrated: boolean;
  login: (args: LoginArgs) => Promise<void>;
  signup: (args: SignupArgs) => Promise<void>;
  restoreSession: () => Promise<void>;
  logout: () => void;
  clearAuthError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => {
  const authenticate = async (path: string, body: LoginArgs | SignupArgs) => {
    set({ status: 'loading', error: null });
    try {
      const { data } = await api.post<AuthResponse>(path, body);
      set({ status: 'idle', user: data.user, token: data.token });
    } catch (e) {
      set({
        status: 'failed',
        error: e instanceof Error ? e.message : 'Something went wrong',
      });
    }
  };

  return {
    user: null,
    token: null,
    status: 'idle',
    error: null,
    hydrated: false,
    login: args => authenticate('/api/auth/login', args),
    signup: args => authenticate('/api/auth/register', args),
    restoreSession: async () => {
      try {
        const session = await loadSession();
        if (session && !get().user) {
          set({ user: session.user, token: session.token });
        }
      } catch {}
      set({ hydrated: true });
    },
    logout: () => {
      // A new session must not inherit the previous user's data.
      useCartStore.getState().clearCart();
      useFavoritesStore.setState({ favoriteIds: [] });
      set({
        user: null,
        token: null,
        status: 'idle',
        error: null,
        hydrated: true,
      });
    },
    clearAuthError: () => set({ error: null }),
  };
});

// Mirror the session to device storage whenever it changes. Skipped until
// restoreSession has run, otherwise the empty initial state would wipe it.
let persisted = useAuthStore.getState().token;
useAuthStore.subscribe(({ token, user, hydrated }) => {
  if (!hydrated || token === persisted) {
    return;
  }
  persisted = token;
  (token && user ? saveSession({ user, token }) : clearSession()).catch(
    () => {},
  );
});
