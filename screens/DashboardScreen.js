import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CollectionCard from '../components/CollectionCard';

// Constante para o status bar height
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 40 : StatusBar.currentHeight;

const DashboardScreen = ({ navigation }) => {
  const [collections, setCollections] = useState([]);
  const [userData, setUserData] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Carregar dados de coletas do AsyncStorage
  const loadCollections = async () => {
    try {
      const storedCollections = await AsyncStorage.getItem('collections');
      if (storedCollections) {
        setCollections(JSON.parse(storedCollections));
      }

      const userDataString = await AsyncStorage.getItem('userData');
      if (userDataString) {
        setUserData(JSON.parse(userDataString));
      }
    } catch (error) {
      console.log('Erro ao carregar dados:', error);
    }
  };

  // Carregar dados na montagem do componente
  useEffect(() => {
    loadCollections();

    // Também recarregamos quando a tela recebe foco (voltando de outra tela)
    const unsubscribe = navigation.addListener('focus', () => {
      loadCollections();
    });

    return unsubscribe;
  }, [navigation]);

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await loadCollections();
    setRefreshing(false);
  };

  // Função para navegar para detalhes da coleta
  const handleCollectionPress = (collection) => {
    navigation.navigate('CollectionDetails', { collection });
  };

  // Função para criar uma nova solicitação de coleta
  const handleNewCollection = () => {
    navigation.navigate('Nova Coleta');
  };

  // Calcular status para dashboard
  const pendingCollections = collections.filter(c => c.status === 'pending').length;
  const scheduledCollections = collections.filter(c => c.status === 'scheduled').length;
  const completedCollections = collections.filter(c => c.status === 'completed').length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f9fafb" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.contentContainer}>
          <View style={styles.header}>
            <View>
              <Text style={styles.welcomeText}>Olá, {userData?.name.split(' ')[0] || 'Usuário'}</Text>
              <Text style={styles.companyText}>{userData?.company || 'Empresa'}</Text>
            </View>
            <TouchableOpacity 
              style={styles.newButton}
              onPress={handleNewCollection}
            >
              <Text style={styles.newButtonText}>Nova Coleta</Text>
              <Ionicons name="add-circle" size={20} color="#ffffff" />
            </TouchableOpacity>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{pendingCollections}</Text>
              <Text style={styles.statLabel}>Pendentes</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{scheduledCollections}</Text>
              <Text style={styles.statLabel}>Agendadas</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{completedCollections}</Text>
              <Text style={styles.statLabel}>Concluídas</Text>
            </View>
          </View>

          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Minhas Coletas</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>Ver Todas</Text>
            </TouchableOpacity>
          </View>

          {collections.length > 0 ? (
            <FlatList
              data={collections.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate))}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <CollectionCard 
                  collection={item} 
                  onPress={() => handleCollectionPress(item)}
                />
              )}
              contentContainerStyle={styles.listContent}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="leaf-outline" size={60} color="#d1d5db" />
              <Text style={styles.emptyStateText}>Nenhuma coleta solicitada</Text>
              <Text style={styles.emptyStateSubtext}>
                Solicite sua primeira coleta de cinzas pressionando o botão "Nova Coleta"
              </Text>
              <TouchableOpacity 
                style={styles.emptyStateButton}
                onPress={handleNewCollection}
              >
                <Text style={styles.emptyStateButtonText}>Solicitar Coleta</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: STATUSBAR_HEIGHT,
  },
  safeArea: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  companyText: {
    fontSize: 14,
    color: '#6b7280',
  },
  newButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  newButtonText: {
    color: '#ffffff',
    fontWeight: '500',
    marginRight: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  viewAll: {
    fontSize: 14,
    color: '#22c55e',
  },
  listContent: {
    paddingBottom: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  emptyStateButton: {
    backgroundColor: '#22c55e',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  emptyStateButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
});

export default DashboardScreen;