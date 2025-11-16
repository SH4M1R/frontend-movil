import { useStore } from "@/contexts/StoreContext";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function ModalFiltro() {
  const { categorias, filters, setFilters, filtroVisible, setFiltroVisible } =
    useStore();

  return (
    <Modal visible={filtroVisible} transparent animationType="slide">
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-3xl p-5 max-h-[70%]">
          <Text className="text-xl font-bold text-indigo-700 mb-4">
            Filtros
          </Text>

          <ScrollView>
            <Text className="text-lg font-semibold mb-2 text-gray-700">
              Categorías
            </Text>

            {categorias.map(cat => (
              <TouchableOpacity
                key={cat.idCategoria}
                className={`p-3 rounded-xl mb-3 border ${
                  filters.categoria === cat.idCategoria
                    ? "bg-indigo-500 border-indigo-600"
                    : "border-gray-300"
                }`}
                onPress={() =>
                  setFilters({
                    categoria:
                      filters.categoria === cat.idCategoria ? null : cat.idCategoria
                  })
                }
              >
                <Text
                  className={
                    filters.categoria === cat.idCategoria
                      ? "text-white font-semibold"
                      : "text-gray-700 font-semibold"
                  }
                >
                  {cat.categoria}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            className="bg-indigo-600 p-4 rounded-2xl mt-5"
            onPress={() => setFiltroVisible(false)}
          >
            <Text className="text-center text-white text-lg font-bold">
              Aplicar Filtros
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
