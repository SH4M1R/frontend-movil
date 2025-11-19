import { useAuth } from "@/contexts/AuthContext";
import * as Location from "expo-location";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function EditarPerfilScreen() {
  const { user, actualizarPerfil } = useAuth();

  const [nombre, setNombre] = useState(user?.nombre || "");
  const [direccion, setDireccion] = useState(user?.direccion || "");
  const [telefono, setTelefono] = useState(user?.telefono || "");
  const [contrasena, setContrasena] = useState("");

  const [loadingUbicacion, setLoadingUbicacion] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);

  useEffect(() => {
    if (user) {
      setNombre(user.nombre);
      setDireccion(user.direccion || "");
      setTelefono(user.telefono || "");
    }
  }, [user]);

  const obtenerUbicacion = async () => {
    try {
      setLoadingUbicacion(true);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "No se puede obtener la ubicación sin permisos.");
        setLoadingUbicacion(false);
        return;
      }

      const ubicacion = await Location.getCurrentPositionAsync({});
      const lat = ubicacion.coords.latitude;
      const lon = ubicacion.coords.longitude;

      setCoords({ lat, lon });

      const geocode = await Location.reverseGeocodeAsync({
        latitude: lat,
        longitude: lon,
      });

      if (geocode.length > 0) {
        const info = geocode[0];

        const direccionCompleta = `${info.street || ""} ${info.name || ""}, ${info.district || ""}, ${info.city || ""}`;

        setDireccion(direccionCompleta.trim());
      } else {
        Alert.alert("Error", "No se pudo obtener la dirección.");
      }

    } catch (error) {
      console.log("Error obteniendo ubicación:", error);
      Alert.alert("Error", "No se pudo obtener la ubicación.");
    } finally {
      setLoadingUbicacion(false);
    }
  };

  useEffect(() => {
    obtenerUbicacion();
  }, []);

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

      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-semibold text-gray-700">Dirección (automática)</Text>
        <TouchableOpacity
          onPress={obtenerUbicacion}
          className="bg-indigo-500 px-3 py-1 rounded-lg"
        >
          <Text className="text-white">Actualizar</Text>
        </TouchableOpacity>
      </View>

      {loadingUbicacion ? (
        <ActivityIndicator size="large" color="#4F46E5" className="my-4" />
      ) : (
        <TextInput
          value={direccion}
          editable={false}
          placeholder="Obteniendo dirección..."
          className="border border-gray-300 rounded-lg p-3 mb-4 bg-gray-200 text-gray-600"
        />
      )}

      {coords && (
        <Text className="text-gray-500 mb-4">
          Lat: {coords.lat.toFixed(4)} | Lon: {coords.lon.toFixed(4)}
        </Text>
      )}

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
