import Footer from '@/components/Footer';
import Header from '@/components/Header';
import { Slot, usePathname } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function MainLayout() {
  const pathname = usePathname();

  // Oculta header en perfil
  const showHeader = !pathname.includes('perfil');

  return (
    <View style={styles.container}>
      {showHeader && <Header />}
      <View style={styles.content}>
        <Slot />
      </View>
      <Footer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  content: { flex: 1 },
});
