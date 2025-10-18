import { useAuth } from '@/contexts/AuthContext';
import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleOptionPress = (option: string) => {
    alert(`Has presionado: ${option}`);
  };

  const handleLogout = () => {
    logout(); 
    router.replace('/auth/login'); 
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
      <View style={styles.userInfo}>
        <Text style={styles.username}>{user?.username || 'Invitado'}</Text>
        <Ionicons name="person-circle" size={60} color="#007AFF" />
      </View>

      <View style={styles.mainOptionsContainer}>
        <TouchableOpacity style={styles.mainOption} onPress={() => handleOptionPress('Mi Perfil')}>
          <Ionicons name="person-outline" size={36} color="#007AFF" />
          <Text style={styles.mainOptionText}>Mi Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mainOption} onPress={() => handleOptionPress('Mis Pedidos')}>
          <MaterialIcons name="shopping-bag" size={36} color="#007AFF" />
          <Text style={styles.mainOptionText}>Mis Pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.mainOption} onPress={() => handleOptionPress('Mis Favoritos')}>
          <Ionicons name="heart-outline" size={36} color="#007AFF" />
          <Text style={styles.mainOptionText}>Mis Favoritos</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Mis Direcciones')}>
          <Ionicons name="location-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Mis Direcciones</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Términos y Condiciones')}>
          <FontAwesome name="file-text-o" size={24} color="#333" />
          <Text style={styles.optionText}>Términos y Condiciones</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Atención al Cliente')}>
          <Ionicons name="call-outline" size={24} color="#333" />
          <Text style={styles.optionText}>Atención al Cliente</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => handleOptionPress('Libro de Reclamaciones')}>
          <MaterialIcons name="feedback" size={24} color="#333" />
          <Text style={styles.optionText}>Libro de Reclamaciones</Text>
          <Ionicons name="chevron-forward" size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={24} color="white" />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 15 },

  userInfo: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 20 },
  username: { fontSize: 22, fontWeight: 'bold' },

  mainOptionsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 15 },
  mainOption: { alignItems: 'center', backgroundColor: 'white', borderRadius: 10, paddingVertical: 15, paddingHorizontal: 10, width: 100, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
  mainOptionText: { marginTop: 8, fontSize: 14, fontWeight: '600', textAlign: 'center' },

  section: { marginVertical: 15, backgroundColor: 'white', borderRadius: 10, paddingVertical: 10 },
  option: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 15, borderTopWidth: 0.5, borderTopColor: '#eee' },
  optionText: { flex: 1, marginLeft: 10, fontSize: 16, color: '#333' },

  logout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30, backgroundColor: '#FF3B30', paddingVertical: 12, borderRadius: 10 },
  logoutText: { color: 'white', fontSize: 16, fontWeight: '600', marginLeft: 10 },
});