// =====================================================
// PASO 2: DATOS DEL CLIENTE
// Componente: CustomerInfoScreen.tsx
// =====================================================

import React from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CustomerInfoScreen = () => {

    const { id_mesa, nombre } = useLocalSearchParams();

  // Datos simulados
  const mesaSeleccionada = { id: 1, name: "Mesa 1" };
  const [nombreCliente, setNombreCliente] = React.useState("");

  const handleContinue = () => {
    console.log("Cliente:", nombreCliente);
    router.navigate("/menuOrderScreen")
    // Aquí irá la navegación real, por ejemplo:
    // router.push({ pathname: '/OrderMenu', params: { mesa: mesaSeleccionada, cliente: nombreCliente } })
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Tarjeta de Mesa Seleccionada */}
        <View style={styles.mesaCard}>
          <Text style={styles.mesaLabel}>Mesa seleccionada:</Text>
          <Text style={styles.mesaName}>{nombre}</Text>
        </View>

        {/* Input del Cliente */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Nombre del Cliente:</Text>
          <TextInput
            style={styles.input}
            value={nombreCliente}
            onChangeText={setNombreCliente}
            placeholder="Ej: Juan Pérez"
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Caja de información */}
        <View style={styles.infoBox}>
          <Text style={styles.infoIcon}>💡</Text>
          <Text style={styles.infoText}>
            Ingresa el nombre del cliente para identificar el pedido.
          </Text>
        </View>

        {/* Botones */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>← Atrás</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.continueButton,
              !nombreCliente.trim() && styles.disabledButton,
            ]}
            onPress={handleContinue}
            disabled={!nombreCliente.trim()}
          >
            <Text style={styles.continueButtonText}>Continuar →</Text>
          </TouchableOpacity>
        </View>

        {/* Acceso directo al Menú (debug o acceso rápido) */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => router.navigate("/OrderMenusScreen")}
        >
          <Text style={styles.menuButtonText}>Ir al Menú 🍽️</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff5f1",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  // ---- Mesa ----
  mesaCard: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#fed7aa",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  mesaLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 6,
  },
  mesaName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ea580c",
  },
  // ---- Input ----
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1f2937",
  },
  // ---- Info Box ----
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#dbeafe",
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: "#93c5fd",
  },
  infoIcon: {
    fontSize: 22,
    marginRight: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#1e40af",
    lineHeight: 20,
  },
  // ---- Botones ----
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  backButton: {
    flex: 1,
    backgroundColor: "#e5e7eb",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
  },
  continueButton: {
    flex: 1,
    backgroundColor: "#ea580c",
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  disabledButton: {
    opacity: 0.5,
  },
  // ---- Botón extra ----
  menuButton: {
    alignSelf: "center",
    marginTop: 10,
  },
  menuButtonText: {
    fontSize: 14,
    color: "#2563eb",
    fontWeight: "500",
  },
});

export default CustomerInfoScreen;
