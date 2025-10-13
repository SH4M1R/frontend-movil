import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const categories = [
  'Promociones Especiales',
  'Camisetas',
  'Pantalones',
  'Vestidos',
  'Chaquetas',
  'Faldas',
  'Suéteres',
  'Ropa Deportiva',
];

const { width } = Dimensions.get('window');
const itemWidth = (width - 50) / 2; // 2 columnas con margen

export default function Categorias() {
  const router = useRouter();

  const renderCategory = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => alert(`Categoría: ${item}`)} // Aquí podrías navegar a otra pantalla filtrada
    >
      <Text style={styles.categoryText}>{item}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={categories}
        renderItem={renderCategory}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  categoryCard: {
    width: itemWidth,
    height: 80,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
