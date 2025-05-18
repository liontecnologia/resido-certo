import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import StatusBadge from '../components/StatusBadge';

const CollectionDetailsScreen = ({ route, navigation }) => {
  const { collection } = route.params;

  // Formatar data para exibição
  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: ptBR });
    } catch (error) {
      return dateString || 'Data não disponível';
    }
  };

  // Função para cancelar coleta
  const handleCancelCollection = () => {
    Alert.alert(
      'Cancelar Coleta',
      'Tem certeza que deseja cancelar esta solicitação de coleta?',
      [
        { text: 'Não', style: 'cancel' },
        { 
          text: 'Sim, Cancelar', 
          style: 'destructive',
          onPress: () => {
            // Aqui seria implementada a lógica para cancelar a coleta
            // Neste MVP simples, apenas voltamos para a tela anterior
            Alert.alert('Solicitação Cancelada', 'Sua solicitação foi cancelada com sucesso.');
            navigation.goBack();
          } 
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <Text style={styles.requestNumber}>{collection.requestNumber}</Text>
        <StatusBadge status={collection.status} />
      </View>

      {/* Informações da Coleta */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="information-circle" size={20} color="#22c55e" />
          <Text style={styles.cardTitle}>Informações da Coleta</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Tipo de Resíduo:</Text>
          <Text style={styles.infoValue}>
            {collection.wasteType === 'biomass_ash' ? 'Cinza de Caldeira (Biomassa)' : 
             collection.wasteType === 'rice_husk_ash' ? 'Cinza de Casca de Arroz' :
             collection.wasteType === 'sugarcane_ash' ? 'Cinza de Bagaço de Cana' :
             collection.wasteType === 'wood_ash' ? 'Cinza de Madeira' :
             collection.wasteType === 'other' ? 'Outro' : collection.wasteType}
          </Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Quantidade:</Text>
          <Text style={styles.infoValue}>{collection.estimatedQuantity}</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Data da Solicitação:</Text>
          <Text style={styles.infoValue}>{formatDate(collection.requestDate)}</Text>
        </View>

        {collection.scheduledDate && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data Agendada:</Text>
            <Text style={styles.infoValue}>{formatDate(collection.scheduledDate)}</Text>
          </View>
        )}
        
        {collection.completedDate && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data da Coleta:</Text>
            <Text style={styles.infoValue}>{formatDate(collection.completedDate)}</Text>
          </View>
        )}

        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Observações:</Text>
          <Text style={styles.notesText}>
            {collection.notes || 'Nenhuma observação fornecida.'}
          </Text>
        </View>
      </View>

      {/* Endereço */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="location" size={20} color="#22c55e" />
          <Text style={styles.cardTitle}>Local de Coleta</Text>
        </View>

        <Text style={styles.addressTitle}>{collection.companyName}</Text>
        <Text style={styles.addressText}>{collection.location}</Text>
      </View>

      {/* Status da Coleta */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Ionicons name="time" size={20} color="#22c55e" />
          <Text style={styles.cardTitle}>Status da Coleta</Text>
        </View>

        <View style={styles.timelineContainer}>
          <View style={[
            styles.timelineItem, 
            collection.status === 'pending' || collection.status === 'scheduled' || collection.status === 'completed' 
              ? styles.timelineItemActive 
              : styles.timelineItemInactive
          ]}>
            <View style={styles.timelineIconContainer}>
              <Ionicons name="create" size={16} color="#ffffff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Solicitação Registrada</Text>
              <Text style={styles.timelineDate}>{formatDate(collection.requestDate)}</Text>
            </View>
          </View>

          <View style={[
            styles.timelineLine, 
            collection.status === 'scheduled' || collection.status === 'completed' 
              ? styles.timelineLineActive 
              : styles.timelineLineInactive
          ]} />

          <View style={[
            styles.timelineItem, 
            collection.status === 'scheduled' || collection.status === 'completed' 
              ? styles.timelineItemActive 
              : styles.timelineItemInactive
          ]}>
            <View style={styles.timelineIconContainer}>
              <Ionicons name="calendar" size={16} color="#ffffff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Coleta Agendada</Text>
              <Text style={styles.timelineDate}>
                {collection.scheduledDate 
                  ? formatDate(collection.scheduledDate) 
                  : 'Aguardando agendamento'}
              </Text>
            </View>
          </View>

          <View style={[
            styles.timelineLine, 
            collection.status === 'completed' 
              ? styles.timelineLineActive 
              : styles.timelineLineInactive
          ]} />

          <View style={[
            styles.timelineItem, 
            collection.status === 'completed' 
              ? styles.timelineItemActive 
              : styles.timelineItemInactive
          ]}>
            <View style={styles.timelineIconContainer}>
              <Ionicons name="checkmark" size={16} color="#ffffff" />
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Coleta Realizada</Text>
              <Text style={styles.timelineDate}>
                {collection.completedDate 
                  ? formatDate(collection.completedDate) 
                  : 'Pendente'}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Botões de Ação */}
      {collection.status === 'pending' && (
        <View style={styles.actionButtons}>
          <TouchableOpacity 
            style={styles.cancelButton}
            onPress={handleCancelCollection}
          >
            <Ionicons name="close-circle" size={16} color="#ef4444" />
            <Text style={styles.cancelButtonText}>Cancelar Solicitação</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.contactButton}
          onPress={() => Alert.alert('Suporte', 'Entre em contato com nossa equipe pelo telefone (65) 99999-9999 ou pelo email suporte@cinzagro.com.br')}
        >
          <Ionicons name="call" size={16} color="#22c55e" />
          <Text style={styles.contactButtonText}>Contatar Suporte</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  requestNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
    color: '#374151',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    width: 140,
  },
  infoValue: {
    fontSize: 14,
    color: '#111827',
    fontWeight: '500',
    flex: 1,
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  notesLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: '#374151',
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#374151',
  },
  timelineContainer: {
    paddingVertical: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timelineItemActive: {
    opacity: 1,
  },
  timelineItemInactive: {
    opacity: 0.5,
  },
  timelineIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  timelineContent: {
    flex: 1,
    paddingVertical: 8,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  timelineDate: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  timelineLine: {
    width: 2,
    height: 24,
    marginLeft: 15,
  },
  timelineLineActive: {
    backgroundColor: '#22c55e',
  },
  timelineLineInactive: {
    backgroundColor: '#d1d5db',
  },
  actionButtons: {
    margin: 16,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
  },
  cancelButtonText: {
    color: '#ef4444',
    fontWeight: '500',
    marginLeft: 8,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    padding: 12,
  },
  contactButtonText: {
    color: '#22c55e',
    fontWeight: '500',
    marginLeft: 8,
  },
});

export default CollectionDetailsScreen;