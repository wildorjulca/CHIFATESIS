import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Menu } from '@/types/menu.types';
import { Bebida } from '@/types/bebida.types';

interface BebidaCardProps {
  bebida: Bebida;
  // onAddToCart?: (product: Menu) => void;
}

export default function BebidaCard({ bebida  }: BebidaCardProps) {
  return (
    <View style={styles.card}>
     
      
      {/* Información en el centro */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {bebida.nombre_bebida}
        </Text>
        <Text style={styles.description} numberOfLines={2}>
          {bebida.descripcion}
        </Text>
        
       
        
        <Text style={styles.price}>S/ {Number(bebida.precio).toFixed(2)}</Text>
      </View>

      {/* Botón a la derecha */}
      <TouchableOpacity
        style={styles.addButton}
        // onPress={() => onAddToCart?.(product)}
      >
        <Plus color="#fff" size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#343a40',
    marginBottom: 4,
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    color: '#6c757d',
    marginBottom: 8,
    lineHeight: 16,
  },
  details: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  time: {
    fontSize: 12,
    color: '#6c757d',
    fontWeight: '500',
  },
  ofertaTag: {
    backgroundColor: '#e63946',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  ofertaText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e63946',
  },
  addButton: {
    backgroundColor: '#e63946',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#e63946',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
});