import { Tabs } from 'expo-router';
import { Home, Utensils, Coffee, ShoppingCart, CreditCard, BarChart3 } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth/auth-store';

export default function TabsLayout() {
  const { user } = useAuthStore();

  // DEFINIR PERMISOS CORRECTOS POR ROL
  const rolePermissions = {
    admin: ['home', 'menu', 'drinks', 'payment', 'reports'],
    cajero: ['home', 'payment', 'reports'],
    mesero: ['home', 'menu', 'drinks'],
    cocinero: ['home', 'reports'],
  };

  // Obtener el rol del usuario y filtrar tabs permitidos
  const userRole = user?.rol?.toLowerCase() as keyof typeof rolePermissions;
  const allowedTabs = rolePermissions[userRole] || ['home'];

  console.log(`[DEBUG] Rol: ${userRole}, Tabs permitidos:`, allowedTabs);

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#e63946',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: '700',
        },
        tabBarActiveTintColor: '#e63946',
        tabBarInactiveTintColor: '#6c757d',
      }}
    >
      {/* Definir CADA pantalla individualmente con href condicional */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Home color={color} size={size} />
          ),
          href: allowedTabs.includes('home') ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="menu"
        options={{
          title: 'Menú',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Utensils color={color} size={size} />
          ),
          href: allowedTabs.includes('menu') ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="drinks"
        options={{
          title: 'Bebidas',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <Coffee color={color} size={size} />
          ),
          href: allowedTabs.includes('drinks') ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="payment"
        options={{
          title: 'Pagos',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <CreditCard color={color} size={size} />
          ),
          href: allowedTabs.includes('payment') ? undefined : null,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reportes',
          tabBarIcon: ({ color, size }: { color: string; size: number }) => (
            <BarChart3 color={color} size={size} />
          ),
          href: allowedTabs.includes('reports') ? undefined : null,
        }}
      />
    </Tabs>
  );
}