import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
const { width } = Dimensions.get('window');

type Item = { image?: any; title: string; description?: string };

export default function HomeScreen() {
  const promoItems: Item[] = [
    { image: require('@/assets/img/promo1.jpg'), title: 'Descuento Especial', description: '¡Aprovecha hasta 50% de descuento!' },
    { image: require('@/assets/img/promo2.jpg'), title: 'Compra 1 y Lleva 2', description: 'Oferta válida solo hoy.' },
    { image: require('@/assets/img/promo3.jpg'), title: 'Envío Gratis', description: 'En pedidos mayores a S/ 50.00' },
  ];

  const productItems: Item[] = [
    { image: require('@/assets/img/product1.jpg'), title: 'Chaqueta Casual', description: 'Comodidad y estilo.' },
    { image: require('@/assets/img/product2.jpg'), title: 'Zapatillas Urbanas', description: 'Perfectas para caminar.' },
    { image: require('@/assets/img/product3.jpg'), title: 'Bolso Elegante', description: 'Complementa tu outfit.' },
  ];

  const categories: Item[] = [
    { title: 'Ropa', image: require('@/assets/img/product4.jpg') },
    { title: 'Calzado', image: require('@/assets/img/product5.jpg') },
    { title: 'Accesorios', image: require('@/assets/img/product6.jpg') },
    { title: 'Promociones', image: require('@/assets/img/product1.jpg') },
  ];

  const tips: Item[] = [
    { title: 'Combina colores neutros con accesorios llamativos.' },
    { title: 'Usa capas para un look más versátil.' },
    { title: 'Elige prendas cómodas pero con estilo.' },
  ];

  const [promoIndex, setPromoIndex] = useState(0);
  const [productIndex, setProductIndex] = useState(0);

  const promoRef = useRef<FlatList>(null);
  const productRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (promoIndex + 1) % promoItems.length;
      setPromoIndex(nextIndex);
      promoRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);
    return () => clearInterval(timer);
  }, [promoIndex]);

  const renderItem = (item: Item, showButton = false) => (
    <Animated.View entering={FadeIn} style={styles.card}>
      {item.image && <Image source={item.image} style={styles.cardImage} />}
      <Text style={styles.cardTitle}>{item.title}</Text>
      {item.description && <Text style={styles.cardDescription}>{item.description}</Text>}
      {showButton && (
        <TouchableOpacity style={styles.buyButton}>
          <Text style={styles.buyButtonText}>Comprar</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );

  const renderIndicator = (index: number, currentIndex: number) => (
    <View key={index} style={[styles.dot, { backgroundColor: index === currentIndex ? '#007AFF' : '#ccc' }]} />
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Promociones</Text>
      <FlatList
        data={promoItems}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        ref={promoRef}
        keyExtractor={(_, index) => 'promo-' + index}
        renderItem={({ item }) => renderItem(item)}
        onScroll={(e) => setPromoIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
      />
      <View style={styles.indicatorContainer}>
        {promoItems.map((_, index) => renderIndicator(index, promoIndex))}
      </View>

      <Text style={styles.sectionTitle}>Productos Destacados</Text>
      <FlatList
        data={productItems}
        horizontal
        showsHorizontalScrollIndicator={false}
        ref={productRef}
        keyExtractor={(_, index) => 'product-' + index}
        renderItem={({ item }) => renderItem(item, true)}
        onScroll={(e) => setProductIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
      />
      <View style={styles.indicatorContainer}>
        {productItems.map((_, index) => renderIndicator(index, productIndex))}
      </View>

      <Text style={styles.sectionTitle}>Categorías</Text>
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => 'cat-' + index}
        renderItem={({ item }) => (
          <View style={styles.categoryCard}>
            {item.image ? <Image source={item.image} style={styles.categoryImage} /> : <Ionicons name="shirt-outline" size={30} color="#007AFF" />}
            <Text style={styles.categoryText}>{item.title}</Text>
          </View>
        )}
      />

      <Text style={styles.sectionTitle}>Tips de Moda</Text>
      <FlatList
        data={tips}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => 'tip-' + index}
        renderItem={({ item }) => (
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>{item.title}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', paddingVertical: 10 },
  sectionTitle: { fontSize: 20, fontWeight: '600', color: '#333', marginLeft: 15, marginVertical: 10 },
  card: { width: width * 0.7, backgroundColor: 'white', borderRadius: 12, padding: 10, marginHorizontal: 10, elevation: 2, alignItems: 'center' },
  cardImage: { width: '100%', height: 120, borderRadius: 12, marginBottom: 5 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#007AFF', textAlign: 'center' },
  cardDescription: { fontSize: 14, color: '#555', marginVertical: 5, textAlign: 'center' },
  buyButton: { marginTop: 8, backgroundColor: '#007AFF', paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8 },
  buyButtonText: { color: 'white', fontWeight: '600' },
  dot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: 4 },
  indicatorContainer: { flexDirection: 'row', justifyContent: 'center', marginVertical: 8 },
  categoryCard: { width: 90, height: 90, backgroundColor: 'white', borderRadius: 12, marginHorizontal: 8, justifyContent: 'center', alignItems: 'center', elevation: 2 },
  categoryText: { marginTop: 5, fontSize: 14, fontWeight: '500', textAlign: 'center' },
  categoryImage: { width: 50, height: 50, borderRadius: 8 },
  tipCard: { width: 150, backgroundColor: '#e6f0ff', borderRadius: 12, marginHorizontal: 10, padding: 10, justifyContent: 'center', alignItems: 'center' },
  tipText: { fontSize: 14, color: '#007AFF', textAlign: 'center' },
});
