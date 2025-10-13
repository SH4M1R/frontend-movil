import { useAuth } from '@/contexts/AuthContext';
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';

interface HeaderProps {
  // puedes agregar props si quieres que el header sea dinámico
}

export default function Header(props: HeaderProps) {
  const { user } = useAuth(); // obtiene el usuario logueado

  return (
    <View style={styles.header}>
      {/* Logo y nombre de la empresa */}
      <View style={styles.leftContainer}>
        <Image
          source={require('@/assets/img/logo.jpg')} // reemplaza con tu logo
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.companyName}>MODASTYLE</Text>
      </View>

      {/* Nombre del usuario */}
      <Text style={styles.username}>
        {user ? user.username : 'Bienvenido'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});
