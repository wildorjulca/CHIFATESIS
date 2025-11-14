import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Search,
    DollarSign,
    CheckCircle,
    User,
    ChefHat,
    Receipt,
    QrCode
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

// Tipos (los mismos que antes)
type EstadoPedido = 'pendiente' | 'en_preparacion' | 'preparado' | 'entregado' | 'cancelado';
type MetodoPago = 'efectivo' | 'yape' | 'plin' | 'tarjeta' | 'transferencia';

interface Pedido {
    id_pedido: number;
    numero_pedido: string;
    id_cliente: number | null;
    id_mesa: number;
    id_mesero: number;
    nombre_cliente: string;
    estado: EstadoPedido;
    total: number;
    observaciones: string | null;
    fecha_pedido: string;
    fecha_entrega: string | null;
    mesa: {
        id_mesa: number;
        nombre_mesa: string;
        capacidad: number;
    };
    mesero: {
        id_rol: number;
        nombre_completo: string;
        nombre_rol: string;
    };
    items: ItemPedido[];
    pago: Pago | null;
}

interface ItemPedido {
    id_item_pedido: number;
    id_menu: number | null;
    id_bebida: number | null;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    observaciones: string | null;
    menu: {
        id_menu: number;
        nombre_plato: string;
        categoria: string;
    } | null;
    bebida: {
        id_bebida: number;
        nombre_bebida: string;
        categoria: string;
    } | null;
}

interface Pago {
    id_pago: number;
    id_pedido: number;
    id_cajero: number;
    metodo_pago: MetodoPago;
    monto: number;
    monto_recibido: number | null;
    cambio: number | null;
    comprobante: string | null;
    pagado: boolean;
    fecha_pago: string;
}

// Datos ficticios
const PEDIDOS_MOCK: Pedido[] = [
    {
        id_pedido: 1,
        numero_pedido: 'PED-001',
        id_cliente: 1,
        id_mesa: 1,
        id_mesero: 2,
        nombre_cliente: 'Juan Pérez',
        estado: 'preparado',
        total: 85.50,
        observaciones: 'Sin cebolla en la hamburguesa',
        fecha_pedido: '2024-01-15T14:30:00Z',
        fecha_entrega: null,
        mesa: {
            id_mesa: 1,
            nombre_mesa: 'Mesa 1',
            capacidad: 4
        },
        mesero: {
            id_rol: 2,
            nombre_completo: 'María García',
            nombre_rol: 'mesero'
        },
        pago: null,
        items: [
            {
                id_item_pedido: 1,
                id_menu: 1,
                id_bebida: null,
                cantidad: 2,
                precio_unitario: 25.00,
                subtotal: 50.00,
                observaciones: 'Bien cocido',
                menu: {
                    id_menu: 1,
                    nombre_plato: 'Lomo Saltado',
                    categoria: 'Plato de Fondo'
                },
                bebida: null
            },
            {
                id_item_pedido: 2,
                id_menu: null,
                id_bebida: 1,
                cantidad: 1,
                precio_unitario: 8.50,
                subtotal: 8.50,
                observaciones: null,
                menu: null,
                bebida: {
                    id_bebida: 1,
                    nombre_bebida: 'Inca Kola 1L',
                    categoria: 'Gaseosa'
                }
            }
        ]
    },
    {
        id_pedido: 2,
        numero_pedido: 'PED-002',
        id_cliente: null,
        id_mesa: 3,
        id_mesero: 3,
        nombre_cliente: 'Carlos López',
        estado: 'entregado',
        total: 42.00,
        observaciones: null,
        fecha_pedido: '2024-01-15T15:00:00Z',
        fecha_entrega: '2024-01-15T15:45:00Z',
        mesa: {
            id_mesa: 3,
            nombre_mesa: 'Mesa 3',
            capacidad: 6
        },
        mesero: {
            id_rol: 3,
            nombre_completo: 'Pedro Martínez',
            nombre_rol: 'mesero'
        },
        pago: {
            id_pago: 1,
            id_pedido: 2,
            id_cajero: 1,
            metodo_pago: 'efectivo',
            monto: 42.00,
            monto_recibido: 50.00,
            cambio: 8.00,
            comprobante: 'B001-0001',
            pagado: true,
            fecha_pago: '2024-01-15T15:50:00Z'
        },
        items: [
            {
                id_item_pedido: 4,
                id_menu: 2,
                id_bebida: null,
                cantidad: 1,
                precio_unitario: 32.00,
                subtotal: 32.00,
                observaciones: 'Poco picante',
                menu: {
                    id_menu: 2,
                    nombre_plato: 'Arroz con Pollo',
                    categoria: 'Plato de Fondo'
                },
                bebida: null
            }
        ]
    }
];

