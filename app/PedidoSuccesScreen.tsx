import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  CheckCircle, 
  Clock, 
  User, 
  ChefHat,
  Home
} from 'lucide-react-native';

const PedidoSuccess = () => {
  const { numeroPedido, estimatedTime, nombreCliente, mesaNombre } = useLocalSearchParams();
  const safeAreaInsets = useSafeAreaInsets();

  const handleBackToHome = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <View style={styles.container}>
      {/* Contenido principal */}
      <View style={[styles.content, { paddingTop: safeAreaInsets.top + 60 }]}>
        <View style={styles.successIcon}>
          <CheckCircle color="#10b981" size={80} />
        </View>
        
        <Text style={styles.successTitle}>¡Pedido Enviado!</Text>
        <Text style={styles.successSubtitle}>
          El pedido ha sido enviado a cocina exitosamente
        </Text>

        <View style={styles.successDetails}>
          <View style={styles.successDetailItem}>
            <Text style={styles.successDetailLabel}>Número de Pedido</Text>
            <Text style={styles.successDetailValue}>{numeroPedido}</Text>
          </View>
          

          <View style={styles.successDetailItemRow}>
            <User color="#6b7280" size={20} />
            <View style={styles.successDetailItemContent}>
              <Text style={styles.successDetailLabel}>Cliente</Text>
              <Text style={styles.successDetailValue}>{nombreCliente}</Text>
            </View>
          </View>

          <View style={styles.successDetailItemRow}>
            <ChefHat color="#6b7280" size={20} />
            <View style={styles.successDetailItemContent}>
              <Text style={styles.successDetailLabel}>Mesa</Text>
              <Text style={styles.successDetailValue}>{mesaNombre}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Footer fijo */}
      <View style={[styles.footer, { paddingBottom: safeAreaInsets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.successButtonPrimary}
          onPress={handleBackToHome}
        >
          <Home color="#fff" size={20} />
          <Text style={styles.successButtonPrimaryText}>Volver al Inicio</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  successIcon: {
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  successDetails: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  successDetailItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  successDetailItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  successDetailItemContent: {
    flex: 1,
  },
  successDetailLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 6,
    fontWeight: '500',
  },
  successDetailValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  footer: {
    padding: 20,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  successButtonPrimary: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  successButtonPrimaryText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});

export default PedidoSuccess;