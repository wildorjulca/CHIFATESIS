import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { Utensils, Coffee, ShoppingCart, CreditCard, BarChart3, LogOut } from 'lucide-react-native';
import { useAuthStore } from '@/store/auth/auth-store';

export default function Home() {
  // const { user, signOut } = useAuth();
  const {  user, clearUser} = useAuthStore()
  const router = useRouter();

  const handleSignOut = async () => {
    // await signOut();
    clearUser()
    router.replace('/login');
  };

  const menuItems = [
    { title: 'Menú', icon: Utensils, route: '/(tabs)/menu', color: '#e63946' },
    { title: 'Bebidas', icon: Coffee, route: '/(tabs)/drinks', color: '#f77f00' },
    { title: 'Carrito', icon: ShoppingCart, route: '/(tabs)/cart', color: '#06a77d' },
    { title: 'Pagos', icon: CreditCard, route: '/(tabs)/payment', color: '#4361ee' },
    { title: 'Reportes', icon: BarChart3, route: '/(tabs)/reports', color: '#7209b7' },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bienvenido</Text>
        <Text style={styles.userName}>{user?.correo}</Text>
        <Text style={styles.userRole}>Rol: {user?.rol}</Text>
      </View>

      <View style={styles.grid}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.card, { borderLeftColor: item.color }]}
            onPress={() => router.push(item.route as any)}
          >
            <View style={[styles.iconContainer, { backgroundColor: `${item.color}20` }]}>
              <item.icon color={item.color} size={32} />
            </View>
            <Text style={styles.cardTitle}>{item.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <LogOut color="#fff" size={20} />
        <Text style={styles.logoutText}>Cerrar Sesión</Text>
      </TouchableOpacity>
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
  grid: {
    padding: 16,
    gap: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
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
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343a40',
  },
  logoutButton: {
    backgroundColor: '#dc3545',
    margin: 16,
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
});
