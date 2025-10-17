import { useAuth } from '@/contexts/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function LoginScreen() {
  const [userInput, setUserInput] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!userInput || !password) {
      Alert.alert('Campos vacíos', 'Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    const success = await login(userInput, password);
    setLoading(false);

    if (success) {
      Alert.alert('Bienvenido', `Hola, ${userInput}!`);
      router.replace('/views/home');
    } else {
      Alert.alert('Error', 'Usuario o contraseña incorrectos');
    }
  };

  const handleGuestMode = () => {
    router.replace('/views/home');
  };

  return (
    <LinearGradient colors={['#f5f7fa', '#c3cfe2']} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 justify-center px-6"
      >
        {/* Botón Modo Invitado */}
        <TouchableOpacity
          className="absolute top-10 right-6 z-10 bg-blue-500 rounded-md py-1.5 px-3"
          onPress={handleGuestMode}
        >
          <Text className="text-white font-semibold text-sm">Modo Invitado</Text>
        </TouchableOpacity>

        {/* Logo */}
        <Animated.View entering={FadeInDown.duration(800)} className="items-center mb-6">
          <Image
            source={require('@/assets/img/logo.jpg')}
            className="w-28 h-28 rounded-2xl"
            resizeMode="contain"
          />
          <Text className="text-2xl font-bold text-gray-800 mt-2">
            YOURBRAND - MODASTYLE
          </Text>
        </Animated.View>

        {/* Formulario */}
        <Animated.View
          entering={FadeInUp.duration(1000)}
          className="bg-white rounded-2xl p-6 shadow-md"
        >
          <Text className="text-center text-2xl font-bold text-blue-600 mb-5">
            Iniciar Sesión
          </Text>

          {/* Usuario */}
          <View className="flex-row items-center bg-gray-100 rounded-lg mb-4 px-3">
            <Ionicons name="person-outline" size={20} color="#666" />
            <TextInput
              className="flex-1 h-12 text-base text-gray-800 ml-2"
              placeholder="Correo"
              placeholderTextColor="#999"
              value={userInput}
              onChangeText={setUserInput}
              autoCapitalize="none"
            />
          </View>

          {/* Contraseña */}
          <View className="flex-row items-center bg-gray-100 rounded-lg mb-5 px-3">
            <Ionicons name="lock-closed-outline" size={20} color="#666" />
            <TextInput
              className="flex-1 h-12 text-base text-gray-800 ml-2"
              placeholder="Contraseña"
              placeholderTextColor="#999"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          {/* Botón ingresar */}
          <TouchableOpacity
            className={`bg-blue-500 py-3.5 rounded-lg items-center ${loading ? 'opacity-60' : ''}`}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white font-bold text-base">
              {loading ? 'Ingresando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          {/* Enlace a registro */}
          <TouchableOpacity onPress={() => router.push('/auth/registro')}>
            <Text className="text-center mt-4 text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Text className="text-blue-500 font-semibold">Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}