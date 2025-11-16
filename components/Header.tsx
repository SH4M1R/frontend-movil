import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Header() {
  const { user } = useAuth();

  return (
    <SafeAreaView>
      <View className="bg-white shadow px-3 py-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Ionicons name="pricetag-outline" size={24} color="indigo" />
            <Text className="ml-2 text-lg font-nunito font-black text-indigo-700">
              MODASTYLE
            </Text>
          </View>
          {user && (
            <View className="flex-row items-center">
              <Ionicons name="person-circle-outline" size={24} color="indigo" />
              <Text className="ml-1 text-base font-semibold text-indigo-700">
                {user.nombre || 'Usuario'}
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
