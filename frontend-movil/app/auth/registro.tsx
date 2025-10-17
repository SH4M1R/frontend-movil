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
    <LinearGradient colors={['#667eea', '#764ba2']} className="flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1, justifyContent: 'center' }}>
          
          {/* Botón de volver */}
          <TouchableOpacity 
            onPress={() => router.back()} 
            className="absolute top-10 left-5 z-10"
          >
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>

          {/* Logo */}
          <Animated.View 
            entering={FadeInUp.duration(900).springify()} 
            className="items-center mb-8"
          >
            <Image
                        source={require('@/assets/img/logo.jpg')}
                        className="w-28 h-28 rounded-2xl"
                        resizeMode="contain"
                      />
          </Animated.View>

          {/* Formulario */}
          <Animated.View 
            entering={FadeInDown.duration(900).springify()} 
            className="bg-white rounded-3xl p-6 shadow-lg"
          >
            <Text className="text-center mb-6 text-2xl font-semibold text-gray-800">
              Crear Cuenta
            </Text>

            {/* Nombre */}
            <View className="flex-row items-center border border-gray-300 rounded-lg mb-4 px-4 h-12">
              <Ionicons name="person-outline" size={20} color="#666" className="mr-2" />
              <TextInput
                className="flex-1 text-base text-gray-800"
                placeholder="Nombre completo"
                placeholderTextColor="#666"
                value={formData.name}
                onChangeText={(text) => handleChange('name', text)}
                editable={!loading}
              />
            </View>

            {/* Correo */}
            <View className="flex-row items-center border border-gray-300 rounded-lg mb-4 px-4 h-12">
              <Ionicons name="mail-outline" size={20} color="#666" />
              <TextInput
                className="flex-1 text-base text-gray-800 ml-2"
                placeholder="Correo electrónico"
                placeholderTextColor="#666"
                value={formData.email}
                onChangeText={(text) => handleChange('email', text)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
            </View>

            {/* Contraseña */}
            <View className="flex-row items-center border border-gray-300 rounded-lg mb-4 px-4 h-12">
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
              <TextInput
                className="flex-1 text-base text-gray-800 ml-2"
                placeholder="Contraseña"
                placeholderTextColor="#666"
                secureTextEntry
                value={formData.password}
                onChangeText={(text) => handleChange('password', text)}
                editable={!loading}
              />
            </View>

            {/* Confirmar contraseña */}
            <View className="flex-row items-center border border-gray-300 rounded-lg mb-6 px-4 h-12">
              <Ionicons name="lock-closed-outline" size={20} color="#666" />
              <TextInput
                className="flex-1 text-base text-gray-800 ml-2"
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
              className={`bg-indigo-500 py-4 rounded-lg items-center ${loading ? 'opacity-60' : ''}`}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text className="text-white text-base font-semibold">
                {loading ? 'Creando cuenta...' : 'Registrar'}
              </Text>
            </TouchableOpacity>

            {/* Enlace a login */}
            <View className="mt-6 items-center">
              <TouchableOpacity onPress={() => router.push('/auth/login')}>
                <Text className="text-gray-600">
                  ¿Ya tienes una cuenta? <Text className="text-indigo-500 font-bold">Inicia sesión</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Opción de olvidaste tu contraseña */}
            <TouchableOpacity 
              className="mt-4 items-center"
              onPress={() => Alert.alert('Próximamente', 'Funcionalidad aún no disponible')}
            >
              <Text className="text-indigo-500 text-sm font-medium">
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}