/*import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
const BASE_URL = 'http://10.0.2.2:8500';
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
    requestPasswordReset: async () => false, // Valor por defecto añadido
    resetPassword: async () => false, // Valor por defecto añadido
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
            const res = await fetch(`${BASE_URL}/api/usuarios/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, contrasena }),
            });
            if (!res.ok) return false;
            const data = await res.json(); 
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
            const res = await fetch(`${BASE_URL}/api/usuarios/registro`, {
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
            };
            setUser(actualizado);
            await AsyncStorage.setItem('user', JSON.stringify(actualizado));
            return actualizado;
        } catch (e) {
            console.log('Error actualizar:', e);
            return null;
        }
    };
    
    const requestPasswordReset = async (correo: string): Promise<boolean> => {
        try {
            // RUTA ACTUALIZADA
            const res = await fetch(`${BASE_URL}/api/recuperacion/solicitar-codigo`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo }),
            });
            // El backend devuelve 200 OK si procesó la solicitud (independientemente si el correo existe), para seguridad.
            return res.ok;
        } catch (e) {
            console.log('Error solicitud código:', e);
            return false;
        }
    };

    const resetPassword = async (correo: string, codigo: string, nuevaContrasena: string): Promise<boolean> => {
        try {
            // RUTA ACTUALIZADA
            const res = await fetch(`${BASE_URL}/api/recuperacion/resetear-contrasena`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ correo, codigo, nuevaContrasena }),
            });
            return res.ok;
        } catch (e) {
            console.log('Error reseteo contraseña:', e);
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

export const useAuth = () => useContext(AuthContext);*/
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';

// 🔥 Firebase añadido
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth } from '../firebase/firabaseConfig';

const BASE_URL = 'http://10.0.2.2:8500';

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

  // 🔐 Login ahora valida verificación Firebase antes de usar tu backend
  const login = async (correo: string, contrasena: string) => {
    try {
      const fb = await signInWithEmailAndPassword(auth, correo, contrasena);

      if (!fb.user.emailVerified) {
        Alert.alert('Correo no verificado', 'Revisa tu bandeja de entrada');
        await signOut(auth);
        return false;
      }

      // Si Firebase OK → llamar tu API como siempre
      const res = await fetch(`${BASE_URL}/api/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, contrasena }),
      });

      if (!res.ok) return false;
      const data = await res.json();

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

    } catch (e: any) {
      Alert.alert('Error Login, porfavor registrese ' );
      return false;
    }
  };

  // Registro doble: primero backend, luego Firebase (solo verificación)
  const register = async (nombre: string, correo: string, contrasena: string) => {
    try {
      const res = await fetch(`${BASE_URL}/api/usuarios/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, correo, contrasena }),
      });

      if (!res.ok) return false;

      const fb = await createUserWithEmailAndPassword(auth, correo, contrasena);
      await sendEmailVerification(fb.user);

      Alert.alert('Verifica tu correo', 'Se envió un enlace de verificación');
      return true;

    } catch (e: any) {
      Alert.alert('Error Registro', e.message);
      return false;
    }
  };

  // Logout ahora también cierra sesión en Firebase
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
    await signOut(auth);
  };

  //  Lo demás NO SE TOCA
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
      };
      setUser(actualizado);
      await AsyncStorage.setItem('user', JSON.stringify(actualizado));
      return actualizado;
    } catch (e) {
      console.log('Error actualizar:', e);
      return null;
    }
  };

  const requestPasswordReset = async (correo: string): Promise<boolean> => {
    try {
      const res = await fetch(`${BASE_URL}/api/recuperacion/solicitar-codigo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo }),
      });
      return res.ok;
    } catch (e) {
      console.log('Error solicitud código:', e);
      return false;
    }
  };

  const resetPassword = async (correo: string, codigo: string, nuevaContrasena: string): Promise<boolean> => {
    try {
      const res = await fetch(`${BASE_URL}/api/recuperacion/resetear-contrasena`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ correo, codigo, nuevaContrasena }),
      });
      return res.ok;
    } catch (e) {
      console.log('Error reseteo contraseña:', e);
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
