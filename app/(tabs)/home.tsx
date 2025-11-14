import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Utensils, Coffee, ShoppingCart, CreditCard, BarChart3, LogOut, ShoppingBag, Users, ChefHat } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth/auth-store';

export default function Home() {
  const { user, clearUser } = useAuthStore();
  const router = useRouter();

  const handleSignOut = async () => {
    clearUser();
    router.replace('/login');
  };

  // PERMISOS CORREGIDOS - MÁS RESTRICTIVOS
  const rolePermissions = {
    admin: [
      'nuevo-pedido', 'pedidos-cobrar', 'menu', 'bebidas', 'carrito', 
      'pagos', 'reportes', 'gestion-usuarios', 'gestion-cocina'
    ],
    cajero: [
      'pedidos-cobrar', 'pagos', 'reportes'  // Cajero NO crea pedidos, solo cobra
    ],
    mesero: [
      'nuevo-pedido', 'menu', 'bebidas', 'carrito'  // Mesero NO ve pagos ni reportes
    ],
    cocinero: [
      'gestion-cocina'  // Cocinero SOLO gestiona cocina
    ],
  };

  const menuItems = [
    {
      title: 'Nuevo pedido',
      icon: ShoppingBag,
      route: '/prueba',
      color: '#4361ee',
      permission: 'nuevo-pedido',
      description: 'Crear nuevo pedido',
      roles: ['admin', 'mesero']
    },
    {
      title: 'Pedidos para cobrar',
      icon: CreditCard,
      route: '/PedidosPorCobrar',
      color: '#06a77d',
      permission: 'pedidos-cobrar',
      description: 'Cobrar pedidos listos',
      roles: ['admin', 'cajero']
    },
    {
      title: 'Gestión Cocina',
      icon: ChefHat,
      route: '/gestion-cocina',
      color: '#f77f00',
      permission: 'gestion-cocina',
      description: 'Ver pedidos en cocina',
      roles: ['admin', 'cocinero']
    },
    {
      title: 'Gestión Usuarios',
      icon: Users,
      route: '/gestion-usuarios',
      color: '#7209b7',
      permission: 'gestion-usuarios',
      description: 'Administrar usuarios',
      roles: ['admin']
    },
    {
      title: 'Menú',
      icon: Utensils,
      route: '/(tabs)/menu',
      color: '#e63946',
      permission: 'menu',
      description: 'Ver platos del menú',
      roles: ['admin', 'mesero']
    },
    {
      title: 'Bebidas',
      icon: Coffee,
      route: '/(tabs)/drinks',
      color: '#f77f00',
      permission: 'bebidas',
      description: 'Ver bebidas disponibles',
      roles: ['admin', 'mesero']
    },
    {
      title: 'Carrito',
      icon: ShoppingCart,
      route: '/(tabs)/cart',
      color: '#06a77d',
      permission: 'carrito',
      description: 'Ver carrito de compras',
      roles: ['admin', 'mesero']
    },
    {
      title: 'Pagos',
      icon: CreditCard,
      route: '/(tabs)/payment',
      color: '#4361ee',
      permission: 'pagos',
      description: 'Gestión de pagos',
      roles: ['admin', 'cajero']
    },
    {
      title: 'Reportes',
      icon: BarChart3,
      route: '/(tabs)/reports',
      color: '#7209b7',
      permission: 'reportes',
      description: 'Ver reportes y estadísticas',
      roles: ['admin', 'cajero', 'cocinero']
    },
  ];

  // Filtrar menú según permisos del rol
  const filteredMenuItems = menuItems.filter(item => {
    const userRole = user?.rol?.toLowerCase();
    const permissions = rolePermissions[userRole as keyof typeof rolePermissions] || [];
    return permissions.includes(item.permission);
  });

  // Función para navegar de forma segura
  const handleNavigation = (route: string) => {
    if (route.startsWith('/(tabs)')) {
      router.push(route as any);
    } else {
      router.navigate(route as any);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bienvenido</Text>
        <Text style={styles.userName}>{user?.nombre || user?.correo}</Text>
        <Text style={styles.userRole}>
          {user?.rol ? `Rol: ${user.rol.charAt(0).toUpperCase() + user.rol.slice(1)}` : 'Usuario'}
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Módulos Disponibles</Text>
        
        {filteredMenuItems.length > 0 ? (
          <View style={styles.grid}>
            {filteredMenuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.card, { borderLeftColor: item.color }]}
                onPress={() => handleNavigation(item.route)}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
                  <item.icon color={item.color} size={32} />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No tienes acceso a ningún módulo</Text>
            <Text style={styles.emptySubtext}>Contacta al administrador</Text>
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <LogOut color="#fff" size={20} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>

        {/* Información de debug */}
        <View style={styles.devInfo}>
          <Text style={styles.devText}>DEBUG INFO:</Text>
          <Text style={styles.devText}>• Rol actual: {user?.rol}</Text>
          <Text style={styles.devText}>• Módulos disponibles: {filteredMenuItems.length}</Text>
          <Text style={styles.devText}>• Tabs permitidos: {filteredMenuItems.filter(item => item.route.startsWith('/(tabs)')).map(item => item.title).join(', ')}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#e63946',
    padding: 24,
    paddingTop: 32,
  },
  welcomeText: {
    fontSize: 18,
    color: '#fff',
    opacity: 0.9,
  },
  userName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginTop: 4,
  },
  userRole: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
    paddingBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#343a40',
    margin: 16,
    marginBottom: 8,
  },
  grid: {
    padding: 16,
    gap: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 4,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    color: '#6c757d',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    margin: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  devInfo: {
    backgroundColor: '#e9ecef',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#6c757d',
  },
  devText: {
    fontSize: 12,
    color: '#495057',
    fontFamily: 'monospace',
  },
});