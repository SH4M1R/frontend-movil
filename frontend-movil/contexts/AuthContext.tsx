import usuarios from '@/data/usuarios';
import React, { createContext, ReactNode, useContext, useState } from 'react';

type User = {
  username: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => false,
  register: async () => false,
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const foundUser = usuarios.find(
      (u) => u.correo === email && u.contraseña === password
    );
    if (foundUser) {
      setUser({ username: foundUser.username, email: foundUser.correo });
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string) => {
    const exists = usuarios.find((u) => u.correo === email);
    if (exists) return false;

    usuarios.push({ username: name, correo: email, contraseña: password });
    setUser({ username: name, email });
    return true;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
