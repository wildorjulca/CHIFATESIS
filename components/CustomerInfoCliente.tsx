// =====================================================
// PASO 2: DATOS DEL CLIENTE
// Componente: CustomerInfoScreen.tsx
// =====================================================

import { Text } from "lucide-react-native";
import React from "react";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CustomerInfoScreen = () => {
    // DATOS SIMULADOS
    const mesaSeleccionada = { id: 1, name: 'Mesa 1' };
    const [nombreCliente, setNombreCliente] = React.useState('');

    const handleContinue = () => {
        console.log('Cliente:', nombreCliente);
        // Aquí irá: navigation.navigate('OrderMenu', { mesa, customer })
    };

    return (
        <SafeAreaView style={stylesStep2.container}>
            <View style={stylesStep2.content}>
                <View style={stylesStep2.mesaCard}>
                    <Text style={stylesStep2.mesaLabel}>Mesa seleccionada:</Text>
                    <Text style={stylesStep2.mesaName}>{mesaSeleccionada.name}</Text>
                </View>

                <View style={stylesStep2.inputContainer}>
                    <Text style={stylesStep2.inputLabel}>Nombre del Cliente:</Text>
                    <TextInput
                        style={stylesStep2.input}
                        value={nombreCliente}
                        onChangeText={setNombreCliente}
                        placeholder="Ej: Juan Pérez"
                        placeholderTextColor="#9ca3af"
                    />
                </View>

                <View style={stylesStep2.infoBox}>
                    <Text style={stylesStep2.infoIcon}>💡</Text>
                    <Text style={stylesStep2.infoText}>
                        Ingresa el nombre del cliente para identificar el pedido
                    </Text>
                </View>

                <View style={stylesStep2.buttonContainer}>
                    <TouchableOpacity style={stylesStep2.backButton}>
                        <Text style={stylesStep2.backButtonText}>← Atrás</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            stylesStep2.continueButton,
                            !nombreCliente.trim() && stylesStep2.disabledButton,
                        ]}
                        onPress={handleContinue}
                        disabled={!nombreCliente.trim()}
                    >
                        <Text style={stylesStep2.continueButtonText}>Continuar →</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const stylesStep2 = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff5f1',
    },
    content: {
        flex: 1,
        padding: 24,
    },
    mesaCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#fed7aa',
    },
    mesaLabel: {
        fontSize: 14,
        color: '#6b7280',
        marginBottom: 8,
    },
    mesaName: {
        // fontSize: 25,
        // color: '#ea581c',
    },
    inputContainer: {
        marginBottom: 24,
    },
    inputLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1f2937',
        marginBottom: 12,
    },
    input: {
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: '#d1d5db',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1f2937',
    },
    infoBox: {
        flexDirection: 'row',
        backgroundColor: '#dbeafe',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#93c5fd',
    },
    infoIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    infoText: {
        flex: 1,
        fontSize: 14,
        color: '#1e40af',
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    backButton: {
        flex: 1,
        backgroundColor: '#e5e7eb',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    backButtonText: {
        // fontSize: 16,
        // fontWeight: 'bold',
        // color: '#374151',
    },
    continueButton: {
        flex: 1,
        backgroundColor: '#ea580c',
        padding: 18,
        borderRadius: 12,
        alignItems: 'center',
    },
    disabledButton: {
        opacity: 0.5,
    },
    continueButtonText: {
        // fontSize: 16,
        // fontWeight: 'bold',
        // color: '#fff',
    },
});