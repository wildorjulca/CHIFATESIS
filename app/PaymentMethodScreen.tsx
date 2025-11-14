// =====================================================
// PASO 4: MÉTODO DE PAGO
// Componente: PaymentMethodScreen.tsx
// =====================================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const PaymentMethodScreen = () => {
  // DATOS SIMULADOS
  const mesaInfo = { name: 'Mesa 1' };
  const clienteInfo = 'Juan Pérez';
  const total = 35.0;
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = React.useState(null);

  const METODOS_PAGO = [
    { id: 'efectivo', name: 'Efectivo', icon: '💵' },
    { id: 'yape', name: 'Yape', icon: '📱' },
    { id: 'plin', name: 'Plin', icon: '📱' },
    { id: 'tarjeta', name: 'Tarjeta', icon: '💳' },
    { id: 'caja', name: 'Pagar en Caja', icon: '🏪' },
  ];

  const handleConfirmar = () => {
    console.log('Pedido confirmado con método:', metodoPagoSeleccionado);
    // Aquí irá: navigation.navigate('OrdersList')
  };

  return (
    <SafeAreaView style={stylesStep4.container}>
      <ScrollView style={stylesStep4.content}>
        {/* RESUMEN DEL PEDIDO */}
        <View style={stylesStep4.summaryCard}>
          <View style={stylesStep4.summaryHeader}>
            <View>
              <Text style={stylesStep4.summaryLabel}>Mesa:</Text>
              <Text style={stylesStep4.summaryValue}>{mesaInfo.name}</Text>
            </View>
            <View style={stylesStep4.summaryRight}>
              <Text style={stylesStep4.summaryLabel}>Total a pagar:</Text>
              <Text style={stylesStep4.totalValue}>S/. {total.toFixed(2)}</Text>
            </View>
          </View>
          <Text style={stylesStep4.summaryCustomer}>
            Cliente: {clienteInfo}
          </Text>
        </View>

        {/* PREGUNTA */}
        <Text style={stylesStep4.question}>¿Cómo pagará el cliente?</Text>

        {/* MÉTODOS DE PAGO */}
        <View style={stylesStep4.methodsGrid}>
          {METODOS_PAGO.map((metodo) => (
            <TouchableOpacity
              key={metodo.id}
              style={[
                stylesStep4.methodCard,
                metodoPagoSeleccionado === metodo.id &&
                  stylesStep4.methodCardSelected,
              ]}
              onPress={() => setMetodoPagoSeleccionado(metodo.id)}
            >
              <Text style={stylesStep4.methodIcon}>{metodo.icon}</Text>
              <Text style={stylesStep4.methodName}>{metodo.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* NOTA INFORMATIVA */}
        {metodoPagoSeleccionado === 'caja' && (
          <View style={stylesStep4.infoBox}>
            <Text style={stylesStep4.infoIcon}>ℹ️</Text>
            <Text style={stylesStep4.infoText}>
              El cliente pagará en caja después de recibir su pedido
            </Text>
          </View>
        )}

        {metodoPagoSeleccionado &&
          metodoPagoSeleccionado !== 'caja' &&
          metodoPagoSeleccionado !== 'efectivo' && (
            <View style={stylesStep4.successBox}>
              <Text style={stylesStep4.successIcon}>✓</Text>
              <Text style={stylesStep4.successText}>
                Pago registrado como completado
              </Text>
            </View>
          )}

        {/* BOTONES */}
        <View style={stylesStep4.buttonContainer}>
          <TouchableOpacity style={stylesStep4.backButton}>
            <Text style={stylesStep4.backButtonText}>← Atrás</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              stylesStep4.confirmButton,
              !metodoPagoSeleccionado && stylesStep4.disabledButton,
            ]}
            onPress={handleConfirmar}
            disabled={!metodoPagoSeleccionado}
          >
            <Text style={stylesStep4.confirmButtonText}>✓ Confirmar Pedido</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentMethodScreen

const stylesStep4 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5f1',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#fed7aa',
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  summaryRight: {
    alignItems: 'flex-end',
  },
  totalValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ea580c',
  },
  summaryCustomer: {
    fontSize: 14,
    color: '#6b7280',
  },
  question: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 20,
  },
  methodsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  methodCard: {
    width: '47%',
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  methodCardSelected: {
    borderColor: '#ea580c',
    backgroundColor: '#fff7ed',
    borderWidth: 3,
  },
  methodIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  methodName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1f2937',
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#fcd34d',
  },
  infoIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#92400e',
    lineHeight: 20,
  },
  successBox: {
    flexDirection: 'row',
    backgroundColor: '#d1fae5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#6ee7b7',
  },
  successIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  successText: {
    flex: 1,
    fontSize: 14,
    color: '#065f46',
    fontWeight: '600',
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  backButton: {
    flex: 1,
    backgroundColor: '#e5e7eb',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#16a34a',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.5,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
