// / =====================================================
// SISTEMA DE RESTAURANTE - SOLO DISEÑO
// Sin funcionalidad, con datos simulados
// Orden: PASO 1 → PASO 2 → PASO 3 → PASO 4 → PASO 5
// =====================================================

// =====================================================
// PASO 1: SELECCIONAR MESA
// Componente: SelectTableScreen.tsx
// =====================================================

import { useMesa } from '@/hooks/mesa/useMesa';
import { Mesa } from '@/types/mesa.types';
import { router } from 'expo-router';
import { UtensilsCrossed } from 'lucide-react-native';
import React, { useMemo } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';



const SelectTableScreen = () => {

    const safeAreaInsents = useSafeAreaInsets()
    const queryMesa = useMesa()


    // Función vacía - Solo diseño
    const handleSelectTable = (mesa: Mesa) => {
        console.log('Mesa seleccionada:', mesa.nombre_mesa);
        router.push({
            // pathname: "/CustomerInfoScreen",
            pathname: "/menuOrderScreen",
            params: {
                id_mesa: mesa.id_mesa.toString(),
                nombre: mesa.nombre_mesa
            },
        })
        // Aquí irá la navegación: navigation.navigate('CustomerInfo', { mesa })
    };


    const renderTableCard = ({ item }: { item: Mesa }) => {
        const isAvailable = item.estado === 'libre';

        return (
            <TouchableOpacity
                style={[
                    stylesStep1.tableCard,
                    isAvailable ? stylesStep1.tableAvailable : stylesStep1.tableOccupied,
                ]}
                onPress={() => isAvailable && handleSelectTable(item)}
                disabled={!isAvailable}
            >
                <Text style={stylesStep1.tableIcon}>🪑</Text>
                <Text style={stylesStep1.tableName}>{item.nombre_mesa}</Text>
                <Text style={{}}>Capacidad {item.capacidad} personas</Text>
                <Text
                    style={[
                        stylesStep1.tableStatus,
                        isAvailable
                            ? stylesStep1.statusAvailable
                            : stylesStep1.statusOccupied,
                    ]}
                >
                    {isAvailable ? '✓ Disponible' : '✗ Ocupada'}
                </Text>
            </TouchableOpacity>
        );
    };


    if (queryMesa.isLoading) {
        return (
            <View style={stylesStep1.loadingContainer}>
                <ActivityIndicator size="large" color="#e63946" />
            </View>
        );
    }
    return (
        <SafeAreaView
            style={[stylesStep1.container, { paddingBottom: safeAreaInsents.bottom }]}
        >
            <View style={stylesStep1.header}>
                <View style={stylesStep1.headerTitle}>
                    <UtensilsCrossed size={28} color="#e63946" />
                    <Text style={stylesStep1.headerText}>Selecionar una Mesa</Text>
                </View>
                <Text style={stylesStep1.subHeader}>Administrar mesas disponibles</Text>
            </View>

            <FlatList
                data={queryMesa.data}
                keyExtractor={(item) => item.id_mesa.toString()}
                numColumns={2}
                renderItem={renderTableCard}
                contentContainerStyle={stylesStep1.list}
            />

            {/* <TouchableOpacity style={stylesStep1.viewOrdersButton}
                onPress={() => router.navigate("/CustomerInfoScreen")}
            >
                <Text style={stylesStep1.viewOrdersText}>
                    📋 Ver Pedidos Activos (3)
                </Text>
            </TouchableOpacity> */}
        </SafeAreaView>
    );
};

const stylesStep1 = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f8f9fa',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
    list: {
        padding: 16,
    },
    tableCard: {
        flex: 1,
        margin: 8,
        padding: 24,
        borderRadius: 12,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 140,
    },
    tableAvailable: {
        backgroundColor: '#dcfce7',
        borderColor: '#86efac',
    },
    tableOccupied: {
        backgroundColor: '#fee2e2',
        borderColor: '#fca5a5',
        opacity: 0.6,
    },
    tableIcon: {
        fontSize: 48,
        marginBottom: 8,
    },
    tableName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    tableStatus: {
        fontSize: 14,
        fontWeight: '600',
    },
    statusAvailable: {
        color: '#16a34a',
    },
    statusOccupied: {
        color: '#dc2626',
    },
    viewOrdersButton: {
        backgroundColor: '#2563eb',
        margin: 16,
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    viewOrdersText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default SelectTableScreen;
