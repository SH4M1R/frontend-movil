import { Image, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function HomeScreen() {
  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <Animated.View entering={FadeInUp.duration(1000).springify()} style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.View entering={FadeInDown.duration(1000).springify()} style={styles.content}>
        <ThemedText type="title" style={styles.title}>
          Bienvenido a Fashion Store
        </ThemedText>
        <ThemedText type="default" style={styles.subtitle}>
          Descubre las últimas tendencias en moda
        </ThemedText>
        
        <Image
          source={require('@/assets/images/fondo.jpg')}
          style={styles.backgroundImage}
          resizeMode="cover"
        />
        
        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.button}>
            <ThemedText type="defaultSemiBold" style={styles.buttonText}>
              Empezar
            </ThemedText>
          </TouchableOpacity>
        </Link>

        <ThemedText type="default" style={styles.registerText}>
          ¿No tienes una cuenta?{' '}
          <Link href="/(auth)/register" style={styles.registerLink}>
            Regístrate
          </Link>
        </ThemedText>
      </Animated.View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 120,
    height: 120,
  },
  content: {
    alignItems: 'center',
    width: '100%',
  },
  title: {
    textAlign: 'center',
    marginBottom: 10,
    color: 'white',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 30,
    opacity: 0.7,
    color: 'white',
  },
  backgroundImage: {
    width: '100%',
    height: 200,
    borderRadius: 15,
    marginBottom: 40,
  },
  button: {
    backgroundColor: 'white',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  buttonText: {
    color: '#667eea',
    fontSize: 16,
  },
  registerText: {
    marginTop: 10,
    color: 'white',
  },
  registerLink: {
    color: 'white',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});