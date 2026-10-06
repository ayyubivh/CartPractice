import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import type { AuthResponse, User } from '../../types';
import type { RootState } from '../../store/store';
import { loadSession } from './sessionStorage';

interface LoginArgs {
  email: string;
  password: string;
}

interface SignupArgs extends LoginArgs {
  name: string;
}

const post = <T>(path: string, body: T) =>
  api.post<AuthResponse>(path, body).then(res => res.data);

export const loginUser = createAsyncThunk('auth/login', (args: LoginArgs) =>
  post('/api/auth/login', args),
);

export const signupUser = createAsyncThunk('auth/signup', (args: SignupArgs) =>
  post('/api/auth/register', args),
);

// Reads the saved session from device storage once at startup.
export const restoreSession = createAsyncThunk('auth/restore', loadSession);

interface AuthState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
  // False until the saved session has been read, so the navigator doesn't
  // flash the login screen for a user who is already signed in.
  hydrated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  status: 'idle',
  error: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => ({ ...initialState, hydrated: true }),
    clearAuthError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.hydrated = true;
        if (action.payload && !state.user) {
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      })
      .addCase(restoreSession.rejected, state => {
        state.hydrated = true;
      });

    for (const thunk of [loginUser, signupUser]) {
      builder
        .addCase(thunk.pending, state => {
          state.status = 'loading';
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.status = 'idle';
          state.user = action.payload.user;
          state.token = action.payload.token;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.status = 'failed';
          state.error = action.error.message ?? 'Something went wrong';
        });
    }
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectAuthHydrated = (state: RootState) => state.auth.hydrated;
export default authSlice.reducer;
