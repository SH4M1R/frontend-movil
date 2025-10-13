import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    if (!formData.name || !formData.email || !formData.password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    const success = await register(formData.name, formData.email, formData.password);
    setLoading(false);

    if (success) {
      router.replace('/views/home');
    } else {
      Alert.alert('Error', 'No se pudo crear la cuenta');
    }
  };

  return (
    <LinearGradient colors={['#667eea', '#764ba2']} style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          
          {/* Botón de volver */}
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>

          {/* Logo */}
          <Animated.View entering={FadeInUp.duration(900).springify()} style={styles.logoContainer}>
            <Image
              source={require('@/assets/img/logo.jpg')}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Formulario */}
          <Animated.View entering={FadeInDown.duration(900).springify()} style={styles.formContainer}>
            <Text style={styles.title}>Crear Cuenta</Text>

            <View style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                placeholderTextColor="#666"
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Correo electrónico"
                placeholderTextColor="#666"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Contraseña"
                placeholderTextColor="#666"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                editable={!loading}
              />
            </View>

            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Confirmar contraseña"
                placeholderTextColor="#666"
                secureTextEntry
                value={formData.confirmPassword}
                onChangeText={(text) => handleChange('confirmPassword', text)}
                editable={!loading}
              />
            </View>

            {/* Botón registrar */}
            <TouchableOpacity 
              style={[styles.registerButton, loading && styles.disabledButton]} 
              onPress={handleRegister}
              disabled={loading}
            >
              <Text style={styles.registerButtonText}>
                {loading ? 'Creando cuenta...' : 'Registrar'}
              </Text>
            </TouchableOpacity>

            {/* Enlace a login */}
            <View style={styles.bottomTextContainer}>
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text style={styles.loginText}>
                  ¿Ya tienes una cuenta? <Text style={styles.loginLink}>Inicia sesión</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Opción de olvidaste tu contraseña */}
            <TouchableOpacity 
              style={styles.forgotPassword}
              onPress={() => Alert.alert('Próximamente', 'Funcionalidad aún no disponible')}
            >
              <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardAvoid: { flex: 1 },
  scrollContent: {
    padding: 20,
    flexGrow: 1,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 110,
    height: 110,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 6,
  },
  title: {
    textAlign: 'center',
    marginBottom: 25,
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#333' },
  registerButton: {
    backgroundColor: '#667eea',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: { opacity: 0.6 },
  registerButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  bottomTextContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: { color: '#666' },
  loginLink: { color: '#667eea', fontWeight: 'bold' },
  forgotPassword: {
    marginTop: 15,
    alignItems: 'center',
  },
  forgotPasswordText: {
    color: '#667eea',
    fontSize: 14,
    fontWeight: '500',
  },
});