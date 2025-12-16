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

interface PaymentSelectorProps {
  titulo?: string;
  subtitulo?: string;
  onSeleccionar?: (metodoPago: MetodoPago) => void;
  onCancelar?: () => void;
  mostrarCancelar?: boolean;
}

const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  titulo = 'Método de Pago',
  subtitulo = 'Selecciona cómo se realizará el pago',
  onSeleccionar,
  onCancelar,
  mostrarCancelar = true,
}) => {
  const router = useRouter();
  const [metodoPagoSeleccionado, setMetodoPagoSeleccionado] = useState<MetodoPago>(null);

  const METODOS_PAGO: MetodoPagoOption[] = [
    { 
      id: 'efectivo', 
      name: 'Efectivo', 
      icon: '💵',
      description: 'Pago en efectivo en el local' 
    },
    { 
      id: 'yape', 
      name: 'Yape', 
      icon: '📱',
      description: 'Transferencia vía Yape' 
    },
    { 
      id: 'plin', 
      name: 'Plin', 
      icon: '📱',
      description: 'Transferencia vía Plin' 
    },
    { 
      id: 'tarjeta', 
      name: 'Tarjeta', 
      icon: '💳',
      description: 'Tarjeta débito/crédito' 
    },
  ];

  const handleSeleccionar = () => {
    if (!metodoPagoSeleccionado) return;

    if (onSeleccionar) {
      onSeleccionar(metodoPagoSeleccionado);
    } else {
      console.log('Método seleccionado:', metodoPagoSeleccionado);
      router.back();
    }
  };

  const handleCancelar = () => {
    if (onCancelar) {
      onCancelar();
    } else {
      router.back();
    }
  };

  const handleMetodoSeleccionado = (metodoId: MetodoPago) => {
    setMetodoPagoSeleccionado(metodoId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* INSTRUCCIÓN */}
        <Text style={styles.instruction}>
          Elige una opción de pago:
        </Text>

        {/* LISTA DE MÉTODOS */}
        <View style={styles.methodsContainer}>
          {METODOS_PAGO.map((metodo) => {
            const isSelected = metodoPagoSeleccionado === metodo.id;
            
            return (
              <TouchableOpacity
                key={metodo.id}
                style={[
                  styles.methodCard,
                  isSelected && styles.methodCardSelected,
                ]}
                onPress={() => handleMetodoSeleccionado(metodo.id)}
                activeOpacity={0.7}
              >
                <View style={styles.methodLeft}>
                  <Text style={styles.methodIcon}>{metodo.icon}</Text>
                  <View style={styles.methodTextContainer}>
                    <Text style={styles.methodName}>{metodo.name}</Text>
                    <Text style={styles.methodDescription}>{metodo.description}</Text>
                  </View>
                </View>
                
                {isSelected && (
                  <View style={styles.selectedBadge}>
                    <Text style={styles.selectedBadgeText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* INFORMACIÓN DEL MÉTODO SELECCIONADO */}
        {metodoPagoSeleccionado && (
          <View style={styles.selectionInfo}>
            <Text style={styles.selectionTitle}>
              Has seleccionado: <Text style={styles.selectedMethodName}>
                {METODOS_PAGO.find(m => m.id === metodoPagoSeleccionado)?.name}
              </Text>
            </Text>
            
            <View style={styles.selectionTips}>
              {metodoPagoSeleccionado === 'efectivo' && (
                <>
                  <Text style={styles.tipText}>• Ten cambio disponible</Text>
                  <Text style={styles.tipText}>• Confirma el monto recibido</Text>
                  <Text style={styles.tipText}>• Entrega el comprobante</Text>
                </>
              )}
              
              {(metodoPagoSeleccionado === 'yape' || metodoPagoSeleccionado === 'plin') && (
                <>
                  <Text style={styles.tipText}>• Verifica el número de teléfono</Text>
                  <Text style={styles.tipText}>• Confirma el monto a transferir</Text>
                  <Text style={styles.tipText}>• Espera confirmación del pago</Text>
                </>
              )}
              
              {metodoPagoSeleccionado === 'tarjeta' && (
                <>
                  <Text style={styles.tipText}>• Ingresa el monto en el datáfono</Text>
                  <Text style={styles.tipText}>• Pasa la tarjeta o inserta el chip</Text>
                  <Text style={styles.tipText}>• Espera la aprobación</Text>
                </>
              )}
            </View>
          </View>
        )}

        {/* BOTÓN DE ACCIÓN PRINCIPAL */}
        <TouchableOpacity
          style={[
            styles.primaryButton,
            !metodoPagoSeleccionado && styles.primaryButtonDisabled,
          ]}
          onPress={handleSeleccionar}
          disabled={!metodoPagoSeleccionado}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>
            {metodoPagoSeleccionado 
              ? `Continuar con ${METODOS_PAGO.find(m => m.id === metodoPagoSeleccionado)?.name}` 
              : 'Selecciona un método'}
          </Text>
        </TouchableOpacity>

        {/* BOTÓN DE CANCELAR (OPCIONAL) */}
        {mostrarCancelar && (
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleCancelar}
            activeOpacity={0.7}
          >
            <Text style={styles.secondaryButtonText}>Cancelar</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default PaymentSelector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    padding: 20,
  },
  instruction: {
    fontSize: 16,
    color: '#495057',
    marginBottom: 20,
    fontWeight: '500',
  },
  methodsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  methodCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  methodCardSelected: {
    borderColor: '#e63946',
    backgroundColor: '#fff5f5',
    shadowColor: '#e63946',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  methodIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  methodTextContainer: {
    flex: 1,
  },
  methodName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 2,
  },
  methodDescription: {
    fontSize: 14,
    color: '#6c757d',
  },
  selectedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e63946',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  selectedBadgeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectionInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#e63946',
    borderLeftWidth: 4,
    borderLeftColor: '#e63946',
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#343a40',
    marginBottom: 12,
  },
  selectedMethodName: {
    fontWeight: '800',
    color: '#e63946',
  },
  selectionTips: {
    gap: 6,
  },
  tipText: {
    fontSize: 14,
    color: '#495057',
    lineHeight: 20,
  },
  primaryButton: {
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
  primaryButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#adb5bd',
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
  },
  secondaryButton: {
    padding: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#6c757d',
    fontWeight: '500',
  },
});