import { bodyPedido } from '@/action/pedido/pedido';
import { useBebida } from '@/hooks/bebida/useBebida';
import { useMenu } from '@/hooks/menu/useMenu';
import { useAuthStore } from '@/store/auth/auth-store';
import { ItemCarrito, useCartStore } from '@/store/cart/cart-store';
import { Bebida } from '@/types/bebida.types';
import { Menu } from '@/types/menu.types';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Clock,
  Send,
} from 'lucide-react-native';

const ImprovedOrderMenu = () => {
  const { id_mesa, nombre } = useLocalSearchParams();
  const [activeCategory, setActiveCategory] = useState<'Platos' | 'Bebidas' | 'Postres'>('Platos');
  const { items, agregarItem, eliminarItem } = useCartStore();
  const { totalItems, totalPagar } = useCartStore.getState().getSumaryInformation();
  const { user } = useAuthStore();

  const safeAreaInsets = useSafeAreaInsets();
  const queryMenu = useMenu();
  const queryBebida = useBebida();

  const handlePrepareOrder = () => {
    if (items.length === 0) {
      Alert.alert('Carrito vacío', 'Agrega items antes de ordenar');
      return;
    }
    // Navegar a la página de confirmación
    router.push({
      pathname: '/ConfirmOrder',
      params: {
        id_mesa: id_mesa,
        nombre: nombre,
      }
    });
  };

  // Barra inferior fija del pedido
  const FixedOrderBar = () => (
    <View style={styles.fixedOrderBar}>
      <View style={styles.orderSummary}>
        <View style={styles.orderHeader}>
          <Text style={styles.orderTitle}>Pedido Actual</Text>
          <View style={styles.orderMeta}>
            <Text style={styles.orderMetaText}>📍 {nombre}</Text>
            <Text style={styles.orderMetaText}>👤 {user?.correo?.split('@')[0]}</Text>
          </View>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyOrder}>
            <Text style={styles.emptyOrderText}>No hay items en el pedido</Text>
          </View>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.orderItemsScroll}
          >
            <View style={styles.orderItemsRow}>
              {items.map((item) => (
                <View key={item.id} style={styles.orderItemChip}>
                  <View style={styles.chipLeft}>
                    <Text style={styles.chipQty}>{item.cantidad}</Text>
                    <Text style={styles.chipName} numberOfLines={1}>
                      {item.nombre}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.chipRemove}
                    onPress={() => eliminarItem(item.id)}
                  >
                    <Text style={styles.chipRemoveText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>

      <View style={styles.orderActions}>
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>S/. {totalPagar.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={[
            styles.payButton,
            items.length === 0 && styles.payButtonDisabled
          ]}
          disabled={items.length === 0}
          onPress={handlePrepareOrder}
        >
          <Send color="#fff" size={20} />
          <Text style={styles.payButtonText}>
            {items.length === 0 ? 'ORDENAR' : `ORDENAR (${totalItems})`}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { paddingBottom: safeAreaInsets.bottom }]}>
      {/* HEADER CON TABS */}
      <View style={styles.header}>
        <View style={styles.tabsContainer}>
          {['Platos', 'Bebidas', 'Postres'].map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.tab,
                activeCategory === category && styles.tabActive
              ]}
              onPress={() => setActiveCategory(category as any)}
            >
              <Text style={[
                styles.tabText,
                activeCategory === category && styles.tabTextActive
              ]}>
                {category}
              </Text>
              {activeCategory === category && (
                <View style={styles.tabIndicator} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* CONTENIDO DEL MENÚ */}
      <ScrollView
        style={styles.menuScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuContainer}
      >
        {activeCategory === 'Platos' ? (
          <>
            {queryMenu.isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#dc2626" />
                <Text style={styles.loadingText}>Cargando platos...</Text>
              </View>
            )}

            {queryMenu.data?.map((item: Menu) => (
              <TouchableOpacity
                key={item.id_menu}
                style={styles.menuItem}
                onPress={() => {
                  agregarItem(
                    {
                      id_menu: item.id_menu,
                      nombre_plato: item.nombre_plato,
                      precio: Number(item.precio),
                      categoria: item.categoria,
                      disponible: item.disponible,
                    },
                    "menu"
                  );
                }}
              >
                <Image
                  style={styles.menuItemImage}
                  source={{
                    uri: item.imagen_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80'
                  }}
                  resizeMode="cover"
                />
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.nombre_plato}</Text>
                  <Text style={styles.menuItemDescription} numberOfLines={2}>
                    {item.descripcion || 'Plato tradicional peruano'}
                  </Text>
                  {item.tiempo_preparacion && (
                    <View style={styles.prepTime}>
                      <Clock color="#6b7280" size={14} />
                      <Text style={styles.prepTimeText}>{item.tiempo_preparacion} min</Text>
                    </View>
                  )}
                  <Text style={styles.menuItemPrice}>S/. {item.precio}</Text>
                </View>
                <View style={styles.addButton}>
                  <Text style={styles.addButtonText}>+</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : activeCategory === 'Bebidas' ? (
          <>
            {queryBebida.isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#dc2626" />
                <Text style={styles.loadingText}>Cargando bebidas...</Text>
              </View>
            )}
            {queryBebida.data?.map((item: Bebida) => (
              <TouchableOpacity
                key={item.id_bebida}
                style={styles.menuItem}
                onPress={() => {
                  agregarItem(
                    {
                      id_bebida: item.id_bebida,
                      nombre_bebida: item.nombre_bebida,
                      precio: Number(item.precio),
                      categoria: item.categoria,
                      disponible: item.disponible,
                    },
                    "bebida"
                  );
                }}
              >
                <Image
                  style={styles.menuItemImage}
                  source={{
                    uri: item.imagen_url || 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&q=80'
                  }}
                  resizeMode="cover"
                />
                <View style={styles.menuItemInfo}>
                  <Text style={styles.menuItemName}>{item.nombre_bebida}</Text>
                  <Text style={styles.menuItemDescription}>
                    {item.descripcion || 'Bebida refrescante'}
                  </Text>
                  {item.tamano && (
                    <Text style={styles.sizeText}>Tamaño: {item.tamano}</Text>
                  )}
                  <Text style={styles.menuItemPrice}>S/. {item.precio}</Text>
                </View>
                <View style={styles.addButton}>
                  <Text style={styles.addButtonText}>+</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <View style={styles.emptyCategory}>
            <Text style={styles.emptyCategoryIcon}>🍰</Text>
            <Text style={styles.emptyCategoryTitle}>Postres</Text>
            <Text style={styles.emptyCategoryText}>
              Próximamente tendremos deliciosos postres
            </Text>
          </View>
        )}
      </ScrollView>

      {/* BARRA INFERIOR FIJA DEL PEDIDO */}
      <FixedOrderBar />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  // HEADER Y TABS
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingTop: 50,
  },

  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
  },

  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'relative',
  },

  tabActive: {},

  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
  },

  tabTextActive: {
    color: '#dc2626',
    fontWeight: '700',
  },

  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    width: '80%',
    height: 3,
    backgroundColor: '#dc2626',
    borderRadius: 2,
  },

  // CONTENIDO DEL MENÚ
  menuScroll: {
    flex: 1,
  },

  menuContainer: {
    padding: 16,
    paddingBottom: 200,
  },

  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6b7280',
  },

  menuItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },

  menuItemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },

  menuItemInfo: {
    flex: 1,
    paddingHorizontal: 12,
    justifyContent: 'center',
  },

  menuItemName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },

  menuItemDescription: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 6,
  },

  prepTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },

  prepTimeText: {
    fontSize: 12,
    color: '#6b7280',
  },

  sizeText: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },

  menuItemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc2626',
  },

  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#dc2626',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },

  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  emptyCategory: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 60,
  },

  emptyCategoryIcon: {
    fontSize: 64,
    marginBottom: 16,
  },

  emptyCategoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },

  emptyCategoryText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },

  // BARRA INFERIOR FIJA
  fixedOrderBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderTopColor: '#e5e7eb',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },

  orderSummary: {
    marginBottom: 12,
  },

  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },

  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },

  orderMeta: {
    alignItems: 'flex-end',
  },

  orderMetaText: {
    fontSize: 12,
    color: '#6b7280',
  },

  emptyOrder: {
    paddingVertical: 20,
    alignItems: 'center',
  },

  emptyOrderText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
  },

  orderItemsScroll: {
    flexGrow: 0,
  },

  orderItemsRow: {
    flexDirection: 'row',
    gap: 8,
  },

  orderItemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },

  chipLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },

  chipQty: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#dc2626',
    marginRight: 6,
  },

  chipName: {
    fontSize: 14,
    color: '#1f2937',
    maxWidth: 100,
  },

  chipRemove: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  chipRemoveText: {
    fontSize: 14,
    color: '#dc2626',
    fontWeight: 'bold',
  },

  orderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  totalSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginRight: 8,
  },

  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#dc2626',
  },

  payButton: {
    backgroundColor: '#dc2626',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 140,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  payButtonDisabled: {
    backgroundColor: '#d1d5db',
  },

  payButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ImprovedOrderMenu;