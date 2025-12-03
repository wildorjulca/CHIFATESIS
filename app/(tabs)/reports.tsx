import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  CreditCard,
  ChefHat,
  Coffee,
  Table,
  Clock,
  Users,
  Calendar,
  Filter,
  Download,
  ArrowRight,
  BarChart,
  PieChart,
  Target,
  Award,
  Zap
} from 'lucide-react-native';
import instance from '@/lib/intance';

const { width } = Dimensions.get('window');

// Componente simple para tarjetas
const Card = ({ title, value, icon: Icon, color, style }: any) => (
  <View style={[styles.card, style]}>
    <View style={styles.cardHeader}>
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Icon size={20} color={color} />
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <Text style={styles.cardValue}>{value}</Text>
  </View>
);

// Componente para items de lista
const ListItem = ({ title, subtitle, icon: Icon, color, onPress }: any) => (
  <TouchableOpacity style={styles.listItem} onPress={onPress}>
    <View style={styles.listItemLeft}>
      <View style={[styles.listIcon, { backgroundColor: color + '20' }]}>
        <Icon size={18} color={color} />
      </View>
      <View style={styles.listText}>
        <Text style={styles.listTitle}>{title}</Text>
        <Text style={styles.listSubtitle}>{subtitle}</Text>
      </View>
    </View>
    <ArrowRight size={16} color="#9ca3af" />
  </TouchableOpacity>
);

