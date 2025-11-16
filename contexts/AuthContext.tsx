import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type User = {
  nombre: string;
  correo: string;
  token: string;
};

type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void; // Para modo invitado o actualizaciones manuales
  login: (correo: string, contrasena: string) => Promise<boolean>;
  register: (nombre: string, correo: string, contrasena: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  login: async () => false,
  register: async () => false,
  logout: async () => {},
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
      const response = await fetch('http://10.0.2.2:8500/api/usuarios/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (!response.ok) return false;

      const data = await response.json(); // { nombre, correo, token }

      const userData: User = {
        nombre: data.nombre,
        correo: data.correo,
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
      const response = await fetch('http://10.0.2.2:8500/api/usuarios/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contrasena }),
      });

      return response.ok;
    } catch (e) {
      console.log('Error registro:', e);
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar AuthContext fácilmente
export const useAuth = () => useContext(AuthContext);
