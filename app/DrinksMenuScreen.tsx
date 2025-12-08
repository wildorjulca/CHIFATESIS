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
import { useBebida } from '@/hooks/bebida/useBebida';
import BebidaCard from '@/components/BebidaCard';
import { Milk } from 'lucide-react-native';

export default function DrinksMenuScreen() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart()


    const queryBebida = useBebida()

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

            <View style={styles.header}>
                <View style={styles.headerTitle}>
                    <Milk size={28} color="#e63946" />
                    <Text style={styles.headerText}>Gestion de Bebidas</Text>
                </View>
                <Text style={styles.subHeader}>Administrar bebidas</Text>
            </View>


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
    header: {
        backgroundColor: '#fff',
        padding: 20,
        paddingTop: 60,
        borderBottomWidth: 1,
        borderBottomColor: '#e9ecef',
    },
    headerTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 4,
    },
    headerText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#343a40',
    },
    subHeader: {
        fontSize: 14,
        color: '#6c757d',
    },
});