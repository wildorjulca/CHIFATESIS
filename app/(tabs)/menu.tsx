import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Product } from '@/types/database.types';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard';
import { useMenu } from '@/hooks/menu/useMenu';

export default function Menu() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();


  const  queryMenu =  useMenu()

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    Alert.alert('Éxito', `${product.name} agregado al carrito`);
  };

  if (queryMenu.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e63946" />
      </View>
    );
  }

  console.log(queryMenu)
  return (
    <View style={styles.container}>
      <FlatList
        data={queryMenu.data}
        keyExtractor={(item) => item.id_menu.toString()}
        renderItem={({ item }) => (
          <ProductCard product={item}  />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay productos disponibles</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  list: {
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6c757d',
    marginTop: 32,
  },
});
