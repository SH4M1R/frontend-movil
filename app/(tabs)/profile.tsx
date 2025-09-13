import { StyleSheet, TouchableOpacity, Alert, Image } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/contexts/AuthContext';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que quieres cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Cerrar Sesión', onPress: () => {
          logout();
          router.replace('/(tabs)');
        }, style: 'destructive' }
      ]
    );
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <ThemedView style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Mi Perfil
        </ThemedText>

        <Image
          source={require('@/assets/images/icon.png')}
          style={styles.avatar}
          resizeMode="contain"
        />

        <ThemedView style={styles.profileCard}>
          <ThemedView style={styles.profileItem}>
            <Ionicons name="person-outline" size={20} color="#666" />
            <ThemedText type="defaultSemiBold" style={styles.profileText}>
              {user?.name}
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.profileItem}>
            <Ionicons name="mail-outline" size={20} color="#666" />
            <ThemedText type="default" style={styles.profileText}>
              {user?.email}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="white" />
          <ThemedText type="defaultSemiBold" style={styles.logoutButtonText}>
            Cerrar Sesión
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
    color: 'white',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 30,
    backgroundColor: 'white',
    padding: 20,
  },
  profileCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    width: '100%',
  },
  profileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileText: {
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    marginLeft: 10,
  },
});