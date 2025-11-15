import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Clock, CheckCircle, AlertCircle, ChefHat, Filter, RotateCcw, Utensils, Users, Timer } from 'lucide-react-native';

// Simulación de datos basada en tu schema Prisma
const mockPedidosCocina = [
  {
    id_pedido: 1,
    numero_pedido: 'PED-001',
    nombre_cliente: 'Juan Pérez García',
    mesa: 'Mesa 1',
    items: [
      { 
        id_item_pedido: 1,
        nombre: 'Aeropuerto Especial', 
        cantidad: 2, 
        tiempo_preparacion: 20, 
        estado: 'en_preparacion',
        observaciones: 'Sin ají'
      },
      { 
        id_item_pedido: 2,
        nombre: 'Inca Kola 500ml', 
        cantidad: 2, 
        tiempo_preparacion: 2, 
        estado: 'preparado'
      }
    ],
    estado: 'en_preparacion',
    fecha_pedido: new Date('2024-01-15 12:30:00'),
    observaciones: 'Sin ají por favor'
  },
  {
    id_pedido: 2,
    numero_pedido: 'PED-002',
    nombre_cliente: 'María López Soto',
    mesa: 'Mesa 3',
    items: [
      { 
        id_item_pedido: 3,
        nombre: 'Tallarín Saltado Especial', 
        cantidad: 1, 
        tiempo_preparacion: 15, 
        estado: 'preparado'
      }
    ],
    estado: 'preparado',
    fecha_pedido: new Date('2024-01-15 13:15:00'),
    observaciones: null
  },
  {
    id_pedido: 3,
    numero_pedido: 'PED-003',
    nombre_cliente: 'Carlos Rodríguez',
    mesa: 'Mesa 2',
    items: [
      { 
        id_item_pedido: 4,
        nombre: 'Arroz Chaufa de Pollo', 
        cantidad: 3, 
        tiempo_preparacion: 12, 
        estado: 'pendiente'
      },
      { 
        id_item_pedido: 5,
        nombre: 'Chicha Morada 1L', 
        cantidad: 1, 
        tiempo_preparacion: 2, 
        estado: 'pendiente'
      }
    ],
    estado: 'pendiente',
    fecha_pedido: new Date('2024-01-15 14:00:00'),
    observaciones: null
  },
  {
    id_pedido: 4,
    numero_pedido: 'PED-004',
    nombre_cliente: 'Cliente Ocasional',
    mesa: 'Mesa 4',
    items: [
      { 
        id_item_pedido: 6,
        nombre: 'Wantán Frito (8 unidades)', 
        cantidad: 1, 
        tiempo_preparacion: 10, 
        estado: 'pendiente'
      }
    ],
    estado: 'pendiente',
    fecha_pedido: new Date('2024-01-15 14:30:00'),
    observaciones: null
  }
];

