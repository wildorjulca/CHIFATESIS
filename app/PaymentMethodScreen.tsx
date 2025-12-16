import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard, ArrowLeft } from 'lucide-react-native';

// Tipos TypeScript
type MetodoPago = 'efectivo' | 'yape' | 'plin' | 'tarjeta' | null;

interface MetodoPagoOption {
  id: MetodoPago;
  name: string;
  icon: string;
  description: string;
}

interface PaymentMethodSelectorProps {
  onSelect?: (metodoPago: MetodoPago) => void;
  onBack?: () => void;
  titulo?: string;
  subtitulo?: string;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  onSelect,
  onBack,
  titulo = 'Seleccionar Método de Pago',
  subtitulo = 'Elige cómo se realizará el pago',
}) => {
  const router = useRouter();
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState<MetodoPago>(null);

  const METODOS_PAGO: MetodoPagoOption[] = [
    {
      id: 'efectivo',
      name: 'Efectivo',
      icon: '💵',
      description: 'Pago en efectivo'
    },
    {
      id: 'yape',
      name: 'Yape',
      icon: '📱',
      description: 'Pago con Yape'
    },
    {
      id: 'plin',
      name: 'Plin',
      icon: '📱',
      description: 'Pago con Plin'
    },
    {
      id: 'tarjeta',
      name: 'Tarjeta',
      icon: '💳',
      description: 'Pago con tarjeta'
    },
  ];

  const handleSeleccionar = () => {
    if (!metodoPagoSeleccionado) return;

    if (onSelect) {
      onSelect(metodoPagoSeleccionado);
    } else {
      console.log('Método seleccionado:', metodoPagoSeleccionado);
      // Navegar atrás o a donde corresponda
      router.back();
    }
  };

  const handleAtras = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleMetodoSeleccionado = (metodoId: MetodoPago) => {
    setMetodoPagoSeleccionado(metodoId);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitle}>
            <CreditCard size={28} color="#e63946" />
            <Text style={styles.headerText}>{titulo}</Text>
          </View>
          <Text style={styles.subHeader}>{subtitulo}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* LISTA DE MÉTODOS DE PAGO */}
        <Text style={styles.instruction}>
          Selecciona un método de pago:
        </Text>

        <View style={styles.methodsList}>
          {METODOS_PAGO.map((metodo) => (
            <TouchableOpacity
              key={metodo.id}
              style={[
                styles.methodItem,
                metodoPagoSeleccionado === metodo.id && styles.methodItemSelected,
              ]}
              onPress={() => handleMetodoSeleccionado(metodo.id)}
              activeOpacity={0.7}
            >
              <View style={styles.methodIconContainer}>
                <Text style={styles.methodIcon}>{metodo.icon}</Text>
              </View>

              <View style={styles.methodInfo}>
                <Text style={styles.methodName}>{metodo.name}</Text>
                <Text style={styles.methodDescription}>{metodo.description}</Text>
              </View>

              {metodoPagoSeleccionado === metodo.id && (
                <View style={styles.selectedIndicator}>
                  <View style={styles.selectedDot} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* INFORMACIÓN ADICIONAL */}
        {metodoPagoSeleccionado && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoTitle}>
              Método seleccionado: <Text style={styles.infoMethod}>{METODOS_PAGO.find(m => m.id === metodoPagoSeleccionado)?.name}</Text>
            </Text>

            {metodoPagoSeleccionado === 'efectivo' && (
              <Text style={styles.infoText}>
                💡 Recuerda tener cambio disponible para el cliente.
              </Text>
            )}

            {metodoPagoSeleccionado === 'yape' || metodoPagoSeleccionado === 'plin' ? (
              <Text style={styles.infoText}>
                ✅ Pago digital registrado automáticamente.
              </Text>
            ) : null}

            {metodoPagoSeleccionado === 'tarjeta' && (
              <Text style={styles.infoText}>
                💳 Procesa la tarjeta en el datáfono y verifica la transacción.
              </Text>
            )}
          </View>
        )}

        {/* BOTÓN DE CONFIRMACIÓN */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            !metodoPagoSeleccionado && styles.disabledButton,
          ]}
          onPress={handleSeleccionar}
          disabled={!metodoPagoSeleccionado}
          activeOpacity={0.8}
        >
          <Text style={styles.confirmButtonText}>
            {metodoPagoSeleccionado
              ? `Seleccionar ${METODOS_PAGO.find(m => m.id === metodoPagoSeleccionado)?.name}`
              : 'Seleccionar Método'}
          </Text>
        </TouchableOpacity>

        {/* ALTERNATIVA SI NO QUIERES SELECCIONAR */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleAtras}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentMethodSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 4,
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: '#343a40',
    flex: 1,
  },
  subHeader: {
    fontSize: 14,
    color: '#6c757d',
    marginLeft: 40, // Para alinear con el texto del título
  },
  content: {
    padding: 20,
    paddingTop: 24,
  },
  instruction: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 24,
    fontWeight: '500',
  },
  methodsList: {
    gap: 12,
    marginBottom: 32,
  },
  methodItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  methodItemSelected: {
    borderColor: '#e63946',
    backgroundColor: '#fff5f5',
    shadowColor: '#e63946',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  methodIconContainer: {
    marginRight: 16,
  },
  methodIcon: {
    fontSize: 36,
  },
  methodInfo: {
    flex: 1,
  },
  methodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e63946',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  infoContainer: {
    backgroundColor: '#e7f5ff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#a5d8ff',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1864ab',
    marginBottom: 8,
  },
  infoMethod: {
    fontWeight: '800',
    color: '#e63946',
  },
  infoText: {
    fontSize: 14,
    color: '#1864ab',
    lineHeight: 20,
  },
  confirmButton: {
    backgroundColor: '#e63946',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#e63946',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    opacity: 0.5,
    backgroundColor: '#adb5bd',
  },
  confirmButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  skipButton: {
    padding: 16,
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
});