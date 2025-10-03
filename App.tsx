import React, { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { SignIn } from './components/SignIn';
import { SignUp } from './components/SignUp';
import { Home } from './components/Home';

import './global.css';

function AuthNavigator() {
  const { user, loading } = useAuth();
  const [showSignUp, setShowSignUp] = useState(false);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!user) {
    return showSignUp ? (
      <SignUp onNavigateToSignIn={() => setShowSignUp(false)} />
    ) : (
      <SignIn onNavigateToSignUp={() => setShowSignUp(true)} />
    );
  }

  return <Home />;
}

export default function App() {
  return (
    <AuthProvider>
      <AuthNavigator />
      <StatusBar style="auto" />
    </AuthProvider>
  );
}
