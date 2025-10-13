import usuarios from '@/data/usuarios';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function LoginScreen() {
  const [userInput, setUserInput] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = () => {
    if (!userInput || !password) {
      Alert.alert('Campos vacíos', 'Por favor completa todos los campos.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const usuarioEncontrado = usuarios.find(
        (u) =>
          (u.username.toLowerCase() === userInput.toLowerCase() ||
            u.correo.toLowerCase() === userInput.toLowerCase()) &&
          u.contraseña === password
      );

      setLoading(false);

      if (usuarioEncontrado) {
        Alert.alert('Bienvenido', `Hola, ${usuarioEncontrado.username}!`);
        router.replace('/views/home');
      } else {
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      }
    }, 1000);
  };

  const handleGuestMode = () => {
    // Redirige al home como invitado
    router.replace('/views/home');
  };

  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        {/* Botón Modo Invitado */}
        <TouchableOpacity style={styles.guestButton} onPress={handleGuestMode}>
          <Text style={styles.guestText}>Modo Invitado</Text>
        </TouchableOpacity>

        {/* Logo */}
        <Animated.View entering={FadeInDown.duration(800)} style={styles.logoContainer}>
          <Image
            source={require('@/assets/img/logo.jpg')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appName}>YOURBRAND - MODASTYLE</Text>
        </Animated.View>

        {/* Formulario */}
        <Animated.View entering={FadeInUp.duration(1000)} style={styles.form}>
          <Text style={styles.title}>Iniciar Sesión</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Usuario o correo"
              placeholderTextColor="#999"
              value={userInput}
              onChangeText={setUserInput}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && { opacity: 0.6 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Ingresando...' : 'Entrar'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push('/auth/registro')}>
            <Text style={styles.registerText}>
              ¿No tienes una cuenta? <Text style={styles.registerLink}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
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
    padding: 25,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 100,
    height: 100,
    borderRadius: 20,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  form: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 45,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerText: {
    textAlign: 'center',
    marginTop: 15,
    color: '#666',
  },
  registerLink: {
    color: '#007AFF',
    fontWeight: '600',
  },
  guestButton: {
  position: 'absolute',
  top: 40,
  right: 25,
  zIndex: 2,
  paddingVertical: 6,
  paddingHorizontal: 12,
  backgroundColor: '#007AFF',
  borderRadius: 8,
},
guestText: {
  color: 'white',
  fontWeight: '600',
  fontSize: 14,
},
});