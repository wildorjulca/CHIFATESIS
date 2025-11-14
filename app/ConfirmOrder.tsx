import { bodyPedido } from '@/action/pedido/pedido';
import { usePedidoMutation } from '@/hooks/pedido/usePedidoMuation';
import { useAuthStore } from '@/store/auth/auth-store';
import { ItemCarrito, useCartStore } from '@/store/cart/cart-store';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { 
  ArrowLeft,
  User, 
  MessageSquare, 
  Clock, 
  CheckCircle, 
  ChefHat,
  Send,
  Trash2,
  ShoppingBag
} from 'lucide-react-native';

const ConfirmOrder = () => {
  const { id_mesa, nombre } = useLocalSearchParams();

  const { items, limpiarCarrito } = useCartStore();
  const { totalPagar } = useCartStore.getState().getSumaryInformation();
  const { user } = useAuthStore();
  
  const [nombreCliente, setNombreCliente] = useState('');
  const [observacionesPedido, setObservacionesPedido] = useState('');
  const [itemObservaciones, setItemObservaciones] = useState<{[key: string]: string}>({});
  const [showLoading, setShowLoading] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [tempObservacion, setTempObservacion] = useState('');

  const safeAreaInsets = useSafeAreaInsets();
  const saveMutationPedido = usePedidoMutation();

  const calculateEstimatedTime = (itemsCount: number) => {
    const baseTime = 15;
    const additionalTime = Math.min(itemsCount * 3, 30);
    return baseTime + additionalTime;
  };

  const handleSubmitOrder = async () => {
    if (!nombreCliente.trim()) {
      Alert.alert('Nombre requerido', 'Por favor ingresa el nombre del cliente');
      return;
    }

    try {
      setShowLoading(true);

      const body: bodyPedido = {
        id_mesa: Number(id_mesa),
        id_mesero: Number(user?.id),
        nombre_cliente: nombreCliente.trim(),
        id_cliente: null,
        observaciones: observacionesPedido.trim() || undefined,
        items: items.map((item: ItemCarrito) => {
          const [tipo, id] = item.id.split('-');
          const idNumerico = parseInt(id);
          
          const baseItem = {
            cantidad: item.cantidad,
            precio_unitario: item.precio_unitario,
            observaciones: itemObservaciones[item.id] || ""
          };

          if (tipo === 'menu') {
            return {
              ...baseItem,
              id_menu: idNumerico,
              id_bebida: undefined
            };
          } else {
            return {
              ...baseItem,
              id_bebida: idNumerico,
              id_menu: undefined
            };
          }
        })
      };

      const data = await saveMutationPedido.mutateAsync(body);
      console.log('Respuesta del pedido:', data);
      
      if (data?.pedido.numero_pedido) {
        // Calcular el tiempo estimado ANTES de redireccionar
        // const estimatedTime = calculateEstimatedTime(items.length);
        // console.log('Pedido guardado exitosamente. Redirigiendo...');
        
        // Limpiar carrito ANTES de redireccionar
        limpiarCarrito();
        
        // Ocultar loading ANTES de redireccionar
        setShowLoading(false);
        
        // Redireccionar a página de éxito con parámetros
        router.replace({
          pathname: '/PedidoSuccesScreen',
          params: {
            numeroPedido: data.pedido.numero_pedido,
            nombreCliente: nombreCliente.trim(),
            mesaNombre: nombre as string
          }
        });
        
        // Limpiar estados
        setNombreCliente('');
        setObservacionesPedido('');
        setItemObservaciones({});
      } else {
        console.log("data pedido", data.pedido)
        // data.pedido.id_pedido
        // Si no viene numero_pedido, también detener el loading
        setShowLoading(false);
        Alert.alert(
          'Error', 
          'No se recibió confirmación del pedido. Por favor verifica.'
        );
      }
    } catch (error) {
      console.log(error)
      // Asegurarse de detener el loading en caso de error
      setShowLoading(false);
      Alert.alert(
        'Error', 
        'No se pudo procesar el pedido. Por favor intenta nuevamente.'
      );
      console.error('Error al guardar pedido:', error);
    }
  };

  const handleStartEditObservation = (itemId: string) => {
    setEditingItemId(itemId);
    setTempObservacion(itemObservaciones[itemId] || '');
  };

  const handleSaveObservation = (itemId: string) => {
    if (tempObservacion.trim()) {
      setItemObservaciones(prev => ({
        ...prev,
        [itemId]: tempObservacion.trim()
      }));
    } else {
      const newObs = { ...itemObservaciones };
      delete newObs[itemId];
      setItemObservaciones(newObs);
    }
    setEditingItemId(null);
    setTempObservacion('');
  };

  const handleCancelEditObservation = () => {
    setEditingItemId(null);
    setTempObservacion('');
  };

  const handleDeleteObservation = (itemId: string) => {
    const newObs = { ...itemObservaciones };
    delete newObs[itemId];
    setItemObservaciones(newObs);
    setEditingItemId(null);
    setTempObservacion('');
  };

  // Modal de loading
  const LoadingModal = () => (
    <Modal
      visible={showLoading}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => setShowLoading(false)} // Para Android back button
    >
      <View style={styles.modalOverlay}>
        <View style={styles.loadingModalContent}>
          <ActivityIndicator color="#dc2626" size="large" />
          <Text style={styles.loadingText}>Procesando pedido...</Text>
          <Text style={styles.loadingSubtext}>Por favor espere</Text>
        </View>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      {/* Header fijo */}
      <View style={[styles.header, { paddingTop: safeAreaInsets.top + 10 }]}>
        <TouchableOpacity 
          onPress={() => router.back()}
          style={styles.backButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <ArrowLeft color="#1f2937" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmar Pedido</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Contenido scrolleable */}
      <ScrollView 
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Card de información de mesa */}
        <View style={styles.mesaCard}>
          <View style={styles.mesaCardHeader}>
            <ShoppingBag color="#dc2626" size={24} />
            <Text style={styles.mesaCardTitle}>Información del Pedido</Text>
          </View>
          <View style={styles.mesaCardBody}>
            <View style={styles.mesaCardRow}>
              <Text style={styles.mesaCardLabel}>Mesa:</Text>
              <Text style={styles.mesaCardValue}>{nombre}</Text>
            </View>
            <View style={styles.mesaCardRow}>
              <Text style={styles.mesaCardLabel}>Mesero:</Text>
              <Text style={styles.mesaCardValue}>{user?.correo?.split('@')[0]}</Text>
            </View>
            <View style={styles.mesaCardRow}>
              <Text style={styles.mesaCardLabel}>Items:</Text>
              <Text style={styles.mesaCardValue}>{items.length} productos</Text>
            </View>
          </View>
        </View>

        {/* Nombre del cliente */}
        <View style={styles.section}>
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <User color="#dc2626" size={20} />
              <Text style={styles.inputLabelText}>Nombre del Cliente *</Text>
            </View>
            <TextInput
              style={styles.textInput}
              placeholder="Ej: Juan Pérez"
              placeholderTextColor="#9ca3af"
              value={nombreCliente}
              onChangeText={setNombreCliente}
              autoCapitalize="words"
              returnKeyType="next"
            />
          </View>

          {/* Observaciones generales */}
          <View style={styles.inputGroup}>
            <View style={styles.inputLabel}>
              <MessageSquare color="#dc2626" size={20} />
              <Text style={styles.inputLabelText}>Observaciones del Pedido</Text>
            </View>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="Ej: Para llevar, sin picante, urgente..."
              placeholderTextColor="#9ca3af"
              value={observacionesPedido}
              onChangeText={setObservacionesPedido}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              returnKeyType="done"
            />
          </View>
        </View>

        {/* Resumen de items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumen del Pedido</Text>
          
          <View style={styles.itemsContainer}>
            {items.map((item) => (
              <View key={item.id}>
                <View style={styles.summaryItem}>
                  <View style={styles.summaryItemLeft}>
                    <View style={styles.qtyBadge}>
                      <Text style={styles.qtyBadgeText}>{item.cantidad}</Text>
                    </View>
                    <View style={styles.summaryItemDetails}>
                      <Text style={styles.summaryItemName}>{item.nombre}</Text>
                      {itemObservaciones[item.id] && (
                        <Text style={styles.summaryItemObs} numberOfLines={2}>
                          📝 {itemObservaciones[item.id]}
                        </Text>
                      )}
                    </View>
                  </View>
                  <View style={styles.summaryItemRight}>
                    <TouchableOpacity 
                      onPress={() => handleStartEditObservation(item.id)}
                      style={styles.editBtn}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <MessageSquare 
                        color={itemObservaciones[item.id] ? "#dc2626" : "#9ca3af"} 
                        size={20} 
                      />
                    </TouchableOpacity>
                    <Text style={styles.summaryItemPrice}>
                      S/. {(item.precio_unitario * item.cantidad).toFixed(2)}
                    </Text>
                  </View>
                </View>

                {/* Editor de observación inline */}
                {editingItemId === item.id && (
                  <View style={styles.observationEditor}>
                    <TextInput
                      style={styles.observationInput}
                      placeholder="Ej: Sin cebolla, bien cocido, extra salsa..."
                      placeholderTextColor="#9ca3af"
                      value={tempObservacion}
                      onChangeText={setTempObservacion}
                      multiline
                      autoFocus
                      returnKeyType="done"
                      blurOnSubmit
                    />
                    <View style={styles.observationActions}>
                      <TouchableOpacity
                        onPress={handleCancelEditObservation}
                        style={styles.observationBtnCancel}
                      >
                        <Text style={styles.observationBtnCancelText}>Cancelar</Text>
                      </TouchableOpacity>
                      {itemObservaciones[item.id] && (
                        <TouchableOpacity
                          onPress={() => handleDeleteObservation(item.id)}
                          style={styles.observationBtnDelete}
                        >
                          <Trash2 color="#ef4444" size={16} />
                        </TouchableOpacity>
                      )}
                      <TouchableOpacity
                        onPress={() => handleSaveObservation(item.id)}
                        style={styles.observationBtnSave}
                      >
                        <Text style={styles.observationBtnSaveText}>Guardar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            ))}
          </View>
          
          {/* Total */}
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total a Pagar:</Text>
            <Text style={styles.totalAmount}>S/. {totalPagar.toFixed(2)}</Text>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Footer fijo */}
      <View style={[styles.footer, { paddingBottom: safeAreaInsets.bottom + 16 }]}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => router.back()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.confirmButton,
            (saveMutationPedido.isPending || showLoading) && styles.confirmButtonDisabled
          ]}
          onPress={handleSubmitOrder}
          disabled={saveMutationPedido.isPending || showLoading}
        >
          {(saveMutationPedido.isPending || showLoading) ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Send color="#fff" size={20} />
              <Text style={styles.confirmButtonText}>Enviar a Cocina</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Modal de loading */}
      <LoadingModal />
    </View>
  );
};

