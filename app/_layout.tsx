import { AuthProvider } from '@/contexts/AuthContext';
import { PedidoProvider } from '@/contexts/PedidoContext';
import { StoreProvider } from '@/contexts/StoreContext';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Nunito_400Regular, Nunito_700Bold, useFonts } from '@expo-google-fonts/nunito';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';

import { StripeProvider } from '@stripe/stripe-react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import 'react-native-reanimated';

const STRIPE_PUBLISHABLE_KEY = "pk_test_51NczKhIflwBxpIOlJaEMgCS6nl1ObNGGsw7hJJjaMWN7D62yLP2Tktds4EsP0RJGHGnmJ9cdrd65vCOya0F0LAAP00wdH1suG8";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  
  const [fontsLoaded] = useFonts({
    Nunito_400Regular,
    Nunito_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StripeProvider 
      publishableKey={STRIPE_PUBLISHABLE_KEY}
      merchantIdentifier="merchant.com.modastyle" 
    >
      <PaperProvider>
        <AuthProvider>
            {/* 🎯 SOLUCIÓN: ENVOLVER LA APLICACIÓN CON PEDIDOPROVIDER */}
            <PedidoProvider>
              <StoreProvider>
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                  <Stack screenOptions={{ headerShown: false }}>
                    <Stack.Screen name="index" />
                    <Stack.Screen name="auth/login" />
                    <Stack.Screen name="auth/registro" />
                  </Stack>
                  <StatusBar style="auto" />
                </ThemeProvider>
              </StoreProvider>
            </PedidoProvider>
        </AuthProvider>
      </PaperProvider>
    </StripeProvider>
  );
}