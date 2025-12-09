// import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useCart } from '@/contexts/CartContext';
// import { Trash2, Plus, Minus } from 'lucide-react-native';

// export default function Cart() {
//   const { cart, removeFromCart, updateQuantity, clearCart, getTotal } = useCart();
//   const router = useRouter();

//   const renderItem = ({ item }: any) => (
//     <View style={styles.item}>
//       <View style={styles.itemInfo}>
//         <Text style={styles.itemName}>{item.name}</Text>
//         <Text style={styles.itemPrice}>S/ {item.price.toFixed(2)}</Text>
//       </View>

//       <View style={styles.quantityContainer}>
//         <TouchableOpacity
//           style={styles.quantityButton}
//           onPress={() => updateQuantity(item.id, item.quantity - 1)}
//         >
//           <Minus color="#fff" size={16} />
//         </TouchableOpacity>

//         <Text style={styles.quantity}>{item.quantity}</Text>

//         <TouchableOpacity
//           style={styles.quantityButton}
//           onPress={() => updateQuantity(item.id, item.quantity + 1)}
//         >
//           <Plus color="#fff" size={16} />
//         </TouchableOpacity>
//       </View>

//       <View style={styles.itemRight}>
//         <Text style={styles.itemTotal}>
//           S/ {(item.price * item.quantity).toFixed(2)}
//         </Text>
//         <TouchableOpacity
//           style={styles.deleteButton}
//           onPress={() => removeFromCart(item.id)}
//         >
//           <Trash2 color="#dc3545" size={20} />
//         </TouchableOpacity>
//       </View>
//     </View>
//   );

//   return (
//     <View style={styles.container}>
//       {cart.length === 0 ? (
//         <View style={styles.emptyContainer}>
//           <Text style={styles.emptyText}>El carrito está vacío</Text>
//         </View>
//       ) : (
//         <>
//           <FlatList
//             data={cart}
//             keyExtractor={(item) => item.id}
//             renderItem={renderItem}
//             contentContainerStyle={styles.list}
//           />

//           <View style={styles.footer}>
//             <View style={styles.totalContainer}>
//               <Text style={styles.totalLabel}>Total:</Text>
//               <Text style={styles.totalAmount}>S/ {getTotal().toFixed(2)}</Text>
//             </View>

//             <TouchableOpacity
//               style={styles.confirmButton}
//             >
//               <Text style={styles.confirmButtonText}>Confirmar Pedido</Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               style={styles.clearButton}
//               onPress={() => {
//                 Alert.alert(
//                   'Vaciar carrito',
//                   '¿Estás seguro de vaciar el carrito?',
//                   [
//                     { text: 'Cancelar', style: 'cancel' },
//                     { text: 'Vaciar', onPress: clearCart, style: 'destructive' },
//                   ]
//                 );
//               }}
//             >
//               <Text style={styles.clearButtonText}>Vaciar Carrito</Text>
//             </TouchableOpacity>
//           </View>
//         </>
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f8f9fa',
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   emptyText: {
//     fontSize: 18,
//     color: '#6c757d',
//   },
//   list: {
//     padding: 16,
//   },
//   item: {
//     backgroundColor: '#fff',
//     borderRadius: 12,
//     padding: 16,
//     marginBottom: 12,
//     flexDirection: 'row',
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 3,
//   },
//   itemInfo: {
//     flex: 1,
//   },
//   itemName: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#343a40',
//     marginBottom: 4,
//   },
//   itemPrice: {
//     fontSize: 14,
//     color: '#6c757d',
//   },
//   quantityContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//     marginRight: 12,
//   },
//   quantityButton: {
//     backgroundColor: '#e63946',
//     width: 28,
//     height: 28,
//     borderRadius: 14,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   quantity: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#343a40',
//     minWidth: 24,
//     textAlign: 'center',
//   },
//   itemRight: {
//     alignItems: 'flex-end',
//   },
//   itemTotal: {
//     fontSize: 16,
//     fontWeight: '700',
//     color: '#e63946',
//     marginBottom: 8,
//   },
//   deleteButton: {
//     padding: 4,
//   },
//   footer: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderTopWidth: 1,
//     borderTopColor: '#dee2e6',
//   },
//   totalContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 16,
//   },
//   totalLabel: {
//     fontSize: 20,
//     fontWeight: '700',
//     color: '#343a40',
//   },
//   totalAmount: {
//     fontSize: 24,
//     fontWeight: '700',
//     color: '#e63946',
//   },
//   confirmButton: {
//     backgroundColor: '#e63946',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     marginBottom: 8,
//   },
//   confirmButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: '700',
//   },
//   clearButton: {
//     backgroundColor: '#fff',
//     padding: 16,
//     borderRadius: 12,
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: '#dc3545',
//   },
//   clearButtonText: {
//     color: '#dc3545',
//     fontSize: 16,
//     fontWeight: '700',
//   },
// });
