import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    RefreshControl,
    ActivityIndicator
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
    Search,
    DollarSign,
    CheckCircle,
    User,
    ChefHat,
    Receipt,
    QrCode,
    AlertCircle
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { usePedidoDetallePorPagar } from '@/hooks/pedido/usePedidoDetallePorPagar';

// Tipos
type FilterEstado = 'todos' | 'preparado' | 'entregado';

interface Pago {
    pagado: boolean;
    fecha_pago?: string;
}

interface Mesa {
    nombre_mesa: string;
}

interface Mesero {
    nombre_completo: string;
}

interface Cliente {
    nombre_completo: string;
}

interface Menu {
    nombre_plato: string;
}

interface Bebida {
    nombre_bebida: string;
}

interface ItemPedido {
    cantidad: number;
    menu?: Menu;
    bebida?: Bebida;
}

interface Pedido {
    id_pedido: number;
    numero_pedido: string;
    nombre_cliente?: string;
    cliente?: Cliente;
    mesa: Mesa;
    mesero?: Mesero;
    estado: string;
    total: number;
    pago?: Pago;
    items: ItemPedido[];
}

const CajeroDashboard = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();

    const { data: pedidos = [], isLoading, error, refetch } = usePedidoDetallePorPagar();


    const [searchQuery, setSearchQuery] = useState<string>('');
    const [refreshing, setRefreshing] = useState<boolean>(false);
    const [filterEstado, setFilterEstado] = useState<FilterEstado>('todos');

    // Filtrar pedidos
    const pedidosFiltrados = React.useMemo(() => {
        if (!Array.isArray(pedidos)) return [];

        let filtered: Pedido[] = pedidos;

        if (searchQuery.trim() !== '') {
            filtered = filtered.filter((pedido) =>
                pedido.numero_pedido.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pedido.nombre_cliente?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pedido.cliente?.nombre_completo?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pedido.mesa.nombre_mesa.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (filterEstado !== 'todos') {
            filtered = filtered.filter((pedido) => pedido.estado === filterEstado);
        }

        return filtered.filter(
            (pedido) => !pedido.pago || !pedido.pago.pagado
        );
    }, [pedidos, searchQuery, filterEstado]);


    const handleRefresh = async (): Promise<void> => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const handleProcesarPago = (pedido: Pedido): void => {
        navigation.navigate('ProcesarPagoScreen', { pedido });
    };

    const handleVerDetalle = (pedido: Pedido): void => {
        navigation.navigate('DetallePedidoScreen', { pedido });
    };

    const getEstadoColor = (estado: string): string => {
        switch (estado) {
            case 'preparado': return '#10b981';
            case 'entregado': return '#3b82f6';
            case 'en_preparacion': return '#f59e0b';
            case 'pendiente': return '#6b7280';
            case 'cancelado': return '#ef4444';
            default: return '#6b7280';
        }
    };

    const getEstadoText = (estado: string): string => {
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
                    <Text style={styles.clienteNombre}>
                        {pedido.nombre_cliente || pedido.cliente?.nombre_completo || 'Cliente no registrado'}
                    </Text>
                    <View style={styles.metaInfo}>
                        <View style={styles.metaItem}>
                            <ChefHat color="#6b7280" size={14} />
                            <Text style={styles.metaText}>{pedido.mesa.nombre_mesa}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <User color="#6b7280" size={14} />
                            <Text style={styles.metaText}>{pedido.mesero?.nombre_completo ?? 'Sin mesero'}</Text>
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

            {/* Items del pedido (vista resumida) */}
            <View style={styles.itemsResumen}>
                {pedido.items.slice(0, 2).map((item: ItemPedido, index: number) => (
                    <Text key={index} style={styles.itemText} numberOfLines={1}>
                        {item.cantidad}x {item.menu?.nombre_plato || item.bebida?.nombre_bebida}
                    </Text>
                ))}
                {pedido.items.length > 2 && (
                    <Text style={styles.masItemsText}>
                        +{pedido.items.length - 2} más...
                    </Text>
                )}
            </View>

            <View style={styles.pedidoActions}>
                <TouchableOpacity
                    style={styles.detalleButton}
                    onPress={() => handleVerDetalle(pedido)}
                >
                    <Receipt color="#6b7280" size={16} />
                    <Text style={styles.detalleButtonText}>Ver Detalle</Text>
                </TouchableOpacity>

                {(!pedido.pago || !pedido.pago.pagado) && pedido.estado === 'preparado' && (
                    <TouchableOpacity
                        style={styles.pagarButton}
                        onPress={() => handleProcesarPago(pedido)}
                    >
                        <DollarSign color="#fff" size={16} />
                        <Text style={styles.pagarButtonText}>Cobrar</Text>
                    </TouchableOpacity>
                )}

                {pedido.pago?.pagado && (
                    <View style={styles.pagadoBadge}>
                        <CheckCircle color="#10b981" size={16} />
                        <Text style={styles.pagadoText}>Pagado</Text>
                    </View>
                )}
            </View>
        </View>
    );

    // Calcular estadísticas
    const pedidosPorCobrar = pedidos.filter((p: Pedido) => (!p.pago || !p.pago.pagado) && p.estado === 'preparado');
    const totalPendiente = pedidos.filter((p: Pedido) => !p.pago || !p.pago.pagado).reduce((sum: number, p: Pedido) => sum + Number(p.total), 0);
    const pedidosPagadosHoy = pedidos.filter((p: Pedido) => p.pago?.pagado &&
        p.pago.fecha_pago &&
        new Date(p.pago.fecha_pago).toDateString() === new Date().toDateString()
    );

    if (isLoading) {
        return (
            <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
                <ActivityIndicator size="large" color="#dc2626" />
                <Text style={styles.loadingText}>Cargando pedidos...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.centered, { paddingTop: insets.top }]}>
                <AlertCircle color="#dc2626" size={48} />
                <Text style={styles.errorText}>Error al cargar los pedidos</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

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
                        {(['todos', 'preparado', 'entregado'] as FilterEstado[]).map((filtro) => (
                            <TouchableOpacity
                                key={filtro}
                                style={[
                                    styles.filterButton,
                                    filterEstado === filtro && styles.filterButtonActive
                                ]}
                                onPress={() => setFilterEstado(filtro)}
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
                            <Text style={styles.emptyStateTitle}>
                                {searchQuery || filterEstado !== 'todos' ? 'No hay pedidos con los filtros aplicados' : 'No hay pedidos pendientes de pago'}
                            </Text>
                            <Text style={styles.emptyStateText}>
                                {searchQuery ? 'Intenta con otros términos de búsqueda' : 'Todos los pedidos han sido pagados'}
                            </Text>
                        </View>
                    ) : (
                        pedidosFiltrados.map((pedido: Pedido) => (
                            <PedidoCard key={pedido.id_pedido} pedido={pedido} />
                        ))
                    )}
                </View>
            </ScrollView>

            {/* Estadísticas rápidas */}
            <View style={styles.statsBar}>
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{pedidosPorCobrar.length}</Text>
                    <Text style={styles.statLabel}>Por Cobrar</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>S/. {totalPendiente.toFixed(2)}</Text>
                    <Text style={styles.statLabel}>Total Pendiente</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{pedidosPagadosHoy.length}</Text>
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
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#6b7280',
    },
    errorText: {
        marginTop: 16,
        fontSize: 16,
        color: '#dc2626',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#dc2626',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontWeight: '600',
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
    itemsResumen: {
        marginBottom: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
    },
    itemText: {
        fontSize: 12,
        color: '#6b7280',
        marginBottom: 4,
    },
    masItemsText: {
        fontSize: 11,
        color: '#9ca3af',
        fontStyle: 'italic',
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
        textAlign: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#9ca3af',
        textAlign: 'center',
    },
});

export default CajeroDashboard;