const GestionCocinaScreen = () => {
  const router = useRouter();
  const [pedidos, setPedidos] = useState(mockPedidosCocina);
  const [filtroEstado, setFiltroEstado] = useState<'todos' | 'pendiente' | 'en_preparacion' | 'preparado'>('todos');
  const [refreshing, setRefreshing] = useState(false);
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState(0);

  // Simular actualización en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      setTiempoTranscurrido(prev => prev + 1);
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simular fetch de datos
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const filtrarPedidos = () => {
    if (filtroEstado === 'todos') return pedidos;
    return pedidos.filter(pedido => pedido.estado === filtroEstado);
  };

  const cambiarEstadoItem = (pedidoId: number, itemId: number, nuevoEstado: string) => {
    setPedidos(prev => prev.map(pedido => {
      if (pedido.id_pedido === pedidoId) {
        const itemsActualizados = pedido.items.map(item => 
          item.id_item_pedido === itemId ? { ...item, estado: nuevoEstado } : item
        );
        
        // Actualizar estado general del pedido
        const todosPreparados = itemsActualizados.every(item => item.estado === 'preparado');
        const algunoEnPreparacion = itemsActualizados.some(item => item.estado === 'en_preparacion');
        
        let estadoGeneral = pedido.estado;
        if (todosPreparados) {
          estadoGeneral = 'preparado';
        } else if (algunoEnPreparacion) {
          estadoGeneral = 'en_preparacion';
        } else {
          estadoGeneral = 'pendiente';
        }

        return { ...pedido, items: itemsActualizados, estado: estadoGeneral };
      }
      return pedido;
    }));
  };

  const marcarPedidoEntregado = (pedidoId: number) => {
    setPedidos(prev => prev.filter(pedido => pedido.id_pedido !== pedidoId));
  };

  const calcularTiempoEspera = (fechaPedido: Date) => {
    const diffMs = new Date().getTime() - fechaPedido.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    return diffMins;
  };

  const getColorEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente': return '#f59e0b';
      case 'en_preparacion': return '#3b82f6';
      case 'preparado': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getIconoEstado = (estado: string) => {
    switch (estado) {
      case 'pendiente': return AlertCircle;
      case 'en_preparacion': return Clock;
      case 'preparado': return CheckCircle;
      default: return AlertCircle;
    }
  };

  const getEstadisticas = () => {
    return {
      total: pedidos.length,
      pendientes: pedidos.filter(p => p.estado === 'pendiente').length,
      en_preparacion: pedidos.filter(p => p.estado === 'en_preparacion').length,
      preparados: pedidos.filter(p => p.estado === 'preparado').length,
    };
  };

  const pedidosFiltrados = filtrarPedidos();
  const stats = getEstadisticas();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTitle}>
          <ChefHat size={28} color="#e63946" />
          <Text style={styles.headerText}>Gestión de Cocina</Text>
        </View>
        <Text style={styles.subHeader}>Control de pedidos en tiempo real</Text>
      </View>

      {/* Estadísticas */}
      <View style={styles.statsWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#fef3c7' }]}>
              <AlertCircle size={20} color="#f59e0b" strokeWidth={2.5} />
            </View>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#fee2e2' }]}>
              <AlertCircle size={20} color="#ef4444" strokeWidth={2.5} />
            </View>
            <Text style={styles.statNumber}>{stats.pendientes}</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#dbeafe' }]}>
              <Clock size={20} color="#3b82f6" strokeWidth={2.5} />
            </View>
            <Text style={styles.statNumber}>{stats.en_preparacion}</Text>
            <Text style={styles.statLabel}>En Cocina</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIconBox, { backgroundColor: '#d1fae5' }]}>
              <CheckCircle size={20} color="#10b981" strokeWidth={2.5} />
            </View>
            <Text style={styles.statNumber}>{stats.preparados}</Text>
            <Text style={styles.statLabel}>Listos</Text>
          </View>
        </ScrollView>
      </View>

      {/* Filtros */}
      <View style={styles.filtrosWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtrosContainer}>
          <TouchableOpacity
            style={[styles.filtroBtn, filtroEstado === 'todos' && styles.filtroBtnActiveTodos]}
            onPress={() => setFiltroEstado('todos')}
          >
            <Text style={[styles.filtroText, filtroEstado === 'todos' && styles.filtroTextActive]}>
              Todos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filtroBtn,
              filtroEstado === 'pendiente' && styles.filtroBtnActive,
              filtroEstado === 'pendiente' && { backgroundColor: '#f59e0b', borderColor: '#f59e0b' }
            ]}
            onPress={() => setFiltroEstado('pendiente')}
          >
            <AlertCircle size={16} color={filtroEstado === 'pendiente' ? '#fff' : '#f59e0b'} strokeWidth={2.5} />
            <Text style={[styles.filtroText, filtroEstado === 'pendiente' && styles.filtroTextActive]}>
              Pendientes
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filtroBtn,
              filtroEstado === 'en_preparacion' && styles.filtroBtnActive,
              filtroEstado === 'en_preparacion' && { backgroundColor: '#3b82f6', borderColor: '#3b82f6' }
            ]}
            onPress={() => setFiltroEstado('en_preparacion')}
          >
            <Clock size={16} color={filtroEstado === 'en_preparacion' ? '#fff' : '#3b82f6'} strokeWidth={2.5} />
            <Text style={[styles.filtroText, filtroEstado === 'en_preparacion' && styles.filtroTextActive]}>
              En Cocina
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filtroBtn,
              filtroEstado === 'preparado' && styles.filtroBtnActive,
              filtroEstado === 'preparado' && { backgroundColor: '#10b981', borderColor: '#10b981' }
            ]}
            onPress={() => setFiltroEstado('preparado')}
          >
            <CheckCircle size={16} color={filtroEstado === 'preparado' ? '#fff' : '#10b981'} strokeWidth={2.5} />
            <Text style={[styles.filtroText, filtroEstado === 'preparado' && styles.filtroTextActive]}>
              Listos
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Lista de Pedidos */}
      <ScrollView 
        style={styles.pedidosContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {pedidosFiltrados.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Utensils size={64} color="#d1d5db" strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyText}>No hay pedidos {filtroEstado !== 'todos' ? `en estado ${filtroEstado}` : 'pendientes'}</Text>
            <Text style={styles.emptySubText}>
              Los nuevos pedidos aparecerán aquí automáticamente
            </Text>
          </View>
        ) : (
          pedidosFiltrados.map(pedido => {
            const IconoEstado = getIconoEstado(pedido.estado);
            const colorEstado = getColorEstado(pedido.estado);
            const tiempoEspera = calcularTiempoEspera(pedido.fecha_pedido);

            return (
              <View key={pedido.id_pedido} style={styles.pedidoCard}>
                <View style={[styles.estadoIndicator, { backgroundColor: colorEstado }]} />

                <View style={styles.cardContent}>
                  {/* Header del Pedido */}
                  <View style={styles.pedidoHeader}>
                    <View style={styles.pedidoInfo}>
                      <View style={styles.pedidoNumeroContainer}>
                        <Text style={styles.pedidoNumero}>{pedido.numero_pedido}</Text>
                        <View style={[styles.estadoBadge, { backgroundColor: colorEstado }]}>
                          <IconoEstado size={12} color="#fff" strokeWidth={2.5} />
                          <Text style={styles.estadoBadgeText}>
                            {pedido.estado.replace('_', ' ').toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.pedidoClienteInfo}>
                        <View style={styles.clienteIcon}>
                          <Users size={14} color="#6b7280" strokeWidth={2} />
                        </View>
                        <Text style={styles.pedidoCliente}>{pedido.nombre_cliente}</Text>
                        <Text style={styles.pedidoMesa}>• {pedido.mesa}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Tiempo y Observaciones */}
                  <View style={styles.pedidoMeta}>
                    <View style={styles.tiempoContainer}>
                      <View style={styles.tiempoIcon}>
                        <Timer size={14} color="#6b7280" strokeWidth={2} />
                      </View>
                      <Text style={styles.tiempoText}>
                        Hace {tiempoEspera} min • {pedido.fecha_pedido.toLocaleTimeString('es-ES', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </Text>
                    </View>

                    {pedido.observaciones && (
                      <View style={styles.observacionesContainer}>
                        <View style={styles.observacionesIcon}>
                          <AlertCircle size={14} color="#f59e0b" strokeWidth={2} />
                        </View>
                        <Text style={styles.observacionesText}>{pedido.observaciones}</Text>
                      </View>
                    )}
                  </View>

                  {/* Items del Pedido */}
                  <View style={styles.itemsContainer}>
                    {pedido.items.map((item, index) => (
                      <View key={item.id_item_pedido} style={styles.itemRow}>
                        <View style={styles.itemInfo}>
                          <View style={styles.itemCantidadContainer}>
                            <Text style={styles.itemCantidad}>x{item.cantidad}</Text>
                          </View>
                          <View style={styles.itemDetails}>
                            <Text style={styles.itemNombre}>{item.nombre}</Text>
                            <View style={styles.itemMeta}>
                              <Text style={styles.itemTiempo}>~{item.tiempo_preparacion}min</Text>
                              {item.observaciones && (
                                <Text style={styles.itemObservaciones}>• {item.observaciones}</Text>
                              )}
                            </View>
                          </View>
                        </View>
                        
                        <View style={styles.itemActions}>
                          <View style={[
                            styles.itemEstadoBadge,
                            { backgroundColor: `${getColorEstado(item.estado)}20` }
                          ]}>
                            <Text style={[styles.itemEstadoText, { color: getColorEstado(item.estado) }]}>
                              {item.estado.replace('_', ' ')}
                            </Text>
                          </View>
                          
                          {item.estado === 'pendiente' && (
                            <TouchableOpacity 
                              style={[styles.estadoBtn, { backgroundColor: '#3b82f6' }]}
                              onPress={() => cambiarEstadoItem(pedido.id_pedido, item.id_item_pedido, 'en_preparacion')}
                            >
                              <Text style={styles.estadoBtnText}>Comenzar</Text>
                            </TouchableOpacity>
                          )}
                          
                          {item.estado === 'en_preparacion' && (
                            <TouchableOpacity 
                              style={[styles.estadoBtn, { backgroundColor: '#10b981' }]}
                              onPress={() => cambiarEstadoItem(pedido.id_pedido, item.id_item_pedido, 'preparado')}
                            >
                              <Text style={styles.estadoBtnText}>Listo</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>

                  {/* Acción de entrega */}
                  {pedido.estado === 'preparado' && (
                    <TouchableOpacity 
                      style={styles.entregarBtn}
                      onPress={() => marcarPedidoEntregado(pedido.id_pedido)}
                    >
                      <CheckCircle size={20} color="#fff" strokeWidth={2.5} />
                      <Text style={styles.entregarBtnText}>Marcar como Entregado</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#343a40',
  },
  subHeader: {
    fontSize: 14,
    color: '#6c757d',
  },
  statsWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  statsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    minWidth: 100,
    gap: 8,
  },
  statIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  filtrosWrapper: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  filtrosContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filtroBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#f9fafb',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filtroBtnActiveTodos: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  filtroBtnActive: {
    borderWidth: 2,
  },
  filtroText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6b7280',
  },
  filtroTextActive: {
    color: '#fff',
  },
  pedidosContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  pedidoCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  estadoIndicator: {
    height: 4,
    width: '100%',
  },
  cardContent: {
    padding: 16,
  },
  pedidoHeader: {
    marginBottom: 12,
  },
  pedidoInfo: {
    gap: 8,
  },
  pedidoNumeroContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pedidoNumero: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    letterSpacing: -0.5,
  },
  estadoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  estadoBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: 0.5,
  },
  pedidoClienteInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  clienteIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pedidoCliente: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  pedidoMesa: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  pedidoMeta: {
    gap: 8,
    marginBottom: 16,
  },
  tiempoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tiempoIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: '#f9fafb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tiempoText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#6b7280',
  },
  observacionesContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#f59e0b',
  },
  observacionesIcon: {
    marginTop: 1,
  },
  observacionesText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    color: '#92400e',
    lineHeight: 18,
  },
  itemsContainer: {
    gap: 12,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  itemCantidadContainer: {
    backgroundColor: '#f3f4f6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  itemCantidad: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  itemDetails: {
    flex: 1,
    gap: 4,
  },
  itemNombre: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  itemTiempo: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    fontStyle: 'italic',
  },
  itemObservaciones: {
    fontSize: 12,
    fontWeight: '500',
    color: '#f59e0b',
  },
  itemActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  itemEstadoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  itemEstadoText: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  estadoBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  estadoBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  entregarBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#10b981',
    padding: 14,
    borderRadius: 12,
    shadowColor: '#10b981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  entregarBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  emptyState: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 20,
  },
});

export default GestionCocinaScreen;