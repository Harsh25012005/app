import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export const Home = () => {
  const { user, profile, signOut } = useAuth();

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <Text className="text-3xl font-bold text-gray-900 mb-2">PG Admin Dashboard</Text>
          <Text className="text-base text-gray-600">Welcome back!</Text>
        </View>

        {/* User Profile Card */}
        <View className="bg-blue-50 rounded-lg p-6 mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Profile Information</Text>
          
          <View className="space-y-3">
            <View>
              <Text className="text-sm text-gray-600 mb-1">Name</Text>
              <Text className="text-base font-medium text-gray-900">
                {profile?.name || 'N/A'}
              </Text>
            </View>

            <View className="mt-3">
              <Text className="text-sm text-gray-600 mb-1">Email</Text>
              <Text className="text-base font-medium text-gray-900">
                {profile?.email || user?.email || 'N/A'}
              </Text>
            </View>

            <View className="mt-3">
              <Text className="text-sm text-gray-600 mb-1">Phone Number</Text>
              <Text className="text-base font-medium text-gray-900">
                {profile?.phone_number || 'Not provided'}
              </Text>
            </View>

            <View className="mt-3">
              <Text className="text-sm text-gray-600 mb-1">User ID</Text>
              <Text className="text-xs font-mono text-gray-700">
                {user?.id || 'N/A'}
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</Text>
          
          <TouchableOpacity className="bg-white border border-gray-300 rounded-lg p-4 mb-3">
            <Text className="text-base font-medium text-gray-900">Manage PG</Text>
            <Text className="text-sm text-gray-600 mt-1">View and manage your PG properties</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white border border-gray-300 rounded-lg p-4 mb-3">
            <Text className="text-base font-medium text-gray-900">Tenants</Text>
            <Text className="text-sm text-gray-600 mt-1">Manage tenant information</Text>
          </TouchableOpacity>

          <TouchableOpacity className="bg-white border border-gray-300 rounded-lg p-4 mb-3">
            <Text className="text-base font-medium text-gray-900">Payments</Text>
            <Text className="text-sm text-gray-600 mt-1">Track rent and payments</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          className="bg-red-600 rounded-lg py-4 mt-4"
          onPress={signOut}
        >
          <Text className="text-white text-center text-base font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
