import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function RootLayout() {

  const queryClient = new QueryClient()

  useFrameworkReady();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen
              options={{
                animation: "slide_from_right",
              }}
              name='prueba' />
            <Stack.Screen name='menuOrderScreen' />
            <Stack.Screen name='ConfirmOrder' />
            <Stack.Screen name='PedidoSuccesScreen' />
            <Stack.Screen name='CustomerInfoScreen' />
            <Stack.Screen name='PaymentMethodScreen' />
            <Stack.Screen  name='PedidosPorCobrar'/>
            <Stack.Screen  name='DetallePedidoScreen'/>
            <Stack.Screen  name='ProcesarPagoScreen'/>
            <Stack.Screen  name='GestionCocinaScreen'/>
            <Stack.Screen  name='GestionUsuarioScreen'/>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>

  );
}
