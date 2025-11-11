import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/database.types';
import { useCart } from '@/contexts/CartContext';
import ProductCard from '@/components/ProductCard';
import { useBebida } from '@/hooks/bebida/useBebida';
import BebidaCard from '@/components/BebidaCard';

export default function Drinks() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart()


  const queryBebida = useBebida()


  // useEffect(() => {
  //   loadProducts();
  // }, []);

  // const loadProducts = async () => {
  // try {
  //   const { data, error } = await supabase
  //     .from('products')
  //     .select('*')
  //     .eq('category', 'bebidas')
  //     .order('name');

  //   if (error) throw error;
  //   setProducts(data || []);
  // } catch (error: any) {
  //   Alert.alert('Error', 'No se pudo cargar las bebidas');
  // } finally {
  //   setLoading(false);
  // }
  // };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    Alert.alert('Éxito', `${product.name} agregado al carrito`);
  };

  if (queryBebida.isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e63946" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={queryBebida.data}
        keyExtractor={(item) => item.id_bebida.toString()}
        renderItem={({ item }) => (
          // <ProductCard product={item} onAddToCart={handleAddToCart} />
          <BebidaCard bebida={item} />

        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No hay bebidas disponibles</Text>
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
