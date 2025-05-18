// App.js - Atualizado para usar o Context API
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';

// Contexto de Autenticação
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Telas comuns para todos os tipos de usuário
import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';

// Telas para agroindústrias
import DashboardScreen from './screens/DashboardScreen';
import NewCollectionScreen from './screens/NewCollectionScreen';
import CollectionDetailsScreen from './screens/CollectionDetailsScreen';

// Telas para órgãos públicos
import PublicDashboardScreen from './screens/PublicDashboardScreen';
import RequestWasteScreen from './screens/RequestWasteScreen';
import RequestDetailsScreen from './screens/RequestDetailsScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Componente de navegação para Agroindústrias
function IndustryTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Nova Coleta') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Nova Coleta" 
        component={NewCollectionScreen}
        options={{ 
          headerShown: true,
          headerTitle: 'Solicitar Nova Coleta',
          headerStyle: {
            backgroundColor: '#22c55e',
          },
          headerTintColor: '#fff',
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen}
        options={{ 
          headerShown: true,
          headerTitle: 'Meu Perfil',
          headerStyle: {
            backgroundColor: '#22c55e',
          },
          headerTintColor: '#fff',
        }}
      />
    </Tab.Navigator>
  );
}

// Componente de navegação para Órgãos Públicos
function PublicTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Solicitar Resíduos') {
            iconName = focused ? 'leaf' : 'leaf-outline';
          } else if (route.name === 'Perfil') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#22c55e',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={PublicDashboardScreen} 
        options={{ headerShown: false }}
      />
      <Tab.Screen 
        name="Solicitar Resíduos" 
        component={RequestWasteScreen}
        options={{ 
          headerShown: true,
          headerTitle: 'Solicitar Resíduos',
          headerStyle: {
            backgroundColor: '#22c55e',
          },
          headerTintColor: '#fff',
        }}
      />
      <Tab.Screen 
        name="Perfil" 
        component={ProfileScreen}
        options={{ 
          headerShown: true,
          headerTitle: 'Meu Perfil',
          headerStyle: {
            backgroundColor: '#22c55e',
          },
          headerTintColor: '#fff',
        }}
      />
    </Tab.Navigator>
  );
}

// Componente de navegação principal que usa o contexto de autenticação
function AppNavigator() {
  const { isLoggedIn, isLoading, userType } = useAuth();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#22c55e" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {!isLoggedIn ? (
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
      ) : (
        <>
          {userType === 'industry' ? (
            // Rotas para agroindústrias
            <>
              <Stack.Screen 
                name="IndustryHome" 
                component={IndustryTabs} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="CollectionDetails" 
                component={CollectionDetailsScreen}
                options={{ 
                  headerTitle: 'Detalhes da Coleta',
                  headerStyle: {
                    backgroundColor: '#22c55e',
                  },
                  headerTintColor: '#fff',
                }}
              />
            </>
          ) : (
            // Rotas para órgãos públicos
            <>
              <Stack.Screen 
                name="PublicHome" 
                component={PublicTabs} 
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="RequestDetails" 
                component={RequestDetailsScreen}
                options={{ 
                  headerTitle: 'Detalhes da Solicitação',
                  headerStyle: {
                    backgroundColor: '#22c55e',
                  },
                  headerTintColor: '#fff',
                }}
              />
            </>
          )}
        </>
      )}
    </Stack.Navigator>
  );
}

// Componente App principal
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}