// Los estilos se mantienen igual...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  // ... (todos los estilos anteriores se mantienen igual)
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 20,
  },
  mesaCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  mesaCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  mesaCardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  mesaCardBody: {
    gap: 12,
  },
  mesaCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mesaCardLabel: {
    fontSize: 15,
    color: '#6b7280',
    fontWeight: '500',
  },
  mesaCardValue: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '700',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  inputLabelText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#1f2937',
    backgroundColor: '#fff',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  itemsContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
  },
  summaryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  summaryItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  qtyBadge: {
    backgroundColor: '#fee2e2',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBadgeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  summaryItemDetails: {
    flex: 1,
  },
  summaryItemName: {
    fontSize: 15,
    color: '#1f2937',
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryItemObs: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  summaryItemRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  editBtn: {
    padding: 8,
  },
  summaryItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  observationEditor: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  observationInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  observationActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 12,
  },
  observationBtnCancel: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
  },
  observationBtnCancelText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  observationBtnDelete: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#fee2e2',
  },
  observationBtnSave: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#dc2626',
  },
  observationBtnSaveText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fef2f2',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#fecaca',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 20,
    gap: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#6b7280',
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#dc2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#dc2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  confirmButtonDisabled: {
    backgroundColor: '#d1d5db',
    shadowOpacity: 0,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingModalContent: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 32,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ConfirmOrder;