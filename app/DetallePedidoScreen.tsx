import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    ArrowLeft,
    ChefHat,
    User,
    CheckCircle,
    Banknote,
    Smartphone,
    CreditCard
} from 'lucide-react-native';

// Tipos (los mismos que antes)
type MetodoPago = 'efectivo' | 'yape' | 'plin' | 'tarjeta' | 'transferencia';

interface Pedido {
    id_pedido: number;
    numero_pedido: string;
    nombre_cliente: string;
    total: number;
    observaciones: string | null;
    mesa: {
        nombre_mesa: string;
    };
    mesero: {
        nombre_completo: string;
    };
    items: any[];
    pago: any;
    // ... otros campos necesarios
}

interface RouteParams {
    pedido: Pedido;
}

const DetallePedidoScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { pedido } = route.params as RouteParams;

    const getMetodoPagoIcon = (metodo: MetodoPago) => {
        switch (metodo) {
            case 'efectivo': return <Banknote color="#10b981" size={20} />;
            case 'yape': return <Smartphone color="#3b82f6" size={20} />;
            case 'plin': return <Smartphone color="#8b5cf6" size={20} />;
            case 'tarjeta': return <CreditCard color="#f59e0b" size={20} />;
            case 'transferencia': return <Banknote color="#6366f1" size={20} />;
        }
    };

    const getMetodoPagoText = (metodo: MetodoPago) => {
        switch (metodo) {
            case 'efectivo': return 'Efectivo';
            case 'yape': return 'Yape';
            case 'plin': return 'Plin';
            case 'tarjeta': return 'Tarjeta';
            case 'transferencia': return 'Transferencia';
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <ArrowLeft color="#6b7280" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Detalle del Pedido</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView 
                style={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.detalleSection}>
                    <Text style={styles.sectionTitle}>Información General</Text>
                    <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Número de Pedido</Text>
                            <Text style={styles.infoValue}>{pedido.numero_pedido}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Cliente</Text>
                            <Text style={styles.infoValue}>{pedido.nombre_cliente}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Mesa</Text>
                            <Text style={styles.infoValue}>{pedido.mesa.nombre_mesa}</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <Text style={styles.infoLabel}>Mesero</Text>
                            <Text style={styles.infoValue}>{pedido.mesero.nombre_completo}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.detalleSection}>
                    <Text style={styles.sectionTitle}>Items del Pedido</Text>
                    {pedido.items.map((item) => (
                        <View key={item.id_item_pedido} style={styles.itemRow}>
                            <View style={styles.itemInfo}>
                                <Text style={styles.itemNombre}>
                                    {item.menu?.nombre_plato || item.bebida?.nombre_bebida}
                                </Text>
                                {item.observaciones && (
                                    <Text style={styles.itemObservaciones}>
                                        📝 {item.observaciones}
                                    </Text>
                                )}
                            </View>
                            <View style={styles.itemPrecios}>
                                <Text style={styles.itemCantidad}>{item.cantidad}x</Text>
                                <Text style={styles.itemSubtotal}>S/. {item.subtotal.toFixed(2)}</Text>
                            </View>
                        </View>
                    ))}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total:</Text>
                        <Text style={styles.totalAmount}>S/. {pedido.total.toFixed(2)}</Text>
                    </View>
                </View>

                {pedido.observaciones && (
                    <View style={styles.detalleSection}>
                        <Text style={styles.sectionTitle}>Observaciones</Text>
                        <Text style={styles.observacionesText}>{pedido.observaciones}</Text>
                    </View>
                )}

                {pedido.pago && (
                    <View style={styles.detalleSection}>
                        <Text style={styles.sectionTitle}>Información de Pago</Text>
                        <View style={styles.pagoInfo}>
                            <View style={styles.pagoMetodo}>
                                {getMetodoPagoIcon(pedido.pago.metodo_pago)}
                                <Text style={styles.pagoMetodoText}>
                                    {getMetodoPagoText(pedido.pago.metodo_pago)}
                                </Text>
                            </View>
                            <Text style={styles.comprobante}>
                                Comprobante: {pedido.pago.comprobante}
                            </Text>
                            <Text style={styles.fechaPago}>
                                Fecha: {new Date(pedido.pago.fecha_pago).toLocaleString()}
                            </Text>
                        </View>
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
    },
    backButton: {
        padding: 8,
    },
    headerSpacer: {
        width: 40,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    detalleSection: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 12,
    },
    infoGrid: {
        gap: 12,
    },
    infoItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    infoLabel: {
        fontSize: 14,
        color: '#6b7280',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '600',
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
        flex: 1,
    },
    itemNombre: {
        fontSize: 14,
        color: '#374151',
        fontWeight: '600',
        marginBottom: 4,
    },
    itemObservaciones: {
        fontSize: 12,
        color: '#6b7280',
        fontStyle: 'italic',
    },
    itemPrecios: {
        alignItems: 'flex-end',
    },
    itemCantidad: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 2,
    },
    itemSubtotal: {
        fontSize: 14,
        color: '#1f2937',
        fontWeight: '600',
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        marginTop: 8,
        borderTopWidth: 2,
        borderTopColor: '#e5e7eb',
    },
    totalLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#374151',
    },
    totalAmount: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#dc2626',
    },
    observacionesText: {
        fontSize: 14,
        color: '#6b7280',
        lineHeight: 20,
    },
    pagoInfo: {
        backgroundColor: '#f9fafb',
        padding: 12,
        borderRadius: 8,
    },
    pagoMetodo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    pagoMetodoText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1f2937',
    },
    comprobante: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 4,
    },
    fechaPago: {
        fontSize: 14,
        color: '#6b7280',
    },
});

export default DetallePedidoScreen;