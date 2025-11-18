import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type User = {
  idUsuario: number;
  nombre: string;
  correo: string;
  direccion?: string;
  telefono?: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (correo: string, contrasena: string) => Promise<boolean>;
  register: (nombre: string, correo: string, contrasena: string) => Promise<boolean>;
  logout: () => Promise<void>;
  actualizarPerfil: (datos: Partial<User & { contrasena?: string }>) => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: async () => false,
  register: async () => false,
  logout: async () => {},
  actualizarPerfil: async () => null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

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

  const login = async (correo: string, contrasena: string) => {
    try {
      const res = await fetch('http://10.0.2.2:8500/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (!res.ok) return false;

      const data = await res.json(); // { token, usuario }

      const userData: User = {
        idUsuario: data.usuario.idUsuario,
        nombre: data.usuario.nombre,
        correo: data.usuario.correo,
        direccion: data.usuario.direccion || '',
        telefono: data.usuario.telefono || '',
        token: data.token,
      };

      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      return true;
    } catch (e) {
      console.log('Error login:', e);
      return false;
    }
  };

  const register = async (nombre: string, correo: string, contrasena: string) => {
    try {
      const res = await fetch('http://10.0.2.2:8500/api/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contrasena }),
      });
      return res.ok;
    } catch (e) {
      console.log('Error registro:', e);
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  const actualizarPerfil = async (datos: Partial<User & { contrasena?: string }>) => {
    if (!user) return null;

    try {
      const res = await fetch(`http://10.0.2.2:8500/api/usuarios/actualizar/${user.idUsuario}`, {
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
      };

      setUser(actualizado);
      await AsyncStorage.setItem('user', JSON.stringify(actualizado));
      return actualizado;
    } catch (e) {
      console.log('Error actualizar:', e);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, actualizarPerfil }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
