import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Home() {
  return (
    <View style={styles.container}>
      <Text style={styles.carousel}>[Carrusel principal aquí]</Text>
      <Text style={styles.carousel}>[Carrusel de productos aquí]</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  carousel: { 
    height: 200, 
    backgroundColor: '#eee', 
    marginBottom: 15, 
    borderRadius: 10, 
    textAlign: 'center', 
    lineHeight: 200 
  },
});