const CajeroDashboard = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const [pedidos, setPedidos] = useState<Pedido[]>(PEDIDOS_MOCK);
    const [pedidosFiltrados, setPedidosFiltrados] = useState<Pedido[]>(PEDIDOS_MOCK);
    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [filterEstado, setFilterEstado] = useState<'todos' | 'preparado' | 'entregado'>('todos');

    // Filtrar pedidos
    useEffect(() => {
        let filtered = pedidos;

        if (searchQuery) {
            filtered = filtered.filter(pedido =>
                pedido.numero_pedido.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pedido.nombre_cliente.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pedido.mesa.nombre_mesa.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterEstado !== 'todos') {
            filtered = filtered.filter(pedido => pedido.estado === filterEstado);
        }

        filtered = filtered.filter(pedido =>
            !pedido.pago ||
            (pedido.pago && new Date(pedido.pago.fecha_pago).getTime() > Date.now() - 2 * 60 * 60 * 1000)
        );

        setPedidosFiltrados(filtered);
    }, [searchQuery, pedidos, filterEstado]);

    const handleRefresh = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 1500);
    };

    const handleProcesarPago = (pedido: Pedido) => {
        // Navegar a la pantalla de procesar pago
        navigation.navigate('ProcesarPagoScreen', { pedido });
    };

    const handleVerDetalle = (pedido: Pedido) => {
        // Navegar a la pantalla de detalle
        navigation.navigate('DetallePedidoScreen', { pedido });
    };

    const getEstadoColor = (estado: EstadoPedido) => {
        switch (estado) {
            case 'preparado': return '#10b981';
            case 'entregado': return '#3b82f6';
            case 'en_preparacion': return '#f59e0b';
            case 'pendiente': return '#6b7280';
            case 'cancelado': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getEstadoText = (estado: EstadoPedido) => {
        switch (estado) {
            case 'preparado': return 'Listo para Pagar';
            case 'entregado': return 'Entregado';
            case 'en_preparacion': return 'En Cocina';
            case 'pendiente': return 'Pendiente';
            case 'cancelado': return 'Cancelado';
            default: return estado;
        }
    };

    // Componente de Card de Pedido
    const PedidoCard = ({ pedido }: { pedido: Pedido }) => (
        <View style={styles.pedidoCard}>
            <View style={styles.pedidoHeader}>
                <View style={styles.pedidoInfo}>
                    <Text style={styles.pedidoNumero}>{pedido.numero_pedido}</Text>
                    <Text style={styles.clienteNombre}>{pedido.nombre_cliente}</Text>
                    <View style={styles.metaInfo}>
                        <View style={styles.metaItem}>
                            <ChefHat color="#6b7280" size={14} />
                            <Text style={styles.metaText}>{pedido.mesa.nombre_mesa}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <User color="#6b7280" size={14} />
                            <Text style={styles.metaText}>{pedido.mesero.nombre_completo}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.pedidoStatus}>
                    <View
                        style={[
                            styles.estadoBadge,
                            { backgroundColor: getEstadoColor(pedido.estado) }
                        ]}
                    >
                        <Text style={styles.estadoText}>{getEstadoText(pedido.estado)}</Text>
                    </View>
                    <Text style={styles.pedidoTotal}>S/. {pedido.total.toFixed(2)}</Text>
                </View>
            </View>

            <View style={styles.pedidoActions}>
                <TouchableOpacity
                    style={styles.detalleButton}
                    onPress={() => handleVerDetalle(pedido)}
                >
                    <Receipt color="#6b7280" size={16} />
                    <Text style={styles.detalleButtonText}>Ver Detalle</Text>
                </TouchableOpacity>

                {!pedido.pago && pedido.estado === 'preparado' && (
                    <TouchableOpacity
                        style={styles.pagarButton}
                        onPress={() => handleProcesarPago(pedido)}
                    >
                        <DollarSign color="#fff" size={16} />
                        <Text style={styles.pagarButtonText}>Cobrar</Text>
                    </TouchableOpacity>
                )}

                {pedido.pago && (
                    <View style={styles.pagadoBadge}>
                        <CheckCircle color="#10b981" size={16} />
                        <Text style={styles.pagadoText}>Pagado</Text>
                    </View>
                )}
            </View>
        </View>
    );

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <Text style={styles.title}>Caja Restaurante</Text>
                    <TouchableOpacity style={styles.qrButton}>
                        <QrCode color="#dc2626" size={24} />
                    </TouchableOpacity>
                </View>

                {/* Barra de búsqueda */}
                <View style={styles.searchContainer}>
                    <Search color="#6b7280" size={20} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar por número de pedido, cliente o mesa..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                {/* Filtros */}
                <View style={styles.filtersContainer}>
                    <Text style={styles.filtersLabel}>Filtrar por:</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
                        {['todos', 'preparado', 'entregado'].map((filtro) => (
                            <TouchableOpacity
                                key={filtro}
                                style={[
                                    styles.filterButton,
                                    filterEstado === filtro && styles.filterButtonActive
                                ]}
                                onPress={() => setFilterEstado(filtro as any)}
                            >
                                <Text style={[
                                    styles.filterButtonText,
                                    filterEstado === filtro && styles.filterButtonTextActive
                                ]}>
                                    {filtro === 'todos' ? 'Todos' :
                                        filtro === 'preparado' ? 'Listos para Pagar' : 'Entregados'}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </View>

            {/* Lista de Pedidos */}
            <ScrollView
                style={styles.pedidosList}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#dc2626']}
                    />
                }
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.pedidosContainer}>
                    {pedidosFiltrados.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Receipt color="#d1d5db" size={64} />
                            <Text style={styles.emptyStateTitle}>No hay pedidos</Text>
                            <Text style={styles.emptyStateText}>
                                {searchQuery ? 'No se encontraron pedidos con esa búsqueda' : 'No hay pedidos pendientes de pago'}
                            </Text>
                        </View>
                    ) : (
                        pedidosFiltrados.map((pedido) => (
                            <PedidoCard key={pedido.id_pedido} pedido={pedido} />
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Estadísticas rápidas */}
            <View style={styles.statsBar}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {pedidos.filter(p => !p.pago && p.estado === 'preparado').length}
                    </Text>
                    <Text style={styles.statLabel}>Por Cobrar</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        S/. {pedidos.filter(p => !p.pago).reduce((sum, p) => sum + p.total, 0).toFixed(2)}
                    </Text>
                    <Text style={styles.statLabel}>Total Pendiente</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>
                        {pedidos.filter(p => p.pago).length}
                    </Text>
                    <Text style={styles.statLabel}>Pagados Hoy</Text>
                </View>
            </View>
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
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    qrButton: {
        padding: 8,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginBottom: 16,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#1f2937',
    },
    filtersContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    filtersLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
        marginRight: 12,
    },
    filtersScroll: {
        flex: 1,
    },
    filterButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: '#f3f4f6',
        marginRight: 8,
    },
    filterButtonActive: {
        backgroundColor: '#dc2626',
    },
    filterButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#6b7280',
    },
    filterButtonTextActive: {
        color: '#fff',
    },
    pedidosList: {
        flex: 1,
    },
    pedidosContainer: {
        padding: 16,
    },
    pedidoCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    pedidoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    pedidoInfo: {
        flex: 1,
    },
    pedidoNumero: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    clienteNombre: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 8,
    },
    metaInfo: {
        flexDirection: 'row',
        gap: 12,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: 12,
        color: '#6b7280',
    },
    pedidoStatus: {
        alignItems: 'flex-end',
    },
    estadoBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    estadoText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    pedidoTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#dc2626',
    },
    pedidoActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    detalleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#d1d5db',
    },
    detalleButtonText: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '600',
    },
    pagarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#dc2626',
    },
    pagarButtonText: {
        fontSize: 14,
        color: '#fff',
        fontWeight: '600',
    },
    pagadoBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
        backgroundColor: '#d1fae5',
    },
    pagadoText: {
        fontSize: 14,
        color: '#065f46',
        fontWeight: '600',
    },
    statsBar: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
    },
    statDivider: {
        width: 1,
        backgroundColor: '#e5e7eb',
        marginHorizontal: 8,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyStateTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6b7280',
        marginTop: 16,
        marginBottom: 8,
    },
    emptyStateText: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
    },
});

export default CajeroDashboard;