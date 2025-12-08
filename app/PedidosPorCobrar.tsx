import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import {
    Search,
    DollarSign,
    CheckCircle,
    User,
    Table,
    AlertCircle,
    BanknoteArrowDown
} from 'lucide-react-native';
import { usePedidoDetallePorPagar } from '@/hooks/pedido/usePedidoDetallePorPagar';

// Interface simple
interface Pedido {
    id_pedido: number;
    numero_pedido: string;
    nombre_cliente: string;
    estado: string;
    total: number;
    total_calculado: number;
    mesa: {
        nombre_mesa: string;
    };
    mesero: {
        nombre_completo: string;
    };
    items: Array<{
        id_item_pedido: number;
        cantidad: number;
        producto: {
            nombre: string;
        };
    }>;
    pago: null | {
        pagado: boolean;
    };
}

const CajeroDashboard = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();

    // Usar tu hook
    const {
        data: pedidos = [],
        isLoading,
        error,
        refetch
    } = usePedidoDetallePorPagar();

    const [searchQuery, setSearchQuery] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    // Filtrar solo pedidos por pagar
    const pedidosPorPagar = pedidos.filter((pedido: Pedido) =>
        !pedido.pago || !pedido.pago.pagado
    );

    // Filtrar por búsqueda
    const pedidosFiltrados = pedidosPorPagar.filter((pedido: Pedido) => {
        if (!searchQuery.trim()) return true;

        const search = searchQuery.toLowerCase();
        return (
            pedido.numero_pedido.toLowerCase().includes(search) ||
            pedido.nombre_cliente.toLowerCase().includes(search) ||
            pedido.mesa.nombre_mesa.toLowerCase().includes(search)
        );
    });

    const handleRefresh = async () => {
        setRefreshing(true);
        await refetch();
        setRefreshing(false);
    };

    const handleCobrar = (pedido: Pedido) => {
        navigation.navigate('ProcesarPagoScreen', { pedido });
    };

    // Calcular total por cobrar
    const totalPorCobrar = pedidosPorPagar.reduce((sum, pedido) =>
        sum + pedido.total, 0
    );

    if (isLoading) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#dc2626" />
                    <Text style={styles.loadingText}>Cargando pedidos...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { paddingTop: insets.top }]}>
                <View style={styles.errorContainer}>
                    <AlertCircle color="#dc2626" size={48} />
                    <Text style={styles.errorText}>Error al cargar pedidos</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
                        <Text style={styles.retryButtonText}>Reintentar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerTitle}>
                    <BanknoteArrowDown size={28} color="#e63946" />
                    <Text style={styles.headerText}>Pedidos por Cobrar</Text>
                </View>
                <Text style={styles.subHeader}>Administrar pedidos y cobrar</Text>
            </View>

            <View>
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{pedidosPorPagar.length}</Text>
                        <Text style={styles.statLabel}>Pedidos</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={[styles.statNumber, styles.totalMoney]}>
                            S/. {totalPorCobrar.toFixed(2)}
                        </Text>
                        <Text style={styles.statLabel}>Por Cobrar</Text>
                    </View>
                </View>

                {/* Buscador */}
                <View style={styles.searchContainer}>
                    <Search color="#6b7280" size={20} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar pedido..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor="#9ca3af"
                    />
                </View>
            </View>

            {/* Lista de pedidos */}
            <ScrollView
                style={styles.content}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={handleRefresh}
                        colors={['#dc2626']}
                    />
                }
            >
                {pedidosFiltrados.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {searchQuery
                                ? "No se encontraron pedidos"
                                : "No hay pedidos por cobrar"
                            }
                        </Text>
                    </View>
                ) : (
                    <View style={styles.pedidosList}>
                        {pedidosFiltrados.map((pedido: Pedido) => (
                            <View key={pedido.id_pedido} style={styles.pedidoCard}>
                                {/* Encabezado del pedido */}
                                <View style={styles.pedidoHeader}>
                                    <View>
                                        <Text style={styles.pedidoNumero}>{pedido.numero_pedido}</Text>
                                        <View style={styles.clienteInfo}>
                                            <User size={14} color="#6b7280" />
                                            <Text style={styles.clienteNombre}>
                                                {pedido.nombre_cliente}
                                            </Text>
                                        </View>
                                        <View style={styles.mesaInfo}>
                                            <Table size={14} color="#6b7280" />
                                            <Text style={styles.mesaText}>{pedido.mesa.nombre_mesa}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.totalContainer}>
                                        <Text style={styles.pedidoTotal}>S/. {pedido.total.toFixed(2)}</Text>
                                        <View style={[
                                            styles.estadoBadge,
                                            { backgroundColor: pedido.estado === 'entregado' ? '#10b981' : '#f59e0b' }
                                        ]}>
                                            <Text style={styles.estadoText}>
                                                {pedido.estado === 'entregado' ? 'Entregado' : 'Preparado'}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Items del pedido */}
                                <View style={styles.itemsContainer}>
                                    <Text style={styles.itemsTitle}>Productos:</Text>
                                    {pedido.items.slice(0, 2).map((item) => (
                                        <Text key={item.id_item_pedido} style={styles.itemText}>
                                            • {item.cantidad}x {item.producto.nombre}
                                        </Text>
                                    ))}
                                    {pedido.items.length > 2 && (
                                        <Text style={styles.masItems}>
                                            +{pedido.items.length - 2} más
                                        </Text>
                                    )}
                                </View>

                                {/* Botón de cobrar */}
                                <TouchableOpacity
                                    style={styles.cobrarButton}
                                    onPress={() => handleCobrar(pedido)}
                                >
                                    <DollarSign color="#fff" size={18} />
                                    <Text style={styles.cobrarButtonText}>Cobrar S/. {pedido.total.toFixed(2)}</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 20,
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 16,
    },
    statsContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    statItem: {
        flex: 1,
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        marginHorizontal: 4,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    totalMoney: {
        color: '#dc2626',
    },
    statLabel: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9fafb',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
        color: '#1f2937',
    },
    content: {
        flex: 1,
    },
    pedidosList: {
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
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    pedidoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    pedidoNumero: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    clienteInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 4,
    },
    clienteNombre: {
        fontSize: 14,
        color: '#6b7280',
    },
    mesaInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    mesaText: {
        fontSize: 14,
        color: '#6b7280',
    },
    totalContainer: {
        alignItems: 'flex-end',
    },
    pedidoTotal: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#dc2626',
        marginBottom: 8,
    },
    estadoBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    estadoText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    itemsContainer: {
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#f3f4f6',
        marginBottom: 16,
    },
    itemsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 4,
    },
    itemText: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 2,
    },
    masItems: {
        fontSize: 12,
        color: '#9ca3af',
        fontStyle: 'italic',
        marginTop: 4,
    },
    cobrarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#dc2626',
        paddingVertical: 12,
        borderRadius: 8,
    },
    cobrarButtonText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#fff',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: '#6b7280',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    errorText: {
        fontSize: 16,
        color: '#dc2626',
        marginTop: 12,
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
});

export default CajeroDashboard;