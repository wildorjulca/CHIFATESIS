import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal,
    Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    DollarSign,
    CreditCard,
    Smartphone,
    Banknote,
    ArrowLeft,
    CheckCircle
} from 'lucide-react-native';
import { useAuthStore } from '@/store/auth/auth-store';
import { usePagoMutation } from '@/hooks/pago/usePagoMutation';
import { usePedidoDetallePorPagar } from '@/hooks/pedido/usePedidoDetallePorPagar';

// Tipos (los mismos que antes)
type MetodoPago = 'efectivo' | 'yape' | 'plin' | 'tarjeta' | 'transferencia';

interface Pedido {
    id_pedido: number;
    numero_pedido: string;
    nombre_cliente: string;
    total: number;
    // ... otros campos necesarios
}

interface RouteParams {
    pedido: Pedido;
}

const ProcesarPagoScreen = () => {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation();
    const route = useRoute();
    const { pedido } = route.params as RouteParams;
    const { user } = useAuthStore()

    console.log('Pedido recibido en ProcesarPagoScreen:', pedido);

    const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo');
    const [montoRecibido, setMontoRecibido] = useState(pedido.total.toString());
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [comprobante, setComprobante] = useState('');
    const scaleAnim = new Animated.Value(0.8);
    const opacityAnim = new Animated.Value(0);

    const pagoMutation = usePagoMutation();
    const querypedidoDetailsPorGagar = usePedidoDetallePorPagar()

    // Animaciones para el modal
    useEffect(() => {
        if (showSuccessModal) {
            // Resetear animaciones
            scaleAnim.setValue(0.8);
            opacityAnim.setValue(0);

            // Animación de entrada
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    tension: 50,
                    friction: 7,
                    useNativeDriver: true,
                }),
                Animated.timing(opacityAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]).start();

            // Cerrar automáticamente después de 2 segundos
            const timer = setTimeout(() => {
                cerrarModalYRegresar();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [showSuccessModal]);

    const calcularCambio = () => {
        if (!montoRecibido) return 0;
        const monto = parseFloat(montoRecibido) || 0;
        return monto - pedido.total;
    };

    const cerrarModalYRegresar = () => {
        setShowSuccessModal(false);
        // Regresar después de un pequeño delay para que se vea la animación de salida
        setTimeout(() => {
            navigation.goBack();
        }, 300);
    };

    const confirmarPago = () => {
        const cambio = calcularCambio();

        // Validaciones
        if (metodoPago === 'efectivo' && cambio < 0) {
            Alert.alert('Error', 'El monto recibido es menor al total');
            return;
        }

        if (!montoRecibido || parseFloat(montoRecibido) <= 0) {
            Alert.alert('Error', 'Ingrese un monto válido');
            return;
        }

        const comprobanteGenerado = `B${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;
        setComprobante(comprobanteGenerado);

        const paymentDetails = {
            id_pedido: pedido.id_pedido,
            id_cajero: user?.id,
            metodo_pago: metodoPago,
            monto: pedido.total,
            monto_recibido: metodoPago === 'efectivo' ? parseFloat(montoRecibido) || 0 : pedido.total,
            cambio: metodoPago === 'efectivo' ? calcularCambio() : 0,
            comprobante: comprobanteGenerado,
            pagado: true,
        };

        console.log('Procesando pago con los siguientes detalles:');
        console.log('Detalles del Pago:', paymentDetails);

        pagoMutation.mutate(paymentDetails, {
            onSuccess: (data) => {
                console.log('Pago exitoso:', data);
                // Mostrar modal de éxito
                querypedidoDetailsPorGagar.refetch()
                setShowSuccessModal(true);
            },
            onError: (error) => {
                console.error('Error en pago:', error);
                Alert.alert('Error', 'No se pudo procesar el pago. Intente nuevamente.');
            }
        });
    };

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
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    disabled={pagoMutation.isPending}
                >
                    <ArrowLeft color="#6b7280" size={24} />
                </TouchableOpacity>
                <Text style={styles.title}>Procesar Pago</Text>
                <View style={styles.headerSpacer} />
            </View>

            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contentContainer}
            >
                <View style={styles.resumenPago}>
                    <Text style={styles.resumenTitle}>Resumen del Pedido</Text>
                    <Text style={styles.pedidoNumero}>{pedido.numero_pedido}</Text>
                    <Text style={styles.clienteNombre}>{pedido.nombre_cliente}</Text>
                    <Text style={styles.totalPago}>Total a Pagar: S/. {pedido.total.toFixed(2)}</Text>
                </View>

                <View style={styles.metodoPagoSection}>
                    <Text style={styles.sectionTitle}>Método de Pago</Text>
                    <View style={styles.metodosContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.metodosContent}
                        >
                            {(['efectivo', 'yape', 'plin', 'tarjeta', 'transferencia'] as MetodoPago[]).map((metodo) => (
                                <TouchableOpacity
                                    key={metodo}
                                    style={[
                                        styles.metodoOption,
                                        metodoPago === metodo && styles.metodoOptionSelected
                                    ]}
                                    onPress={() => {
                                        if (!pagoMutation.isPending) {
                                            setMetodoPago(metodo);
                                            if (metodo !== 'efectivo') {
                                                setMontoRecibido(pedido.total.toString());
                                            }
                                        }
                                    }}
                                    disabled={pagoMutation.isPending}
                                >
                                    {getMetodoPagoIcon(metodo)}
                                    <Text style={[
                                        styles.metodoText,
                                        metodoPago === metodo && styles.metodoTextSelected
                                    ]}>
                                        {getMetodoPagoText(metodo)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>

                {metodoPago === 'efectivo' && (
                    <View style={styles.montoSection}>
                        <Text style={styles.sectionTitle}>Monto Recibido</Text>
                        <TextInput
                            style={[
                                styles.montoInput,
                                pagoMutation.isPending && styles.disabledInput
                            ]}
                            placeholder="0.00"
                            value={montoRecibido}
                            onChangeText={setMontoRecibido}
                            keyboardType="decimal-pad"
                            placeholderTextColor="#9ca3af"
                            editable={!pagoMutation.isPending}
                        />
                        {montoRecibido && (
                            <View style={styles.cambioContainer}>
                                <Text style={styles.cambioLabel}>Cambio:</Text>
                                <Text style={[
                                    styles.cambioAmount,
                                    { color: calcularCambio() >= 0 ? '#10b981' : '#ef4444' }
                                ]}>
                                    S/. {Math.abs(calcularCambio()).toFixed(2)}
                                    {calcularCambio() < 0 && ' (Falta)'}
                                </Text>
                            </View>
                        )}
                    </View>
                )}

                {pagoMutation.isError && (
                    <View style={styles.errorContainer}>
                        <Text style={styles.errorText}>Error: {JSON.stringify(pagoMutation.error)}</Text>
                    </View>
                )}

                <View style={styles.confirmarSection}>
                    <TouchableOpacity
                        style={[
                            styles.confirmarButton,
                            (metodoPago === 'efectivo' && calcularCambio() < 0) && styles.confirmarButtonDisabled,
                            pagoMutation.isPending && styles.confirmarButtonDisabled
                        ]}
                        onPress={confirmarPago}
                        disabled={pagoMutation.isPending || (metodoPago === 'efectivo' && calcularCambio() < 0)}
                    >
                        <DollarSign color="#fff" size={20} />
                        <Text style={styles.confirmarButtonText}>
                            {pagoMutation.isPending ? 'Procesando...' : `Confirmar Pago - S/. ${pedido.total.toFixed(2)}`}
                        </Text>
                    </TouchableOpacity>

                    {(metodoPago === 'efectivo' && calcularCambio() < 0) && (
                        <Text style={styles.errorText}>
                            El monto recibido es insuficiente
                        </Text>
                    )}
                </View>
            </ScrollView>

            {/* Modal de éxito */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showSuccessModal}
                onRequestClose={cerrarModalYRegresar}
            >
                <View style={styles.modalOverlay}>
                    <Animated.View style={[
                        styles.modalContent,
                        {
                            transform: [{ scale: scaleAnim }],
                            opacity: opacityAnim,
                        }
                    ]}>
                        <View style={styles.successIconContainer}>
                            <CheckCircle color="#10b981" size={60} />
                        </View>
                        <Text style={styles.modalTitle}>¡Pago Exitoso!</Text>
                        <Text style={styles.modalText}>
                            El pago se ha procesado correctamente
                        </Text>
                        {comprobante && (
                            <Text style={styles.comprobanteText}>
                                Comprobante: {comprobante}
                            </Text>
                        )}
                    </Animated.View>
                </View>
            </Modal>
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
    },
    contentContainer: {
        padding: 16,
        paddingBottom: 30,
    },
    resumenPago: {
        backgroundColor: '#f9fafb',
        padding: 16,
        borderRadius: 12,
        marginBottom: 20,
        alignItems: 'center',
    },
    resumenTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#6b7280',
        marginBottom: 8,
    },
    pedidoNumero: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    clienteNombre: {
        fontSize: 16,
        color: '#374151',
        marginBottom: 12,
    },
    totalPago: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#dc2626',
    },
    metodoPagoSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 12,
    },
    metodosContainer: {
        minHeight: 80,
    },
    metodosContent: {
        paddingVertical: 8,
    },
    metodoOption: {
        alignItems: 'center',
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#f3f4f6',
        marginRight: 8,
        minWidth: 80,
        height: 70,
        justifyContent: 'center',
    },
    metodoOptionSelected: {
        backgroundColor: '#dc2626',
        transform: [{ scale: 1.05 }],
    },
    metodoText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#6b7280',
        marginTop: 4,
        textAlign: 'center',
    },
    metodoTextSelected: {
        color: '#fff',
    },
    montoSection: {
        marginBottom: 20,
        minHeight: 120,
    },
    montoInput: {
        borderWidth: 2,
        borderColor: '#d1d5db',
        borderRadius: 12,
        padding: 16,
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        backgroundColor: '#fff',
        textAlign: 'center',
        marginBottom: 12,
    },
    disabledInput: {
        backgroundColor: '#f3f4f6',
        color: '#9ca3af',
    },
    cambioContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    cambioLabel: {
        fontSize: 16,
        color: '#6b7280',
        fontWeight: '600',
    },
    cambioAmount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    confirmarSection: {
        marginTop: 10,
    },
    confirmarButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#dc2626',
        paddingVertical: 16,
        borderRadius: 12,
        marginBottom: 8,
    },
    confirmarButtonDisabled: {
        backgroundColor: '#d1d5db',
    },
    confirmarButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    errorContainer: {
        backgroundColor: '#fee2e2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        fontSize: 14,
        color: '#ef4444',
        textAlign: 'center',
        fontWeight: '500',
    },
    // Estilos para el modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 24,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '80%',
        maxWidth: 300,
    },
    successIconContainer: {
        marginBottom: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 8,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        color: '#6b7280',
        textAlign: 'center',
        marginBottom: 8,
    },
    comprobanteText: {
        fontSize: 14,
        color: '#10b981',
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default ProcesarPagoScreen;