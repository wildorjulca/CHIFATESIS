// =====================================================
// PASO 3: TOMAR PEDIDO (MENÚ)
// Componente: OrderMenuScreen.tsx
// =====================================================

import { View } from "lucide-react-native";
import { ScrollView, StyleSheet, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OrderMenuScreen = () => {
  // DATOS SIMULADOS
  const MENU_PLATOS = [
    { id: 1, name: 'Lomo Saltado', price: 25.0, image: '🥩', category: 'Plato' },
    { id: 2, name: 'Ceviche', price: 30.0, image: '🐟', category: 'Plato' },
    { id: 3, name: 'Arroz con Pollo', price: 20.0, image: '🍗', category: 'Plato' },
    { id: 4, name: 'Tacu Tacu', price: 22.0, image: '🍛', category: 'Plato' },
  ];

  const MENU_BEBIDAS = [
    { id: 5, name: 'Inca Kola', price: 5.0, image: '🥤', category: 'Bebida' },
    { id: 6, name: 'Chicha Morada', price: 4.0, image: '🍹', category: 'Bebida' },
    { id: 7, name: 'Limonada', price: 4.5, image: '🍋', category: 'Bebida' },
    { id: 8, name: 'Agua Mineral', price: 3.0, image: '💧', category: 'Bebida' },
  ];

  // Pedido simulado
  const pedidoActual = [
    { id: 1, name: 'Lomo Saltado', price: 25.0, quantity: 1 },
    { id: 5, name: 'Inca Kola', price: 5.0, quantity: 2 },
  ];

  const mesaInfo = { name: 'Mesa 1' };
  const clienteInfo = 'Juan Pérez';
  const total = 35.0;

  return (
    <SafeAreaView style={stylesStep3.container}>
      <View style={stylesStep3.mainContainer}>
        {/* PANEL IZQUIERDO: MENÚ */}
        <ScrollView style={stylesStep3.menuPanel}>
          {/* PLATOS */}
          <View style={stylesStep3.section}>
            <Text style={stylesStep3.sectionTitle}>🍽️ Platos</Text>
            {MENU_PLATOS.map((item) => (
              <View key={item.id} style={stylesStep3.menuItem}>
                <View style={stylesStep3.menuItemInfo}>
                  <Text style={stylesStep3.menuItemIcon}>{item.image}</Text>
                  <View style={stylesStep3.menuItemDetails}>
                    <Text style={stylesStep3.menuItemName}>{item.name}</Text>
                    <Text style={stylesStep3.menuItemPrice}>
                      S/. {item.price.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={stylesStep3.addButton}>
                  <Text style={stylesStep3.addButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* BEBIDAS */}
          <View style={stylesStep3.section}>
            <Text style={stylesStep3.sectionTitle}>🥤 Bebidas</Text>
            {MENU_BEBIDAS.map((item) => (
              <View key={item.id} style={stylesStep3.menuItem}>
                <View style={stylesStep3.menuItemInfo}>
                  <Text style={stylesStep3.menuItemIcon}>{item.image}</Text>
                  <View style={stylesStep3.menuItemDetails}>
                    <Text style={stylesStep3.menuItemName}>{item.name}</Text>
                    <Text style={stylesStep3.menuItemPrice}>
                      S/. {item.price.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={stylesStep3.addButton}>
                  <Text style={stylesStep3.addButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* PANEL DERECHO: PEDIDO ACTUAL */}
        <View style={stylesStep3.orderPanel}>
          <Text style={stylesStep3.orderTitle}>🛒 Pedido Actual</Text>

          <View style={stylesStep3.orderInfo}>
            <Text style={stylesStep3.orderInfoText}>📍 {mesaInfo.name}</Text>
            <Text style={stylesStep3.orderInfoText}>👤 {clienteInfo}</Text>
          </View>

          <View style={stylesStep3.divider} />

          <ScrollView style={stylesStep3.orderItems}>
            {pedidoActual.map((item) => (
              <View key={item.id} style={stylesStep3.orderItem}>
                <View style={stylesStep3.orderItemInfo}>
                  <Text style={stylesStep3.orderItemQty}>{item.quantity}x</Text>
                  <View>
                    <Text style={stylesStep3.orderItemName}>{item.name}</Text>
                    <Text style={stylesStep3.orderItemPrice}>
                      S/. {(item.price * item.quantity).toFixed(2)}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={stylesStep3.removeButton}>
                  <Text style={stylesStep3.removeButtonText}>−</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>

          <View style={stylesStep3.divider} />

          <View style={stylesStep3.totalContainer}>
            <Text style={stylesStep3.totalLabel}>TOTAL:</Text>
            <Text style={stylesStep3.totalAmount}>S/. {total.toFixed(2)}</Text>
          </View>

          <TouchableOpacity style={stylesStep3.continueButton}>
            <Text style={stylesStep3.continueButtonText}>
              Continuar al Pago →
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default  OrderMenuScreen

const stylesStep3 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff5f1',
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  menuPanel: {
    flex: 2,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  menuItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    fontSize: 40,
    marginRight: 12,
  },
  menuItemDetails: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  menuItemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ea580c',
  },
  addButton: {
    backgroundColor: '#ea580c',
    width: 40,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  orderPanel: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderLeftWidth: 2,
    borderColor: '#e5e7eb',
  },
  orderTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  orderInfo: {
    backgroundColor: '#fff7ed',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  orderInfoText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  divider: {
    height: 2,
    backgroundColor: '#e5e7eb',
    marginVertical: 16,
  },
  orderItems: {
    flex: 1,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  orderItemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderItemQty: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ea580c',
    marginRight: 8,
    width: 30,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  orderItemPrice: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  removeButton: {
    backgroundColor: '#fee2e2',
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  totalAmount: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ea580c',
  },
  continueButton: {
    backgroundColor: '#ea580c',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});
