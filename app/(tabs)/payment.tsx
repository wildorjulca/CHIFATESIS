import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { Order, Payment } from '@/types/database.types';
import { CreditCard, Banknote, Smartphone, Wallet } from 'lucide-react-native';

export default function PaymentScreen() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user?.id)
        .eq('status', 'pendiente')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (method: 'efectivo' | 'yape' | 'plin' | 'tarjeta') => {
    if (!selectedOrder) {
      Alert.alert('Error', 'Selecciona un pedido primero');
      return;
    }

    try {
      const { error: paymentError } = await supabase
        .from('payments')
        .insert({
          order_id: selectedOrder.id,
          method,
          amount: selectedOrder.total,
          status: 'completado',
        });

      if (paymentError) throw paymentError;

      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'completado' })
        .eq('id', selectedOrder.id);

      if (orderError) throw orderError;

      Alert.alert('Éxito', 'Pago procesado correctamente');
      setSelectedOrder(null);
      loadOrders();
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo procesar el pago');
    }
  };

  const paymentMethods = [
    { id: 'efectivo', label: 'Efectivo', icon: Banknote, color: '#28a745' },
    { id: 'yape', label: 'Yape', icon: Smartphone, color: '#722F9C' },
    { id: 'plin', label: 'Plin', icon: Smartphone, color: '#00A19B' },
    { id: 'tarjeta', label: 'Tarjeta', icon: CreditCard, color: '#4361ee' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e63946" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pedidos Pendientes</Text>
        {orders.length === 0 ? (
          <Text style={styles.emptyText}>No hay pedidos pendientes</Text>
        ) : (
          <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.orderCard,
                  selectedOrder?.id === item.id && styles.orderCardSelected,
                ]}
                onPress={() => setSelectedOrder(item)}
              >
                <Text style={styles.orderId}>
                  Pedido #{item.id.slice(0, 8)}
                </Text>
                <Text style={styles.orderTotal}>
                  S/ {item.total.toFixed(2)}
                </Text>
                <Text style={styles.orderDate}>
                  {new Date(item.created_at).toLocaleDateString()}
                </Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.ordersList}
          />
        )}
      </View>

      {selectedOrder && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Método de Pago</Text>
          <View style={styles.methodsGrid}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={[
                  styles.methodCard,
                  { borderLeftColor: method.color },
                ]}
                onPress={() => handlePayment(method.id as any)}
              >
                <View
                  style={[
                    styles.methodIcon,
                    { backgroundColor: `${method.color}20` },
                  ]}
                >
                  <method.icon color={method.color} size={32} />
                </View>
                <Text style={styles.methodLabel}>{method.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6c757d',
    marginTop: 16,
  },
  ordersList: {
    paddingRight: 16,
  },
  orderCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  orderCardSelected: {
    borderColor: '#e63946',
  },
  orderId: {
    fontSize: 12,
    color: '#6c757d',
    marginBottom: 4,
  },
  orderTotal: {
    fontSize: 20,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 12,
    color: '#6c757d',
  },
  methodsGrid: {
    gap: 12,
  },
  methodCard: {
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
  methodIcon: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343a40',
  },
});
