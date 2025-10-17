import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';

export default function Header() {
  const { user } = useAuth();

  return (
    <View className="bg-white shadow px-4 py-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <Ionicons name="pricetag-outline" size={24} color="#1e3a8a" />
          <Text className="ml-2 text-lg font-nunito font-black text-blue-950">
            MODASTYLE
          </Text>
        </View>
        {user && (
          <View className="flex-row items-center">
            <Ionicons name="person-circle-outline" size={24} color="#1e3a8a" />
            <Text className="ml-1 text-base font-semibold text-blue-950">
              {user.username}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}
