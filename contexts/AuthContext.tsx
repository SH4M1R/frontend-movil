import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

// Dirección IP local de tu máquina para Expo/Android Emulator (NO 'localhost')
const BASE_URL = 'http://10.0.2.2:8500';

// --- Tipos existentes ---
type User = {
    idUsuario: number;
    nombre: string;
    correo: string;
    direccion?: string;
    telefono?: string;
    token: string;
};

// --- AuthContextType (Añadiendo nuevas funciones) ---
type AuthContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
    login: (correo: string, contrasena: string) => Promise<boolean>;
    register: (nombre: string, correo: string, contrasena: string) => Promise<boolean>;
    logout: () => Promise<void>;
    actualizarPerfil: (datos: Partial<User & { contrasena?: string }>) => Promise<User | null>;
    
    // --- NUEVAS FUNCIONES DE RECUPERACIÓN ---
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


    // --- MÉTODOS DE RECUPERACIÓN DE CONTRASEÑA ACTUALIZADOS ---

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

export const useAuth = () => useContext(AuthContext);