import { products as productsData } from '@/data/productos';
import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Animated, Dimensions, Easing, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const categories = ['Todos', 'Camisetas', 'Pantalones', 'Vestidos', 'Chaquetas', 'Faldas', 'Suéteres'];
const priceRanges = ['Todos', 'Menos de S/50', 'S/50 - S/100', 'Más de S/100'];
const { width } = Dimensions.get('window');
const itemWidth = (width - 40) / 2;

export default function ProductsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedPrice, setSelectedPrice] = useState('Todos');
  const [searchText, setSearchText] = useState('');
  const [filtersVisible, setFiltersVisible] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [cartVisible, setCartVisible] = useState(false);

  const drawerAnim = useRef(new Animated.Value(-width * 0.7)).current;

  const toggleFilters = () => {
    Animated.timing(drawerAnim, {
      toValue: filtersVisible ? -width * 0.7 : 0,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
    setFiltersVisible(!filtersVisible);
  };

  const filterByPrice = (product: any) => {
    if (selectedPrice === 'Todos') return true;
    if (selectedPrice === 'Menos de S/50') return product.price < 50;
    if (selectedPrice === 'S/50 - S/100') return product.price >= 50 && product.price <= 100;
    if (selectedPrice === 'Más de S/100') return product.price > 100;
    return true;
  };

  const filteredProducts = productsData
    .filter(p => selectedCategory === 'Todos' || p.category === selectedCategory)
    .filter(filterByPrice)
    .filter(p => p.name.toLowerCase().includes(searchText.toLowerCase()));

  const addToCart = (product: any) => {
    const existing = cart.find(p => p.id === product.id);
    if (existing) {
      setCart(cart.map(p => p.id === product.id ? { ...p, quantity: p.quantity + 1 } : p));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter(p => p.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(cart.map(p => {
      if (p.id === productId) {
        const newQty = p.quantity + delta;
        return { ...p, quantity: newQty > 0 ? newQty : 1 };
      }
      return p;
    }));
  };

  const getTotal = () => {
    return cart.reduce((sum, p) => sum + p.price * p.quantity, 0).toFixed(2);
  };

  const renderProduct = ({ item }: { item: any }) => (
    <View style={styles.productCard}>
      <Image source={item.image} style={styles.productImage} resizeMode="cover" />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>S/ {item.price}</Text>
      <TouchableOpacity style={styles.addButton} onPress={() => addToCart(item)}>
        <Ionicons name="add-circle" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#333" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Buscar productos..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
        <TouchableOpacity onPress={toggleFilters} style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCartVisible(true)} style={styles.cartButton}>
          <Ionicons name="cart" size={24} color="white" />
          {cart.length > 0 && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{cart.length}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />

      <Animated.View style={[styles.drawer, { left: drawerAnim }]}>
        <Text style={styles.drawerTitle}>Filtros</Text>

        <Text style={styles.drawerLabel}>Categoría</Text>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.drawerOption, selectedCategory === category && styles.drawerOptionSelected]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.drawerOptionText, selectedCategory === category && styles.drawerOptionTextSelected]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}

        <Text style={styles.drawerLabel}>Precio</Text>
        {priceRanges.map(range => (
          <TouchableOpacity
            key={range}
            style={[styles.drawerOption, selectedPrice === range && styles.drawerOptionSelected]}
            onPress={() => setSelectedPrice(range)}
          >
            <Text style={[styles.drawerOptionText, selectedPrice === range && styles.drawerOptionTextSelected]}>
              {range}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity onPress={toggleFilters} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Cerrar</Text>
        </TouchableOpacity>
      </Animated.View>

      <Modal visible={cartVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.cartModal}>
            <Text style={styles.cartTitle}>Carrito</Text>
            <ScrollView style={{ flex: 1 }}>
              {cart.length === 0 && <Text style={{ textAlign: 'center', marginTop: 20 }}>Carrito vacío</Text>}
              {cart.map(item => (
                <View key={item.id} style={styles.cartItem}>
                  <Text style={styles.cartItemName}>{item.name}</Text>
                  <View style={styles.cartItemControls}>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}><Text style={styles.qtyBtn}>-</Text></TouchableOpacity>
                    <Text style={styles.qtyText}>{item.quantity}</Text>
                    <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}><Text style={styles.qtyBtn}>+</Text></TouchableOpacity>
                    <Text style={styles.cartItemPrice}>S/ {(item.price * item.quantity).toFixed(2)}</Text>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                      <Ionicons name="trash" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
            <Text style={styles.totalText}>Total: S/ {getTotal()}</Text>
            <TouchableOpacity style={styles.checkoutButton}>
              <Text style={styles.checkoutButtonText}>Pagar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setCartVisible(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', borderRadius: 20, paddingHorizontal: 10, margin: 10, height: 40 },
  searchInput: { flex: 1, fontSize: 16 },
  filterButton: { marginLeft: 10, backgroundColor: '#007AFF', padding: 8, borderRadius: 20 },
  cartButton: { marginLeft: 10, backgroundColor: '#FF6B6B', padding: 8, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  cartBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: 'yellow', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center' },
  cartBadgeText: { fontSize: 10, fontWeight: 'bold' },
  listContent: { paddingBottom: 20 },
  row: { justifyContent: 'space-between', marginBottom: 15 },
  productCard: {
    width: itemWidth,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  productImage: { width: '100%', height: 120, borderRadius: 8, backgroundColor: '#ddd', marginBottom: 10 },
  productName: { fontSize: 14, marginBottom: 5 },
  productPrice: { fontSize: 16, color: '#007AFF', fontWeight: 'bold' },
  addButton: { position: 'absolute', bottom: 10, right: 10 },

  drawer: { position: 'absolute', top: 0, bottom: 0, width: width * 0.7, backgroundColor: 'white', padding: 20, elevation: 5, shadowColor: '#000', shadowOffset: { width: 2, height: 0 }, shadowOpacity: 0.2, shadowRadius: 4, zIndex: 100 },
  drawerTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20 },
  drawerLabel: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  drawerOption: { paddingVertical: 10, paddingHorizontal: 8, borderRadius: 8, marginVertical: 3, backgroundColor: '#f0f0f0' },
  drawerOptionSelected: { backgroundColor: '#007AFF' },
  drawerOptionText: { color: '#333' },
  drawerOptionTextSelected: { color: 'white' },
  closeButton: { marginTop: 20, backgroundColor: '#007AFF', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  closeButtonText: { color: 'white', fontWeight: '600', fontSize: 16 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  cartModal: { backgroundColor: 'white', height: '70%', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20 },
  cartTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  cartItem: { marginBottom: 15 },
  cartItemName: { fontSize: 16, fontWeight: '600' },
  cartItemControls: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 },
  qtyBtn: { fontSize: 20, width: 30, textAlign: 'center', color: '#007AFF' },
  qtyText: { fontSize: 16, fontWeight: '600', marginHorizontal: 5 },
  cartItemPrice: { fontSize: 16, fontWeight: 'bold', color: '#007AFF', marginLeft: 10 },
  totalText: { fontSize: 18, fontWeight: 'bold', textAlign: 'right', marginVertical: 10 },
  checkoutButton: { backgroundColor: '#007AFF', paddingVertical: 12, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  checkoutButtonText: { color: 'white', fontWeight: '600', fontSize: 16 },
});
