import React, { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  clearAuthError,
  loginUser,
  selectAuthError,
  selectAuthStatus,
  signupUser,
} from '../features/auth/authSlice';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD = 6;

export default function LoginScreen() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const isRegister = mode === 'register';
  const loading = status === 'loading';

  const canSubmit =
    !loading &&
    EMAIL_RE.test(email.trim()) &&
    password.length >= (isRegister ? MIN_PASSWORD : 1) &&
    (!isRegister || name.trim().length > 0);

  const submit = () => {
    const credentials = { email: email.trim(), password };
    dispatch(
      isRegister
        ? signupUser({ ...credentials, name: name.trim() })
        : loginUser(credentials),
    );
  };

  const toggleMode = () => {
    dispatch(clearAuthError());
    setMode(isRegister ? 'login' : 'register');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.content}>
        <Text style={styles.logo}>🛒</Text>
        <Text style={styles.title}>Welcome to E-Commerce</Text>
        <Text style={styles.subtitle}>
          {isRegister ? 'Create an account to start shopping' : 'Sign in to start shopping'}
        </Text>

        {isRegister && (
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#9ca3af"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder={isRegister ? `Password (min ${MIN_PASSWORD} characters)` : 'Password'}
          placeholderTextColor="#9ca3af"
          value={password}
          onChangeText={setPassword}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
        />

        {error && <Text style={styles.error}>{error}</Text>}

        <PrimaryButton
          title={isRegister ? 'Create Account' : 'Log In'}
          onPress={submit}
          disabled={!canSubmit}
          style={styles.button}
        />
        {loading && <ActivityIndicator style={styles.button} color="#2f6feb" />}

        <View style={styles.switchRow}>
          <Text style={styles.switchText}>
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
          </Text>
          <Pressable onPress={toggleMode} disabled={loading}>
            <Text style={styles.switchLink}>{isRegister ? 'Log In' : 'Register'}</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logo: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2937',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 6,
    marginBottom: 28,
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  error: {
    color: '#d64545',
    fontSize: 13,
    marginBottom: 4,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  switchText: {
    fontSize: 14,
    color: '#6b7280',
  },
  switchLink: {
    fontSize: 14,
    color: '#2f6feb',
    fontWeight: '600',
  },
});
