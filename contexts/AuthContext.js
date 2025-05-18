import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Criar o contexto
const AuthContext = createContext();

// Hook personalizado para usar o contexto de autenticação
export const useAuth = () => useContext(AuthContext);

// Provedor do contexto que envolverá o App
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar status de login ao iniciar
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const [token, type] = await Promise.all([
          AsyncStorage.getItem('userToken'),
          AsyncStorage.getItem('userType')
        ]);
        setIsLoggedIn(token !== null);
        setUserType(type);
      } catch (e) {
        console.log('Erro ao verificar login', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, []);

  // Função de login
  const login = async (email, password, type) => {
    try {
      // Simulação de login para o MVP
      await AsyncStorage.setItem('userToken', 'dummy-token');
      await AsyncStorage.setItem('userType', type);
      
      // Dados do usuário simulados
      await AsyncStorage.setItem('userData', JSON.stringify({
        name: type === 'industry' ? 'Gestor Agroindústria' : 'Gestor Público',
        company: type === 'industry' ? 'Agroindústria Exemplo' : 'Secretaria de Agricultura',
        email: email,
        phone: '(65) 99999-9999',
        address: 'Av. Principal, 123 - Tangará da Serra, MT'
      }));
      
      setUserType(type);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      console.log('Erro no login:', error);
      return false;
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(['userToken', 'userType', 'userData']);
      setIsLoggedIn(false);
      setUserType(null);
      return true;
    } catch (error) {
      console.log('Erro no logout:', error);
      return false;
    }
  };

  // Valores/funções expostos pelo contexto
  const value = {
    isLoggedIn,
    userType,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};