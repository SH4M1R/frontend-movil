import { FlatList, StyleSheet, Image, TouchableOpacity, Dimensions, Animated, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useState, useRef, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

const products = [
  { id: '1', name: 'Camiseta Básica', price: '$29.99', image: require('@/assets/images/product1.jpg'), category: 'Camisetas' },
  { id: '2', name: 'Jeans Slim Fit', price: '$39.99', image: require('@/assets/images/product2.jpg'), category: 'Pantalones' },
  { id: '3', name: 'Vestido Casual', price: '$19.99', image: require('@/assets/images/product3.jpg'), category: 'Vestidos' },
  { id: '4', name: 'Chaqueta Denim', price: '$49.99', image: require('@/assets/images/product4.jpg'), category: 'Chaquetas' },
  { id: '5', name: 'Falda Elegante', price: '$59.99', image: require('@/assets/images/product5.jpg'), category: 'Faldas' },
  { id: '6', name: 'Suéter de Lana', price: '$25.99', image: require('@/assets/images/product6.jpg'), category: 'Suéteres' },
];

const categories = ['Todos', 'Camisetas', 'Pantalones', 'Vestidos', 'Chaquetas', 'Faldas', 'Suéteres'];

const { width } = Dimensions.get('window');
const itemWidth = (width - 40) / 2;

export default function ProductsScreen() {
  const [animationsReady, setAnimationsReady] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const slideAnims = useRef(products.map(() => new Animated.Value(50))).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const filteredProducts = selectedCategory === 'Todos' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  useEffect(() => {
    const animations = filteredProducts.map((_, index) => {
      return Animated.sequence([
        Animated.delay(index * 100),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnims[index], {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          })
        ])
      ]);
    });

    Animated.stagger(100, animations).start();
    setAnimationsReady(true);
  }, [selectedCategory]);

  const renderProduct = ({ item, index }: { item: any; index: number }) => {
    if (!animationsReady) return null;

    return (
      <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnims[index] }] }}>
        <TouchableOpacity style={styles.productCard}>
          <Image source={item.image} style={styles.productImage} resizeMode="cover" />
          <ThemedText type="defaultSemiBold" style={styles.productName}>
            {item.name}
          </ThemedText>
          <ThemedText type="default" style={styles.productPrice}>
            {item.price}
          </ThemedText>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add-circle" size={24} color="#007AFF" />
          </TouchableOpacity>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={styles.title}>
        Nuestra Colección
      </ThemedText>

      <View style={styles.categoriesContainer}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonSelected]}
            onPress={() => setSelectedCategory(category)}
          >
            <ThemedText type="default" style={[styles.categoryText, selectedCategory === category && styles.categoryTextSelected]}>
              {category}
            </ThemedText>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    margin: 5,
  },
  categoryButtonSelected: {
    backgroundColor: '#007AFF',
  },
  categoryText: {
    color: '#333',
  },
  categoryTextSelected: {
    color: 'white',
  },
  listContent: {
    paddingBottom: 20,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
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
  productImage: {
    width: '100%',
    height: 120,
    borderRadius: 8,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
  },
});