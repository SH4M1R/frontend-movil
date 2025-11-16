import ModalFiltro from "@/components/ModalFiltro";
import ProductCard from "@/components/ProductCard";
import { useStore } from "@/contexts/StoreContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo } from "react";
import { FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Productos() {
  const { productos, filters, setFilters, setFiltroVisible } = useStore();

  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      const coincideCategoria =
        filters.categoria ? p.categoria.idCategoria === filters.categoria : true;

      const coincideTexto = p.producto
        .toLowerCase()
        .includes(filters.searchText.toLowerCase());

      return coincideCategoria && coincideTexto;
    });
  }, [productos, filters]);

  return (
    <View className="flex-1 bg-gray-100 px-4 pt-5">
      <Text className="text-2xl font-bold text-indigo-700 mb-2">
        Catálogo de Productos
      </Text>

      {/* SEARCH */}
      <View className="flex-row items-center bg-white p-3 rounded-2xl shadow mb-4">
        <Ionicons name="search" size={20} color="#4F46E5" />
        <TextInput
          placeholder="Buscar producto..."
          className="ml-2 flex-1 text-gray-700"
          value={filters.searchText}
          onChangeText={(text) => setFilters({ searchText: text })}
        />

        {/* BOTÓN FILTRO */}
        <TouchableOpacity onPress={() => setFiltroVisible(true)}>
          <Ionicons name="options" size={26} color="#4F46E5" />
        </TouchableOpacity>
      </View>

      {/* LISTA DE PRODUCTOS */}
      <FlatList
        data={productosFiltrados}
        keyExtractor={(item) => item.idProducto.toString()}
        numColumns={2}        
        columnWrapperStyle={{ gap: 12 }} 
        contentContainerStyle={{ gap: 12 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <ProductCard
            item={item}
            onPress={() => console.log("VER DETALLE", item.producto)}
          />
        )}
        ListEmptyComponent={
          <Text className="text-center text-gray-600 mt-10">
            No se encontraron productos.
          </Text>
        }
      />

      {/* MODAL */}
      <ModalFiltro />
    </View>
  );
}
