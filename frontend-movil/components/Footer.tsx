import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Footer() {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState('home');

  useEffect(() => {
    if (pathname.includes('home')) setActive('home');
    else if (pathname.includes('productos')) setActive('productos');
    else if (pathname.includes('categorias')) setActive('categorias');
    else if (pathname.includes('perfil')) setActive('perfil');
  }, [pathname]);

  const buttons = [
    { key: 'home', label: 'Inicio', icon: 'home', route: 'views/home' },
    { key: 'productos', label: 'Productos', icon: 'pricetag', route: 'views/productos' },
    { key: 'perfil', label: 'Perfil', icon: 'person', route: 'views/perfil' },
  ];

  return (
    <View style={styles.footer}>
      {buttons.map(btn => (
        <TouchableOpacity
          key={btn.key}
          style={[styles.button, active === btn.key && styles.activeButton]}
          onPress={() => router.push(btn.route)}>
          <Ionicons name={btn.icon as any} size={24} color={active === btn.key ? '#007AFF' : '#999'}/>
          <Text style={{ color: active === btn.key ? '#007AFF' : '#999' }}>{btn.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: { 
    height: 60, 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    borderTopWidth: 1, 
    borderTopColor: '#ccc', 
    backgroundColor: '#fff'
  },
  button: { 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingHorizontal: 10, 
    paddingVertical: 5, 
    borderRadius: 10 
  },
  activeButton: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)'
  }
});