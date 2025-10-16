import Footer from '@/components/Footer';
import { Slot, usePathname } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

export default function MainLayout() {
  const pathname = usePathname();
  const showHeader = !pathname.includes('perfil');

  return (
    <View className="flex-1 bg-[#f9f9f9]">
      {showHeader && (
        <View className="w-full pt-10">
          
        </View>
      )}

      <View className="flex-1">
        <Slot />
      </View>

      <Footer />
    </View>
  );
}