const ReportesScreen = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [periodo, setPeriodo] = useState<'hoy' | 'semana' | 'mes'>('hoy');

  // Datos del reporte
  const [datos, setDatos] = useState({
    ventasTotales: 0,
    totalPedidos: 0,
    ticketPromedio: 0,
    metodosPago: [] as any[],
    platosTop: [] as any[],
    bebidasTop: [] as any[],
    mesasTop: [] as any[],
    horariosTop: [] as any[],
    meserosTop: [] as any[]
  });

  // Cargar todos los datos
  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Crear array de promesas para todas las peticiones
      const endpoints = [
        { key: 'metodosPago', url: `/reportes/metodo-pago-mas-usado?periodo=${periodo}` },
        { key: 'platosTop', url: `/reportes/platos-mas-vendidos?periodo=${periodo}` },
        { key: 'mesasTop', url: `/reportes/mesas-mas-utilizadas?periodo=${periodo}` },
        { key: 'horariosTop', url: `/reportes/horarios-activos?periodo=${periodo}` },
        { key: 'meserosTop', url: `/reportes/reporte-meseros?periodo=${periodo}` }
      ];

      // Ejecutar todas las peticiones
      const resultados = await Promise.all(
        endpoints.map(async ({ key, url }) => {
          try {
            const response = await instance.get(url);
            return { key, data: response.data.data };
          } catch (error) {
            console.warn(`Error en ${key}:`, error);
            return { key, data: null };
          }
        })
      );

      // Procesar resultados
      const datosTemp: any = {
        ventasTotales: 0,
        totalPedidos: 0,
        ticketPromedio: 0,
        metodosPago: [],
        platosTop: [],
        bebidasTop: [],
        mesasTop: [],
        horariosTop: [],
        meserosTop: []
      };

      resultados.forEach(({ key, data }) => {
        switch (key) {
          case 'metodosPago':
            if (data?.metodos) {
              datosTemp.metodosPago = data.metodos;
              datosTemp.ventasTotales = data.total_monto || 0;
            }
            break;
          case 'platosTop':
            if (data) {
              datosTemp.platosTop = data.top_platos || [];
              datosTemp.bebidasTop = data.top_bebidas || [];
            }
            break;
          case 'mesasTop':
            if (data?.mesas) {
              datosTemp.mesasTop = data.mesas;
            }
            break;
          case 'horariosTop':
            if (data?.horarios_activos) {
              datosTemp.horariosTop = data.horarios_activos;
            }
            break;
          case 'meserosTop':
            if (data?.meseros) {
              datosTemp.meserosTop = data.meseros;
              // Calcular total de pedidos desde meseros
              datosTemp.totalPedidos = data.meseros.reduce(
                (sum: number, mesero: any) => sum + (mesero.total_pedidos || 0), 0
              );
            }
            break;
        }
      });

      // Calcular ticket promedio
      if (datosTemp.totalPedidos > 0) {
        datosTemp.ticketPromedio = datosTemp.ventasTotales / datosTemp.totalPedidos;
      }

      setDatos(datosTemp);

    } catch (error: any) {
      console.error('Error cargando datos:', error.message);
      Alert.alert('Error', 'No se pudieron cargar los reportes');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [periodo]);

  const handleRefresh = () => {
    setRefreshing(true);
    cargarDatos();
  };

  // Formatear dinero
  const formatMoney = (amount: any) => {
    const n = Number(amount);
    if (isNaN(n)) return "S/ 0.00";
    return "S/ " + n.toFixed(2);
  };

  // Formatear número
  const formatNumber = (num: any) => {
    const n = Number(num);
    if (isNaN(n)) return "0";
    return n.toString();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="dark-content" />
        <ActivityIndicator size="large" color="#dc2626" />
        <Text style={styles.loadingText}>Cargando reportes...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header simple */}
      <View style={styles.header}>
        <Text style={styles.title}>Reportes</Text>
      </View>

      {/* Selector de periodo */}
      <View style={styles.periodoSelector}>
        {(['hoy', 'semana', 'mes'] as const).map((item) => (
          <TouchableOpacity
            key={item}
            style={[
              styles.periodoBtn,
              periodo === item && styles.periodoBtnActive
            ]}
            onPress={() => setPeriodo(item)}
          >
            <Text style={[
              styles.periodoBtnText,
              periodo === item && styles.periodoBtnTextActive
            ]}>
              {item === 'hoy' ? 'Hoy' : item === 'semana' ? 'Semana' : 'Mes'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#dc2626']}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Resumen principal */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen General</Text>
          <View style={styles.statsGrid}>
            <Card
              title="Ventas Totales"
              value={formatMoney(datos.ventasTotales)}
              icon={DollarSign}
              color="#dc2626"
            />
            <Card
              title="Total Pedidos"
              value={formatNumber(datos.totalPedidos)}
              icon={ShoppingBag}
              color="#3b82f6"
            />
            <Card
              title="Ticket Promedio"
              value={formatMoney(datos.ticketPromedio)}
              icon={TrendingUp}
              color="#10b981"
            />
            <Card
              title="Efectividad"
              value={datos.meserosTop.length > 0 ? "Alta" : "Media"}
              icon={Target}
              color="#8b5cf6"
            />
          </View>
        </View>

        {/* Métodos de Pago */}
        {datos.metodosPago.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Métodos de Pago</Text>
              <TouchableOpacity>
                <Text style={styles.verTodo}>Ver todos</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.metodosList}>
              {datos.metodosPago.slice(0, 3).map((metodo, index) => (
                <View key={index} style={styles.metodoItem}>
                  <View style={styles.metodoInfo}>
                    <CreditCard size={16} color="#3b82f6" />
                    <Text style={styles.metodoNombre}>
                      {metodo.metodo.charAt(0).toUpperCase() + metodo.metodo.slice(1)}
                    </Text>
                  </View>
                  <View style={styles.metodoStats}>
                    <Text style={styles.metodoPorcentaje}>{metodo.porcentaje}%</Text>
                    <Text style={styles.metodoMonto}>{formatMoney(metodo.monto_total)}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Productos Más Vendidos */}
        {(datos.platosTop.length > 0 || datos.bebidasTop.length > 0) && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Productos Destacados</Text>
              <TouchableOpacity>
                <Text style={styles.verTodo}>Ver top 10</Text>
              </TouchableOpacity>
            </View>

            {/* Platos */}
            {datos.platosTop.length > 0 && (
              <View style={styles.productosSection}>
                <View style={styles.productosHeader}>
                  <ChefHat size={18} color="#dc2626" />
                  <Text style={styles.productosTitle}>Platos Más Vendidos</Text>
                </View>
                {datos.platosTop.slice(0, 3).map((plato, index) => (
                  <ListItem
                    key={index}
                    title={plato.nombre || `Plato ${index + 1}`}
                    subtitle={`${plato.cantidad_vendida || 0} vendidos • ${formatMoney(plato.total_recaudado)}`}
                    icon={ChefHat}
                    color="#dc2626"
                  />
                ))}
              </View>
            )}

            {/* Bebidas */}
            {datos.bebidasTop.length > 0 && (
              <View style={styles.productosSection}>
                <View style={styles.productosHeader}>
                  <Coffee size={18} color="#3b82f6" />
                  <Text style={styles.productosTitle}>Bebidas Más Vendidas</Text>
                </View>
                {datos.bebidasTop.slice(0, 3).map((bebida, index) => (
                  <ListItem
                    key={index}
                    title={bebida.nombre || `Bebida ${index + 1}`}
                    subtitle={`${bebida.cantidad_vendida || 0} vendidas • ${formatMoney(bebida.total_recaudado)}`}
                    icon={Coffee}
                    color="#3b82f6"
                  />
                ))}
              </View>
            )}
          </View>
        )}

        {/* Mesas Más Activas */}
        {datos.mesasTop.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mesas Más Activas</Text>
              <TouchableOpacity>
                <Text style={styles.verTodo}>Ver todas</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.mesasList}>
              {datos.mesasTop.slice(0, 3).map((mesa, index) => (
                <ListItem
                  key={index}
                  title={mesa.nombre_mesa || `Mesa ${index + 1}`}
                  subtitle={`${mesa.veces_utilizada || 0} usos • ${formatMoney(mesa.total_recaudado)}`}
                  icon={Table}
                  color="#10b981"
                />
              ))}
            </View>
          </View>
        )}

        {/* Horarios Más Activos */}
        {datos.horariosTop.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Horarios con Más Pedidos</Text>
              <TouchableOpacity>
                <Text style={styles.verTodo}>Ver gráfico</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.horariosList}>
              {datos.horariosTop.slice(0, 3).map((horario, index) => (
                <View key={index} style={styles.horarioItem}>
                  <View style={styles.horarioInfo}>
                    <Clock size={16} color="#f59e0b" />
                    <Text style={styles.horarioHora}>
                      {horario.hora}:00 - {horario.hora + 1}:00
                    </Text>
                  </View>
                  <View style={styles.horarioStats}>
                    <Text style={styles.horarioPedidos}>
                      {horario.cantidad_pedidos} pedidos
                    </Text>
                    <Text style={styles.horarioMonto}>
                      {formatMoney(horario.total_ventas)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Top Meseros */}
        {datos.meserosTop.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Mejores Meseros</Text>
              <TouchableOpacity>
                <Text style={styles.verTodo}>Ver ranking</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.meserosList}>
              {datos.meserosTop.slice(0, 3).map((mesero, index) => (
                <View key={index} style={styles.meseroCard}>
                  <View style={styles.meseroHeader}>
                    <View style={styles.meseroRank}>
                      <Award size={16} color={index === 0 ? '#f59e0b' : '#6b7280'} />
                      <Text style={styles.rankText}>{index + 1}</Text>
                    </View>
                    <View style={styles.meseroInfo}>
                      <Text style={styles.meseroNombre}>
                        {mesero.nombre_mesero || `Mesero ${index + 1}`}
                      </Text>
                      <Text style={styles.meseroPedidos}>
                        {mesero.total_pedidos || 0} pedidos
                      </Text>
                    </View>
                  </View>
                  <View style={styles.meseroStats}>
                    <Text style={styles.meseroVentas}>
                      {formatMoney(mesero.total_ventas)}
                    </Text>
                    <Text style={styles.meseroPromedio}>
                      Prom: {formatMoney(mesero.promedio_venta)}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Acciones */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionButton}>
            <BarChart size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Ver Gráficos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
            <PieChart size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Reporte Detallado</Text>
          </TouchableOpacity>
        </View>

        {/* Información del reporte */}
        <View style={styles.infoFooter}>
          <Text style={styles.infoText}>
            Reporte generado: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          <Text style={styles.infoNote}>
            Datos del {periodo === 'hoy' ? 'día' : periodo === 'semana' ? 'semana' : 'mes'} actual
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  periodoSelector: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  periodoBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
    marginHorizontal: 4,
  },
  periodoBtnActive: {
    backgroundColor: '#dc2626',
  },
  periodoBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  periodoBtnTextActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verTodo: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: (width - 44) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  cardValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  metodosList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  metodoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  metodoItemLast: {
    borderBottomWidth: 0,
  },
  metodoInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metodoNombre: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  metodoStats: {
    alignItems: 'flex-end',
  },
  metodoPorcentaje: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  metodoMonto: {
    fontSize: 12,
    color: '#6b7280',
  },
  productosSection: {
    marginBottom: 16,
  },
  productosHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  productosTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 8,
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  listIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  listText: {
    flex: 1,
  },
  listTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  listSubtitle: {
    fontSize: 12,
    color: '#6b7280',
  },
  mesasList: {
    gap: 8,
  },
  horariosList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  horarioItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  horarioInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  horarioHora: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  horarioStats: {
    alignItems: 'flex-end',
  },
  horarioPedidos: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  horarioMonto: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#f59e0b',
  },
  meserosList: {
    gap: 12,
  },
  meseroCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  meseroHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  meseroRank: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6b7280',
  },
  meseroInfo: {
    flex: 1,
  },
  meseroNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  meseroPedidos: {
    fontSize: 12,
    color: '#6b7280',
  },
  meseroStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
    paddingTop: 12,
  },
  meseroVentas: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  meseroPromedio: {
    fontSize: 12,
    color: '#6b7280',
  },
  actionsSection: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    borderRadius: 8,
  },
  secondaryButton: {
    backgroundColor: '#3b82f6',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  infoFooter: {
    paddingHorizontal: 16,
    paddingBottom: 24,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4
  },
  infoNote: {
    fontSize: 11,
    color: '#9ca3af',
    fontStyle: 'italic',
  },
});

export default ReportesScreen;