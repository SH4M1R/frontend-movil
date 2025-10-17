import usuarios from '@/data/usuarios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type User = {
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Cargar usuario desde AsyncStorage al iniciar
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

  const login = async (email: string, password: string) => {
    const foundUser = usuarios.find(
      (u) => u.correo === email && u.contraseña === password
    );
    if (foundUser) {
      const userData = { username: foundUser.username, email: foundUser.correo };
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string) => {
    const exists = usuarios.find((u) => u.correo === email);
    if (exists) return false;

    usuarios.push({ username: name, correo: email, contraseña: password });
    const userData = { username: name, email };
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    return true;
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
