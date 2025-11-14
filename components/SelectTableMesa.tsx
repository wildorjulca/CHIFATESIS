// / =====================================================
// SISTEMA DE RESTAURANTE - SOLO DISEÑO
// Sin funcionalidad, con datos simulados
// Orden: PASO 1 → PASO 2 → PASO 3 → PASO 4 → PASO 5
// =====================================================

// =====================================================
// PASO 1: SELECCIONAR MESA
// Componente: SelectTableScreen.tsx
// =====================================================

import React from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
} from 'react-native';

// DATOS SIMULADOS
const MESAS_SIMULADAS = [
    { id: 1, name: 'Mesa 1', status: 'libre' },
    { id: 2, name: 'Mesa 2', status: 'ocupada' },
    { id: 3, name: 'Mesa 3', status: 'libre' },
    { id: 4, name: 'Mesa 4', status: 'libre' },
    { id: 5, name: 'Mesa 5', status: 'ocupada' },
    { id: 6, name: 'Mesa 6', status: 'libre' },
    { id: 7, name: 'Mesa 7', status: 'reservada' },
    { id: 8, name: 'Mesa 8', status: 'libre' },
];

const SelectTableMesa = () => {
    // Función vacía - Solo diseño
    const handleSelectTable = (mesa: any) => {
        console.log('Mesa seleccionada:', mesa.name);
        // Aquí irá la navegación: navigation.navigate('CustomerInfo', { mesa })
    };

    const renderTableCard = ({ item }: any) => {
        const isAvailable = item.status === 'libre';

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
                <Text style={stylesStep1.tableName}>{item.name}</Text>
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

    return (
        <SafeAreaView style={stylesStep1.container}>
            <View style={stylesStep1.header}>
                <Text style={stylesStep1.headerTitle}>🏠 Seleccionar Mesa</Text>
                <Text style={stylesStep1.headerSubtitle}>
                    Elige una mesa disponible para comenzar
                </Text>
            </View>

            <FlatList
                data={MESAS_SIMULADAS}
                keyExtractor={(item) => item.id.toString()}
                numColumns={2}
                renderItem={renderTableCard}
                contentContainerStyle={stylesStep1.list}
            />

            <TouchableOpacity style={stylesStep1.viewOrdersButton}>
                <Text style={stylesStep1.viewOrdersText}>
                    📋 Ver Pedidos Activos (3)
                </Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

const stylesStep1 = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff5f1',
    },
    header: {
        backgroundColor: '#fff',
        padding: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#fed7aa',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#6b7280',
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

export default SelectTableMesa;
