import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface SignUpProps {
  onNavigateToSignIn: () => void;
}

export const SignUp = ({ onNavigateToSignIn }: SignUpProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const { signUp } = useAuth();

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }


    if (phoneNumber && !/^\+?[\d\s-()]+$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Phone number is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      const { error } = await signUp(email, password, name, phoneNumber);

      if (error) {
        Alert.alert('Sign Up Error', error.message || 'An error occurred during sign up');
      } else {
        Alert.alert(
          'Success',
          'Account created successfully! Please check your email to verify your account.',
          [{ text: 'OK', onPress: onNavigateToSignIn }]
        );
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 bg-white"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-8">
          {/* Header */}
          <View className="mb-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">Create Account</Text>
            <Text className="text-base text-gray-600">Sign up to get started</Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Name Input */}
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Full Name</Text>
              <TextInput
                className={`border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-base`}
                placeholder="Enter your full name"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (errors.name) setErrors({ ...errors, name: '' });
                }}
                autoCapitalize="words"
                editable={!loading}
              />
              {errors.name && <Text className="text-red-500 text-xs mt-1">{errors.name}</Text>}
            </View>

            {/* Email Input */}
            <View className="mt-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
              <TextInput
                className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-base`}
                placeholder="Enter your email"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (errors.email) setErrors({ ...errors, email: '' });
                }}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
              {errors.email && <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>}
            </View>

            {/* Phone Number Input */}
            <View className="mt-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Phone Number</Text>
              <TextInput
                className={`border ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-base`}
                placeholder="Enter your phone number"
                value={phoneNumber}
                onChangeText={(text) => {
                  setPhoneNumber(text);
                  if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' });
                }}
                keyboardType="phone-pad"
                editable={!loading}
              />
              {errors.phoneNumber && (
                <Text className="text-red-500 text-xs mt-1">{errors.phoneNumber}</Text>
              )}
            </View>

            {/* Password Input */}
            <View className="mt-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
              <TextInput
                className={`border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 text-base`}
                placeholder="Enter your password"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password) setErrors({ ...errors, password: '' });
                }}
                secureTextEntry
                editable={!loading}
              />
              {errors.password && (
                <Text className="text-red-500 text-xs mt-1">{errors.password}</Text>
              )}
            </View>


            {/* Sign Up Button */}
            <TouchableOpacity
              className={`mt-6 rounded-lg py-4 ${loading ? 'bg-blue-400' : 'bg-blue-600'}`}
              onPress={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center text-base font-semibold">Sign Up</Text>
              )}
            </TouchableOpacity>

            {/* Sign In Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={onNavigateToSignIn} disabled={loading}>
                <Text className="text-blue-600 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
