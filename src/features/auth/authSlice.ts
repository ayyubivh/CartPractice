import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { apiFetch } from '../../api/client'
import { AuthResponse, User } from '../../types'
import { RootState } from '../../store/store'

interface LoginArgs {
    email: string
    password: string
}

interface SignupArgs extends LoginArgs {
    name: string
}

const post = <T>(path: string, body: T) =>
    apiFetch<AuthResponse>(path, { method: 'POST', body: JSON.stringify(body) })

export const loginUser = createAsyncThunk('auth/login', (args: LoginArgs) =>
    post('/api/auth/login', args)
)

export const signupUser = createAsyncThunk('auth/signup', (args: SignupArgs) =>
    post('/api/auth/signup', args)
)

interface AuthState{
    user: User | null
    token: string | null
    status: 'idle' | 'loading' | 'failed'
    error: string | null
}

const initialState: AuthState = {
    user: null,
    token: null,
    status: 'idle',
    error: null,
}

const authSlice = createSlice({
   name: 'auth',
   initialState,
   reducers:{
    logout:() => initialState,
    clearAuthError: state => {
        state.error = null
    },
   },
   extraReducers: builder => {
    for (const thunk of [loginUser, signupUser]) {
        builder
            .addCase(thunk.pending, state => {
                state.status = 'loading'
                state.error = null
            })
            .addCase(thunk.fulfilled, (state, action) => {
                state.status = 'idle'
                state.user = action.payload.user
                state.token = action.payload.token
            })
            .addCase(thunk.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message ?? 'Something went wrong'
            })
    }
   }
});

export const { logout, clearAuthError } = authSlice.actions;
export const selectAuthStatus = (state: RootState) => state.auth.status
export const selectAuthError = (state: RootState) => state.auth.error
export default authSlice.reducer;
