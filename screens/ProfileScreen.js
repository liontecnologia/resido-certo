import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  Image
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const { logout } = useAuth();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Carregar dados do usuário
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userData');
        if (userDataString) {
          setUserData(JSON.parse(userDataString));
        }
      } catch (error) {
        console.log('Erro ao carregar dados do usuário:', error);
      }
    };

    loadUserData();
  }, []);

  // Função para logout (agora usando o contexto)
  const handleLogout = () => {
    Alert.alert(
      'Sair da Conta',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          onPress: async () => {
            try {
              await logout();
            } catch (error) {
              console.log('Erro ao fazer logout:', error);
              Alert.alert('Erro', 'Não foi possível fazer logout. Tente novamente.');
            }
          }
        },
      ]
    );
  };

  if (!userData) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>
            {userData.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{userData.name}</Text>
        <Text style={styles.userEmail}>{userData.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informações da Empresa</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Ionicons name="business" size={20} color="#6b7280" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Empresa</Text>
              <Text style={styles.infoValue}>{userData.company}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color="#6b7280" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Telefone</Text>
              <Text style={styles.infoValue}>{userData.phone}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="location" size={20} color="#6b7280" style={styles.infoIcon} />
            <View>
              <Text style={styles.infoLabel}>Endereço</Text>
              <Text style={styles.infoValue}>{userData.address}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Configurações</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="person" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Editar Perfil</Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="notifications" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Notificações</Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="lock-closed" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Alterar Senha</Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suporte</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Central de Ajuda</Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Termos de Uso</Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="shield" size={20} color="#6b7280" />
            <Text style={styles.menuItemText}>Política de Privacidade</Text>
            <Ionicons name="chevron-forward" size={20} color="#d1d5db" />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Ionicons name="log-out" size={20} color="#ef4444" />
        <Text style={styles.logoutButtonText}>Sair da Conta</Text>
      </TouchableOpacity>

      <View style={styles.footer}>
        <Text style={styles.versionText}>CinzAgro App v1.0.0</Text>
        <Text style={styles.copyrightText}>© 2025 CinzAgro</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  userEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  infoIcon: {
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  menuItemText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#ef4444',
    fontWeight: '500',
    marginLeft: 8,
  },
  footer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  versionText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  copyrightText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
});

export default ProfileScreen;