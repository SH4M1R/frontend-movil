import { useAuth } from "@/contexts/AuthContext";
import React, { useEffect, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity } from "react-native";

export default function EditarPerfilScreen() {
  const { user, actualizarPerfil } = useAuth();

  const [nombre, setNombre] = useState(user?.nombre || "");
  const [direccion, setDireccion] = useState(user?.direccion || "");
  const [telefono, setTelefono] = useState(user?.telefono || "");
  const [contrasena, setContrasena] = useState("");

  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setDireccion(user.direccion || "");
      setTelefono(user.telefono || "");
    }
  }, [user]);

  const handleActualizar = async () => {
    if (!nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }

    const datosActualizar: any = {
      nombre,
      direccion,
      telefono,
    };

    if (contrasena.trim()) datosActualizar.contrasena = contrasena;

    const actualizado = await actualizarPerfil(datosActualizar);

    if (actualizado) {
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      setContrasena("");
    } else {
      Alert.alert("Error", "No se pudo actualizar el perfil");
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-6">
      <Text className="text-lg font-semibold text-gray-700 mb-2">Nombre</Text>
      <TextInput
        value={nombre}
        onChangeText={setNombre}
        placeholder="Nombre"
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
      />

      <Text className="text-lg font-semibold text-gray-700 mb-2">Dirección</Text>
      <TextInput
        value={direccion}
        onChangeText={setDireccion}
        placeholder="Dirección"
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
      />

      <Text className="text-lg font-semibold text-gray-700 mb-2">Teléfono</Text>
      <TextInput
        value={telefono}
        onChangeText={setTelefono}
        placeholder="Teléfono"
        keyboardType="numeric"
        className="border border-gray-300 rounded-lg p-3 mb-4 bg-white"
      />

      <Text className="text-lg font-semibold text-gray-700 mb-2">Contraseña (opcional)</Text>
      <TextInput
        value={contrasena}
        onChangeText={setContrasena}
        placeholder="Contraseña"
        secureTextEntry
        className="border border-gray-300 rounded-lg p-3 mb-6 bg-white"
      />

      <TouchableOpacity
        onPress={handleActualizar}
        className="bg-indigo-600 py-4 rounded-xl items-center shadow-md"
      >
        <Text className="text-white font-bold text-lg">Actualizar Perfil</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
