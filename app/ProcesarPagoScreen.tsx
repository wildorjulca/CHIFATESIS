import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
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

    const [metodoPago, setMetodoPago] = useState<MetodoPago>('efectivo');
    const [montoRecibido, setMontoRecibido] = useState(pedido.total.toString());

    const calcularCambio = () => {
        if (!montoRecibido) return 0;
        const monto = parseFloat(montoRecibido) || 0;
        return monto - pedido.total;
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

        // Simular procesamiento de pago
        const comprobante = `B${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

        Alert.alert(
            'Pago Exitoso',
            `Pago procesado correctamente\nComprobante: ${comprobante}`,
            [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
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
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
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
                                        setMetodoPago(metodo);
                                        if (metodo !== 'efectivo') {
                                            setMontoRecibido(pedido.total.toString());
                                        }
                                    }}
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
                            style={styles.montoInput}
                            placeholder="0.00"
                            value={montoRecibido}
                            onChangeText={setMontoRecibido}
                            keyboardType="decimal-pad"
                            placeholderTextColor="#9ca3af"
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

                <View style={styles.confirmarSection}>
                    <TouchableOpacity
                        style={[
                            styles.confirmarButton,
                            (metodoPago === 'efectivo' && calcularCambio() < 0) && styles.confirmarButtonDisabled
                        ]}
                        onPress={confirmarPago}
                        disabled={metodoPago === 'efectivo' && calcularCambio() < 0}
                    >
                        <DollarSign color="#fff" size={20} />
                        <Text style={styles.confirmarButtonText}>
                            Confirmar Pago - S/. {pedido.total.toFixed(2)}
                        </Text>
                    </TouchableOpacity>
                    
                    {(metodoPago === 'efectivo' && calcularCambio() < 0) && (
                        <Text style={styles.errorText}>
                            El monto recibido es insuficiente
                        </Text>
                    )}
                </View>
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
    errorText: {
        fontSize: 14,
        color: '#ef4444',
        textAlign: 'center',
        fontWeight: '500',
    },
});

export default ProcesarPagoScreen;