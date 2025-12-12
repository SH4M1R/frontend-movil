import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase/firabaseConfig';

const BASE_URL = 'http://10.248.48.237:8500';

// Estructura del usuario
type User = {
  idUsuario: number;
  nombre: string;
  correo: string;
  direccion?: string;
  telefono?: string;
  token: string;
  rol: 'cliente' | 'delivery' | 'invitado';
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (correo: string, contrasena: string) => Promise<boolean>;
  register: (nombre: string, correo: string, contrasena: string) => Promise<boolean>;
  logout: () => Promise<void>;
  actualizarPerfil: (datos: Partial<User & { contrasena?: string }>) => Promise<User | null>;
  requestPasswordReset: (correo: string) => Promise<boolean>;
  resetPassword: (correo: string, codigo: string, nuevaContrasena: string) => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  actualizarPerfil: async () => null,
  requestPasswordReset: async () => false,
  resetPassword: async () => false,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Cargar usuario almacenado
  useEffect(() => {
    const loadUser = async () => {
      try {
        const json = await AsyncStorage.getItem('user');
        if (json) setUser(JSON.parse(json));
      } catch (error) {
        console.log('Error al cargar usuario:', error);
      }
    };
    loadUser();
  }, []);

  // LOGIN CORREGIDO – USA SOLO TU BACKEND
  const login = async (correo: string, contrasena: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena })
      });

      if (!res.ok) {
        Alert.alert("Credenciales incorrectas");
        return false;
      }

      const data = await res.json();

      // Backend ya devuelve rol = "cliente" o "delivery"
      const userData: User = {
        idUsuario: data.usuario.idUsuario,
        nombre: data.usuario.nombre,
        correo: data.usuario.correo,
        direccion: data.usuario.direccion || "",
        telefono: data.usuario.telefono || "",
        token: data.token,
        rol: data.usuario.rol
      };

      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      return true;

    } catch (error) {
      console.log("Error Login:", error);
      Alert.alert("Error inesperado");
      return false;
    }
  };

  // REGISTRO – Backend + Firebase (solo verificación)
  const register = async (nombre: string, correo: string, contrasena: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/usuarios/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contrasena }),
      });

      if (!res.ok) {
        Alert.alert("No se pudo registrar");
        return false;
      }

      const fb = await createUserWithEmailAndPassword(auth, correo, contrasena);
      await sendEmailVerification(fb.user);

      Alert.alert("Verifica tu correo", "Se envió un enlace a tu bandeja");
      return true;

    } catch (e: any) {
      Alert.alert("Error Registro", e.message);
      return false;
    }
  };

  // Logout – cierra sesión en Firebase y borra AsyncStorage
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
    await signOut(auth);
  };

  // Actualizar perfil
  const actualizarPerfil = async (datos: Partial<User & { contrasena?: string }>) => {
    if (!user) return null;
    try {
      const res = await fetch(`${BASE_URL}/api/usuarios/actualizar/${user.idUsuario}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correoActual: user.correo, ...datos }),
      });

      if (!res.ok) return null;

      const data = await res.json();

      const actualizado: User = {
        idUsuario: data.usuario.idUsuario,
        nombre: data.usuario.nombre,
        correo: data.usuario.correo,
        direccion: data.usuario.direccion || '',
        telefono: data.usuario.telefono || '',
        token: user.token,
        rol: user.rol,
      };

      setUser(actualizado);
      await AsyncStorage.setItem('user', JSON.stringify(actualizado));
      return actualizado;

    } catch (e) {
      console.log('Error actualizar:', e);
      return null;
    }
  };

  // Recuperación de contraseña
  const requestPasswordReset = async (correo: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/recuperacion/solicitar-codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  const resetPassword = async (correo: string, codigo: string, nuevaContrasena: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/recuperacion/resetear-contrasena`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, codigo, nuevaContrasena }),
      });
      return res.ok;
    } catch {
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      login,
      register,
      logout,
      actualizarPerfil,
      requestPasswordReset,
      resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
