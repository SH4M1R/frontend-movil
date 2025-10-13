import { products as productsData } from '@/data/productos';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const categories = ['Todos', 'Camisetas', 'Pantalones', 'Vestidos', 'Chaquetas', 'Faldas', 'Suéteres'];
const { width } = Dimensions.get('window');
const itemWidth = (width - 40) / 2;

export default function ProductsScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [searchText, setSearchText] = useState('');

  const filteredProducts = productsData
    .filter(p => selectedCategory === 'Todos' || p.category === selectedCategory)
    .filter(p => p.name.toLowerCase().includes(searchText.toLowerCase()));

  const renderProduct = ({ item }: { item: any }) => (
  <View style={styles.productCard}>
    <Image source={item.image} style={styles.productImage} resizeMode="cover" />
    <Text style={styles.productName}>{item.name}</Text>
    <Text style={styles.productPrice}>{item.price}</Text>
    <TouchableOpacity style={styles.addButton}>
      <Ionicons name="add-circle" size={24} color="#007AFF" />
    </TouchableOpacity>
  </View>
);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nuestra Colección</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#333" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Buscar productos..."
          value={searchText}
          onChangeText={setSearchText}
          style={styles.searchInput}
        />
      </View>

      <View style={styles.categoriesContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonSelected]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={[styles.categoryText, selectedCategory === category && styles.categoryTextSelected]}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginVertical: 20 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', borderRadius: 20, paddingHorizontal: 10, marginBottom: 15, height: 40 },
  searchInput: { flex: 1, fontSize: 16 },
  categoriesContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 },
  categoryButton: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f0f0f0', margin: 5 },
  categoryButtonSelected: { backgroundColor: '#007AFF' },
  categoryText: { color: '#333' },
  categoryTextSelected: { color: 'white' },
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
  productImage: { width: '100%', height: 120, borderRadius: 8, backgroundColor: '#ddd', marginBottom: 10 }, // Imagen vacía
  productName: { fontSize: 14, marginBottom: 5 },
  productPrice: { fontSize: 16, color: '#007AFF', fontWeight: 'bold' },
  addButton: { position: 'absolute', bottom: 10, right: 10 },
});
