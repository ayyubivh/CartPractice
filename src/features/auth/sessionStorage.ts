import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthResponse } from '../../types';

// Provided by Hermes at runtime but missing from the RN TypeScript globals.
declare function atob(data: string): string;

const SESSION_KEY = 'auth.session';

// The backend issues short-lived JWTs; reading `exp` lets us drop a stale
// session on launch instead of showing the app in a signed-in state.
const isExpired = (token: string) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload)) as { exp?: number };
    return typeof exp === 'number' && exp * 1000 <= Date.now();
  } catch {
    return true;
  }
};

export const saveSession = (session: AuthResponse) =>
  AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));

export const clearSession = () => AsyncStorage.removeItem(SESSION_KEY);

export async function loadSession(): Promise<AuthResponse | null> {
  const raw = await AsyncStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }
  try {
    const session = JSON.parse(raw) as AuthResponse;
    if (session?.token && session.user && !isExpired(session.token)) {
      return session;
    }
  } catch {}
  await clearSession();
  return null;
}
