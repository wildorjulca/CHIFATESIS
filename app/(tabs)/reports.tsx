import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, DollarSign, Package, Users } from 'lucide-react-native';

interface SalesStats {
  totalSales: number;
  totalOrders: number;
  totalRevenue: number;
  topProducts: { name: string; count: number }[];
}

export default function Reports() {
  const [stats, setStats] = useState<SalesStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const { data: orders, error: ordersError } = await supabase
        .from('orders')
        .select('*, order_items(*, products(name))');

      if (ordersError) throw ordersError;

      const completedOrders = orders.filter((o) => o.status === 'completado');
      const totalRevenue = completedOrders.reduce(
        (sum, order) => sum + Number(order.total),
        0
      );

      const productCounts: { [key: string]: number } = {};
      completedOrders.forEach((order) => {
        order.order_items?.forEach((item: any) => {
          const name = item.products?.name || 'Desconocido';
          productCounts[name] = (productCounts[name] || 0) + item.quantity;
        });
      });

      const topProducts = Object.entries(productCounts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      setStats({
        totalSales: completedOrders.length,
        totalOrders: orders.length,
        totalRevenue,
        topProducts,
      });
    } catch (error: any) {
      Alert.alert('Error', 'No se pudo cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e63946" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay datos disponibles</Text>
      </View>
    );
  }

  const statsCards = [
    {
      title: 'Ingresos Totales',
      value: `S/ ${stats.totalRevenue.toFixed(2)}`,
      icon: DollarSign,
      color: '#28a745',
    },
    {
      title: 'Ventas Completadas',
      value: stats.totalSales.toString(),
      icon: TrendingUp,
      color: '#e63946',
    },
    {
      title: 'Total Pedidos',
      value: stats.totalOrders.toString(),
      icon: Package,
      color: '#4361ee',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Reportes y Estadísticas</Text>
        <Text style={styles.headerSubtitle}>
          Visualiza el rendimiento del negocio
        </Text>
      </View>

      <View style={styles.statsGrid}>
        {statsCards.map((card, index) => (
          <View
            key={index}
            style={[styles.statCard, { borderLeftColor: card.color }]}
          >
            <View
              style={[
                styles.statIcon,
                { backgroundColor: `${card.color}20` },
              ]}
            >
              <card.icon color={card.color} size={24} />
            </View>
            <View style={styles.statInfo}>
              <Text style={styles.statTitle}>{card.title}</Text>
              <Text style={[styles.statValue, { color: card.color }]}>
                {card.value}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <TrendingUp color="#e63946" size={24} />
          <Text style={styles.sectionTitle}>Productos Más Vendidos</Text>
        </View>

        {stats.topProducts.length === 0 ? (
          <Text style={styles.emptyText}>
            No hay productos vendidos aún
          </Text>
        ) : (
          <View style={styles.topProductsList}>
            {stats.topProducts.map((product, index) => (
              <View key={index} style={styles.productItem}>
                <View style={styles.productRank}>
                  <Text style={styles.productRankText}>{index + 1}</Text>
                </View>
                <View style={styles.productInfo}>
                  <Text style={styles.productName}>{product.name}</Text>
                  <Text style={styles.productCount}>
                    {product.count} unidades vendidas
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
  },
  header: {
    backgroundColor: '#e63946',
    padding: 24,
    paddingTop: 32,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
  },
  statsGrid: {
    padding: 16,
    gap: 12,
  },
  statCard: {
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
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  statInfo: {
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#343a40',
  },
  topProductsList: {
    gap: 12,
  },
  productItem: {
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
  },
  productRank: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e63946',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  productRankText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 4,
  },
  productCount: {
    fontSize: 14,
    color: '#6c757d',
  },
});
